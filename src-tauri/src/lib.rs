mod commands;
mod utils;

use tauri_plugin_dialog;
use tauri_plugin_opener;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::process_video, 
            commands::process_video_gif,
            commands::check_dependencies,
            commands::check_file_processed,
            commands::scan_folder_for_videos
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}