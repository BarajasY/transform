use serde::{Serialize, Deserialize};

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

#[derive(Serialize, Deserialize)]
pub struct JsonFile {
  start: String,
  quality: f32
}

#[tauri::command]
pub fn edit_json(initial_path: String, quality: f32) -> String {
    let mut file = {
        let text = std::fs::read_to_string("src/config.json").unwrap();
        serde_json::from_str::<JsonFile>(&text).unwrap()
    };

    file.start = initial_path;
    file.quality = quality;

    /* file["start"] = Value::String(initial_path);
    file["quality"] = Value::as_f64(quality); */

    std::fs::write(
        "src/config.json",
        serde_json::to_string_pretty(&file).unwrap(),
    )
    .unwrap();

  "File updated successfully".to_string()
}

pub fn get_quality_from_json() -> f32 {
  let file = {
    let text = std::fs::read_to_string("src/config.json").unwrap();
    serde_json::from_str::<JsonFile>(&text).unwrap()
  };

  file.quality
}

pub fn get_start_from_json() -> String {
  let file = {
    let text = std::fs::read_to_string("src/config.json").unwrap();
    serde_json::from_str::<JsonFile>(&text).unwrap()
  };

  file.start
}

#[tauri::command]
pub fn get_json() -> JsonFile {
    let text = std::fs::read_to_string("src/config.json").unwrap();
    serde_json::from_str::<JsonFile>(&text).unwrap()
}
