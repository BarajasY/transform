use std::ops::Deref;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

pub fn divide_paths(path: String) -> Vec<String> {
    let path_vec_str: Vec<&str> = path.split('/').collect();
    let path_vec_string: Vec<String> = path_vec_str.iter().map(|&s| s.to_string()).collect();
    path_vec_string
}

pub fn remove_extension(name: String) -> String {
    let mut no_extension: String = name.clone();
    if name.contains(".png") {
        no_extension = name.strip_suffix(".png").unwrap().to_string();
    }
    if name.contains(".jpg") {
        no_extension = name.strip_suffix(".jpg").unwrap().to_string();
    }
    no_extension
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JsonFile {
    start: String,
    quality: f32,
}

#[tauri::command]
pub fn edit_json(initial_path: String, quality: f32, handle: AppHandle) -> String {
    let resource = handle
        .path_resolver()
        .resolve_resource("resources/config.json")
        .expect("Error resolving resource");

    handle.fs_scope().allow_file(&resource).expect("Unable to allow file.");


    let file: JsonFile = JsonFile { start: initial_path, quality };

    match std::fs::write(&resource, serde_json::to_string(&file).unwrap()) {
        Ok(_) => "File updated successfully".to_string(),
        Err(e) => format!("{} {}", e, &resource.deref().to_str().unwrap())
    }
}

pub fn _get_quality_from_json(handle: AppHandle) -> f32 {
    let resource = handle
        .path_resolver()
        .resolve_resource("resources/config.json")
        .expect("Error resolving resource");

    let file: JsonFile = {
        let text = std::fs::File::open(resource).unwrap();
        serde_json::from_reader(text).unwrap()
    };

    file.quality
}

pub fn get_start_from_json(handle: AppHandle) -> String {
    let resource = handle
        .path_resolver()
        .resolve_resource("resources/config.json")
        .expect("Error resolving resource");
    let file: JsonFile = {
        let text = std::fs::File::open(resource).unwrap();
        serde_json::from_reader(text).unwrap()
    };

    file.start
}

#[tauri::command]
pub fn get_json(handle: AppHandle) -> JsonFile {
    let resource = handle
        .path_resolver()
        .resolve_resource("resources/config.json")
        .expect("Error resolving resource");
    let text = std::fs::File::open(resource).unwrap();
    serde_json::from_reader(text).unwrap()
}
