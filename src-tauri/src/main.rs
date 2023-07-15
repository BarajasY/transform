// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::Write;
use std::ops::Deref;
use std::{
    ffi::OsStr,
    fs::{self},
};
use utils::{edit_json, get_json, get_quality_from_json, get_start_from_json, remove_extension};
mod utils;
use webp::Encoder;


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            write, dirs, make_webp, edit_json, get_json
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn write() {
    println!("Hola");
}

#[tauri::command]
fn dirs(path_string: Option<String>) -> (Vec<String>, Vec<String>, Vec<String>) {
    let path = match path_string {
        Some(s) => s,
        None => get_start_from_json(),
    };
    /*     let path: String = path_string; */
    println!("{}", path);

    //Creating empty array/vector of Strings
    let mut file_names_vec: Vec<String> = Vec::new();
    let mut folders_vec: Vec<String> = Vec::new();

    //Reads all the directories existing in the path supplied.
    let paths = fs::read_dir(&path).expect("Error reading directory");
    let paths2 = fs::read_dir(&path).expect("Error reading directory");

    //Filters the directories by extension == png or jpg
    let images = paths.filter_map(Result::ok).filter(|d| {
        d.path().extension() == Some(OsStr::new("png"))
            || d.path().extension() == Some(OsStr::new("jpg"))
    });

    //Removes the extension the image has.
    //Converts DirEntry to String
    //Pushes into file_names_vec.
    /*     for image in images {
      file_names_vec.push(remove_extension(&mut String::from(image.file_name().to_str().unwrap())));
    } */

    //Filters the directories. Keeps those who are folders.
    let folders = paths2
        .filter_map(Result::ok)
        .filter(|f| f.file_type().unwrap().is_dir());

    //Converts "ReadDir" to String and pushes into vector.
    for image in images {
        file_names_vec.push(String::from(image.file_name().to_str().unwrap()));
    }

    //Pushes into paths_vec the String of the PATH name
    /*     for file in &mut file_names_vec {
        paths_vec.push(format!("{}/{}", &path, file));
    } */

    for folder in folders {
        folders_vec.push(String::from(folder.path().to_str().unwrap()))
    }

    //Returns vector.
    (file_names_vec, utils::divide_paths(path), folders_vec)
}

#[tauri::command]
fn make_webp(path_file: Option<String>, file_name: String) -> Option<String> {
    let path_file_no_option = match path_file {
        Some(p) => p,
        None => get_start_from_json(),
    };

    let path_to_image = format!("{}/{}", path_file_no_option, file_name);
    println!("{}", path_to_image);

    //Opens the image file using image::open and taking path as argument.
    let image = image::io::Reader::open(path_to_image).unwrap().with_guessed_format().unwrap().decode().unwrap();
/*     let image: DynamicImage = match image {
        Ok(img) => img.with_guessed_format().unwrap().decode().unwrap(), //ImageReader::with_guessed_format() function guesses if image needs to be opened in JPEG or PNG format.
        Err(e) => {
            println!("Error: {}", e);
            return None;
        }
    }; */

    // Created the encoder of the image out of the image itself.
    let encoder:Encoder = Encoder::from_image(&image).unwrap();

    let quality = get_quality_from_json();

    //Encodes the encoder taking quality (float) as an argument (Take this as the level of compression that the image will have)
    let quality = encoder.encode(quality);

    //Gets the bytes out of the encoded image.
    let image_bytes = quality.deref();

    let created_file_path = format!(
        "{}/{}.webp",
        &path_file_no_option,
        remove_extension(file_name)
    );
    //Creates an empty file with .webp extension.
    let mut webp_image = File::create(created_file_path).unwrap();
    //Fills the empty .webp file with bytes from image_bytes.
    match webp_image.write_all(image_bytes) {
        Err(e) => {
            println!("Error: {}", e);
            None
        },
        Ok(_) => Some("File created succesfully".to_string())
    }
}
