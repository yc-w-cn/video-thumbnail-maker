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

    // 生成 FFmpeg 命令
    let ffmpeg_cmd = format!(
        "ffmpeg -i '{}' -vf 'scale={}:-1,fps=1/{}' -vframes {} '{}/thumb_%03d.jpg'",
        path,
        width,
        interval,
        thumbnails,
        temp_dir.path().display()
    );

    execute_command(&ffmpeg_cmd)?;

    // 计算行数
    let rows = (thumbnails as f32 / cols as f32).ceil() as u32;

    // 生成 ImageMagick 命令
    let montage_cmd = format!(
        "montage {}/*.jpg -tile {}x{} -geometry +0+0 {}/output.jpg",
        temp_dir.path().display(),
        cols,
        rows,
        output_path.display()
    );

    execute_command(&montage_cmd)?;

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
