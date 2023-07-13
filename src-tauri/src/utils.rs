pub fn divide_paths(path:String) -> Vec<String> {
    let path_vec_str:Vec<&str> = path.split('/').collect();
    let path_vec_string: Vec<String> = path_vec_str.iter().map(|&s| s.to_string()).collect();
    path_vec_string
}

pub fn remove_extension(name: String) -> String {
  let mut no_extension:String = name.clone();
  if name.contains(".png") {
    no_extension = name.strip_suffix(".png").unwrap().to_string();
  }
  if name.contains(".jpg") {
    no_extension = name.strip_suffix(".jpg").unwrap().to_string();
  }
  no_extension
}
