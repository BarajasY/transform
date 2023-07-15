export function form_path(path_arr: string[], index:number): string {
    path_arr.length = index + 1
    return path_arr.join("/")
}

export const saveConfig = (start:string, quality:GLfloat) => {
    localStorage.setItem("quality", quality.toString());
    localStorage.setItem("start", start);
}

export const loadConfig = () => {
    const quality = localStorage.getItem("quality")
    const start = localStorage.getItem("start")

    return {
        start,
        quality
    }
}
