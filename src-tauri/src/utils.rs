use std::process::Command;

// 检查命令是否存在
pub fn check_command_exists(command: &str) -> bool {
    Command::new("which")
        .arg(command)
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

// 获取视频时长
pub fn get_video_duration(path: &str) -> Result<f64, String> {
    let output = Command::new("ffprobe")
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

// 执行命令
pub fn execute_command(cmd: &str) -> Result<(), String> {
    Command::new("sh")
        .arg("-c")
        .arg(cmd)
        .status()
        .map_err(|e| e.to_string())?;
    Ok(())
}