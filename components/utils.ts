export function form_path(path_arr: string[], index:number): string {
    path_arr.length = index + 1
    return path_arr.join("/")
}
