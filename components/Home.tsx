"use client";
import { invoke } from "@tauri-apps/api/tauri";
import style from "@/styles/home.module.css";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";

const Home = () => {
  const [FileImages, setFileImages] = useState<string[]>([""]);
  const [Folders, setFolders] = useState<string[]>([""]);
  const [Dirs, setDirs] = useState<string[]>([""]);
  const [Path, setPath] = useState("");
  const [CurrentPath, setCurrentPath] = useState("");

  const handleInvoke = (folderPath: string) => {
    let path = Path + folderPath;
    setCurrentPath(path);
    invoke("dirs", { pathString: path }).then((p: any) => {
      setFileImages(p[0]);
      setDirs(p[1]);
      setFolders(p[2]);
    });
  };

  return (
    <div className={style.homeContainer}>
      <p>Current dir: &nbsp;{CurrentPath}</p>
      <p className={style.index}>Images</p>
      <div className={style.imagesWrapper}>
        {FileImages.length < 1 ? (
          <p className={style.Error}>No Images found in current directory</p>
        ) : (
          <>
            {FileImages.map((f: string, i: number) => (
              <div className={style.ImageFile}  key={i}>
                <p>{f}</p>
                <BsArrowRight className={style.ImageFileIcon} />
                <p>.WebP</p>
              </div>
            ))}
          </>
        )}
      </div>
      <p className={style.index}>Folders</p>
      <div className={style.foldersWrapper}>
        {Folders.length < 1 ? (
          <p className={style.Error}>No folders found in current directory!</p>
        ) : (
          <>
            {Folders.map((f: string, i: number) => (
              <p onClick={() => handleInvoke(f)} key={i} className={style.FolderFile}>
                {f}
              </p>
            ))}
          </>
        )}
      </div>
      <button onClick={() => handleInvoke("/")}>Start</button>
    </div>
  );
};

export default Home;
