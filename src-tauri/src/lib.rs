use ffmpeg_sidecar::{command::FfmpegCommand, event::FfmpegEvent};
use regex::Regex;
use tauri::{AppHandle, Emitter};
use std::path::Path;
use std::fs;

#[tauri::command]
async fn check_dependencies() -> Result<(bool, bool), String> {
    let ffmpeg_exists = check_command_exists("ffmpeg");
    let magick_exists = check_command_exists("montage");
    Ok((ffmpeg_exists, magick_exists))
}

#[tauri::command]
async fn check_file_processed(video_path: String) -> Result<bool, String> {
    // 获取视频文件的目录和文件名
    let path = Path::new(&video_path);
    let parent = path.parent().ok_or("Invalid video path")?;
    let file_stem = path.file_stem().ok_or("Invalid video path")?;
    
    // 构造缩略图文件路径
    let thumbnail_file_name = format!("{}.jpg", file_stem.to_string_lossy());
    let thumbnail_path = parent.join(thumbnail_file_name);
    
    // 检查缩略图文件是否存在
    Ok(thumbnail_path.exists())
}

// 新增：递归遍历文件夹，查找所有视频文件
#[tauri::command]
async fn scan_folder_for_videos(folder_path: String) -> Result<Vec<String>, String> {
    let mut video_files = Vec::new();
    
    // 支持的视频格式
    let supported_extensions = ["mp4", "wmv", "mkv"];
    
    // 递归遍历文件夹
    fn scan_directory(dir: &Path, videos: &mut Vec<String>, extensions: &[&str]) -> Result<(), String> {
        let entries = fs::read_dir(dir).map_err(|e| e.to_string())?;
        
        for entry in entries {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();
            
            if path.is_file() {
                // 检查是否为支持的视频文件
                if let Some(extension) = path.extension() {
                    let ext = extension.to_string_lossy().to_lowercase();
                    if extensions.contains(&ext.as_str()) {
                        videos.push(path.to_string_lossy().to_string());
                    }
                }
            } else if path.is_dir() {
                // 递归遍历子目录
                scan_directory(&path, videos, extensions)?;
            }
        }
        
        Ok(())
    }
    
    let path = Path::new(&folder_path);
    if !path.exists() {
        return Err("Folder does not exist".to_string());
    }
    
    if !path.is_dir() {
        return Err("Path is not a directory".to_string());
    }
    
    scan_directory(&path, &mut video_files, &supported_extensions)?;
    
    Ok(video_files)
}

fn check_command_exists(command: &str) -> bool {
    std::process::Command::new("which")
        .arg(command)
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

#[tauri::command]
async fn process_video(
    app: AppHandle,
    path: String,
    thumbnails: u32,
    width: u32,
    cols: u32,
    output: String,
) -> Result<(), String> {
    let output_path = std::path::Path::new(&output);

    // 创建临时目录
    let temp_dir = tempfile::tempdir().map_err(|e| e.to_string())?;

    // 计算截图间隔
    let duration = get_video_duration(&path)?;
    let interval = duration / thumbnails as f64;

    // 使用 ffmpeg_sidecar 创建命令
    let mut cmd = FfmpegCommand::new();
    cmd.input(&path)
        .args(&["-loglevel", "info"]) // 确保输出包含进度信息
        .args(&["-vf", &format!("scale={}:-1,fps=1/{}", width, interval)])
        .args(&["-vframes", &thumbnails.to_string()])
        .output(&format!("{}/thumb_%03d.jpg", temp_dir.path().display()));

    app.emit("progress-update", Some(0.0))
        .map_err(|e| e.to_string())?;

    cmd.spawn()
        .map_err(|e| e.to_string())?
        .iter()
        .map_err(|e| e.to_string())?
        .for_each(|event| {
            match event {
                FfmpegEvent::Progress(_) => {
                    // 由于Progress事件未收到，这里不再处理
                }
                FfmpegEvent::Log(_, msg) => {
                    eprintln!("[ffmpeg] {}", msg);
                    // 解析日志中的frame信息
                    // 预编译正则表达式，避免重复创建
                    let re = Regex::new(r"frame=\s*(\d+)").unwrap();

                    if msg.contains("frame=") {
                        if let Some(caps) = re.captures(&msg) {
                            if let Some(frame_match) = caps.get(1) {
                                let frame_str = frame_match.as_str();
                                if let Ok(frame) = frame_str.parse::<u32>() {
                                    let progress =
                                        (frame as f32 / thumbnails as f32 * 99.0).min(99.0); // 确保不超过99%
                                    eprintln!(
                                        "[ffmpeg] 解析到帧数: {}, 计算进度: {}%",
                                        frame, progress
                                    );
                                    let _ = app.emit("progress-update", Some(progress));
                                }
                            }
                        }
                    }
                }
                _ => {}
            }
        });

    app.emit("progress-update", Some(99.0))
        .map_err(|e| e.to_string())?;

    // 计算行数
    let rows = (thumbnails as f32 / cols as f32).ceil() as u32;

    // 从输入路径中提取文件名并更改扩展名为.jpg
    let input_filename = std::path::Path::new(&path)
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("output");
    let output_filename = format!("{}.jpg", input_filename);
    let output_file_path = output_path.join(output_filename);

    // 生成 ImageMagick 命令
    let montage_cmd = format!(
        "montage {}/*.jpg -tile {}x{} -geometry +0+0 {:?}",
        temp_dir.path().display(),
        cols,
        rows,
        output_file_path
    );

    execute_command(&montage_cmd)?;
    app.emit("progress-update", Some(100.0))
        .map_err(|e| e.to_string())?;

    Ok(())
}

// 新增：处理视频生成GIF动画
#[tauri::command]
async fn process_video_gif(
    app: AppHandle,
    path: String,
    thumbnails: u32,
    width: u32,
    fps: u32,
    delay: u32,
    loop_count: u32,
    output: String,
) -> Result<(), String> {
    let output_path = std::path::Path::new(&output);

    // 创建临时目录
    let temp_dir = tempfile::tempdir().map_err(|e| e.to_string())?;

    // 计算截图间隔
    let duration = get_video_duration(&path)?;
    let interval = duration / thumbnails as f64;

    // 使用 ffmpeg_sidecar 创建命令来提取帧
    let mut cmd = FfmpegCommand::new();
    cmd.input(&path)
        .args(&["-loglevel", "info"]) // 确保输出包含进度信息
        .args(&["-vf", &format!("scale={}:-1,fps=1/{}", width, interval)])
        .args(&["-vframes", &thumbnails.to_string()])
        .output(&format!("{}/frame_%03d.jpg", temp_dir.path().display()));

    app.emit("progress-update", Some(0.0))
        .map_err(|e| e.to_string())?;

    cmd.spawn()
        .map_err(|e| e.to_string())?
        .iter()
        .map_err(|e| e.to_string())?
        .for_each(|event| {
            match event {
                FfmpegEvent::Progress(_) => {
                    // 由于Progress事件未收到，这里不再处理
                }
                FfmpegEvent::Log(_, msg) => {
                    eprintln!("[ffmpeg] {}", msg);
                    // 解析日志中的frame信息
                    // 预编译正则表达式，避免重复创建
                    let re = Regex::new(r"frame=\s*(\d+)").unwrap();

                    if msg.contains("frame=") {
                        if let Some(caps) = re.captures(&msg) {
                            if let Some(frame_match) = caps.get(1) {
                                let frame_str = frame_match.as_str();
                                if let Ok(frame) = frame_str.parse::<u32>() {
                                    let progress =
                                        (frame as f32 / thumbnails as f32 * 99.0).min(99.0); // 确保不超过99%
                                    eprintln!(
                                        "[ffmpeg] 解析到帧数: {}, 计算进度: {}%",
                                        frame, progress
                                    );
                                    let _ = app.emit("progress-update", Some(progress));
                                }
                            }
                        }
                    }
                }
                _ => {}
            }
        });

    app.emit("progress-update", Some(99.0))
        .map_err(|e| e.to_string())?;

    // 从输入路径中提取文件名并更改扩展名为.gif
    let input_filename = std::path::Path::new(&path)
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("output");
    let output_filename = format!("{}_animation.gif", input_filename);
    let output_file_path = output_path.join(output_filename);

    // 生成 ImageMagick 命令来创建GIF动画
    let convert_cmd = format!(
        "convert -delay {} -loop {} {}/*.jpg {:?}",
        delay,
        loop_count,
        temp_dir.path().display(),
        output_file_path
    );

    execute_command(&convert_cmd)?;
    app.emit("progress-update", Some(100.0))
        .map_err(|e| e.to_string())?;

    Ok(())
}

fn get_video_duration(path: &str) -> Result<f64, String> {
    let output = std::process::Command::new("ffprobe")
        .args(&[
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            path,
        ])
        .output()
        .map_err(|e| e.to_string())?;

    String::from_utf8(output.stdout)
        .map_err(|e| e.to_string())?
        .trim()
        .parse::<f64>()
        .map_err(|e| e.to_string())
}

fn execute_command(cmd: &str) -> Result<(), String> {
    std::process::Command::new("sh")
        .arg("-c")
        .arg(cmd)
        .status()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            process_video, 
            process_video_gif, // 添加新的GIF处理命令
            check_dependencies,
            check_file_processed,
            scan_folder_for_videos
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}