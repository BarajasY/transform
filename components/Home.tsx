"use client";
import { invoke } from "@tauri-apps/api/tauri";
import style from "@/styles/home.module.css";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import data from "@/public/config.json";

const Home = () => {
  const [FileImages, setFileImages] = useState<string[]>([""]);
  const [Folders, setFolders] = useState<string[]>([""]);
  const [Dirs, setDirs] = useState<string[]>([""]);
  const [CurrentPath, setCurrentPath] = useState("");
  const [Success, setSuccess] = useState(false);
  const InitialPath = "";

  const handleInvoke = (folderPath: string) => {
    let path = InitialPath + folderPath;
    setCurrentPath(path);
    invoke("dirs", { pathString: path }).then((p: any) => {
      setFileImages(p[0]);
      setFolders(p[2]);
    });
    setDirs([...Dirs, path]);
  };

  const createWebp = (fileName: string) => {
    invoke("make_webp", {
      pathFile: CurrentPath,
      quality: 75.0,
      fileName,
    }).then((s) => successHandler(s));
  };

  const successHandler = (s: any) => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {Success ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={style.successTooltip}
          >
            <p>Successfully created webp!</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className={style.homeContainer}>
        <div className={style.homeHeader}>
          <p>Current dir: &nbsp;{CurrentPath}</p>
          <FiSettings />
        </div>
        <p className={style.index}>Images</p>
        <div className={style.imagesWrapper}>
          {FileImages.length < 1 ? (
            <p className={style.Error}>No Images found in current directory</p>
          ) : (
            <>
              {FileImages.map((f: string, i: number) => (
                <div
                  className={style.ImageFile}
                  key={i}
                  onClick={() => createWebp(f)}
                >
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
            <p className={style.Error}>
              No folders found in current directory!
            </p>
          ) : (
            <>
              {Folders.map((f: string, i: number) => (
                <p
                  onClick={() => handleInvoke(f)}
                  key={i}
                  className={style.FolderFile}
                >
                  {f}
                </p>
              ))}
            </>
          )}
        </div>
        <button onClick={() => handleInvoke(data.start)}>Start</button>
      </div>
    </>
  );
};

export default Home;
