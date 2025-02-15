use ffmpeg_sidecar::{command::FfmpegCommand, event::FfmpegEvent};
use regex::Regex;
use tauri::{AppHandle, Emitter};

#[tauri::command]
async fn check_dependencies() -> Result<(bool, bool), String> {
    let ffmpeg_exists = check_command_exists("ffmpeg");
    let magick_exists = check_command_exists("montage");
    Ok((ffmpeg_exists, magick_exists))
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
        .invoke_handler(tauri::generate_handler![process_video, check_dependencies])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
