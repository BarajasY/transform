// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::open;
use std::fs::File;
use std::io::Write;
use std::ops::Deref;
use std::{
    ffi::OsStr,
    fs::{self},
};
use webp::Encoder;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![write, dirs, make_webp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn write() {
    println!("Hola");
}

#[tauri::command]
fn dirs(path_string: String) -> (Vec<String>, Vec<String>, Vec<String>) {
    let path: String = path_string;

    println!("{}", path);
    //Creating empty array/vector of Strings
    let mut file_names_vec: Vec<String> = Vec::new();
    let mut paths_vec: Vec<String> = Vec::new();
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
    for file in &mut file_names_vec {
        paths_vec.push(format!("{}/{}", &path, file));
    }

    for folder in folders {
        folders_vec.push(String::from(folder.path().to_str().unwrap()))
    }

    //Returns vector.
    (file_names_vec, paths_vec, folders_vec)
}

#[tauri::command]
fn make_webp(path_file: String, quality: f32, file_name: String) -> String {
    let test = format!("{}/{}", path_file, file_name);
    /*       test.push_str(file_name.as_str()); */
    println!("{}", test);
    //Opens the image file using image::open and taking path as argument.
    let image = open(test).unwrap();

    // Created the encoder of the image out of the image itself.
    let encoder = Encoder::from_image(&image).unwrap();

    //Encodes the encoder taking quality (float) as an argument (Take this as the level of compression that the image will have)
    let quality = encoder.encode(quality);

    //Gets the bytes out of the encoded image.
    let image_bytes = quality.deref();

    let created_file_path = format!("{}/{}.webp", &path_file, file_name);
    //Creates an empty file with .webp extension.
    let mut webp_image = File::create(created_file_path).unwrap();
    //Fills the empty .webp file with bytes from image_bytes.
    webp_image.write_all(image_bytes).unwrap();
    String::from("Webp file created successfully!")
}

/*
fn remove_extension(name: &mut String) -> String {
  name.truncate(name.len() - 4);
  name.to_owned()
}
 */
