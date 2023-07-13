"use client";
import { invoke } from "@tauri-apps/api/tauri";
import style from "@/styles/home.module.css";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import data from "@/public/config.json";
import { form_path } from "./utils";

const Home = () => {
  const [PathConstructor, setPathConstructor] = useState([""]);
  const [FileImages, setFileImages] = useState<string[]>([]);
  const [Folders, setFolders] = useState<string[]>([""]);
  const [Settings, setSettings] = useState(false);
  const [CurrentPath, setCurrentPath] = useState("");
  const [Success, setSuccess] = useState(false);
  const InitialPath = "";

  const handleInvoke = (folderPath: string) => {
    let path = InitialPath + folderPath;
    setCurrentPath(path);
    invoke("dirs", { pathString: path }).then((p: any) => {
      setFileImages(p[0]);
      setPathConstructor(p[1]);
      setFolders(p[2]);
    });
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
        <div className={style.homeContainer}>
          {Success && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={style.successTooltip}
            >
              Successfully created webp!
            </motion.p>
          )}

          {Settings && (
            <div className={style.settingsContainer}>
              <section>
                <AiOutlineClose
                  className={style.settingsIcon}
                  onClick={() => setSettings(!Settings)}
                />
              </section>
              <section>
                <p>
                  Initial Path{" "}
                  <span>(Use an absolute path ie C:\Users\user\...)</span>
                </p>
                <input
                  type="text"
                  placeholder="C:\Users\user\Desktop"
                  onChange={(e) => (data.start = e.target.value)}
                />
              </section>
              <section>
                <p>
                  Quality{" "}
                  <span>
                    (The higher means more pixels = bigger file, use floats such
                    as 50.0)
                  </span>
                </p>
                <input
                  type="number"
                  placeholder={data.quality.toString() + ".0"}
                  onChange={(e) => (data.quality = Number(e.target.value))}
                />
              </section>
              <section>
                <button onClick={() => setSettings(!Settings)}>Submit</button>
              </section>
            </div>
          )}

          <div className={style.homeHeader}>
            <p>
              Current dir: &nbsp;
              {PathConstructor.map((p: string, i: number) => (
                <span
                  key={i}
                  onClick={() => handleInvoke(form_path(PathConstructor, i))}
                >
                  {p + "/"}
                </span>
              ))}
            </p>
            <FiSettings
              onClick={() => setSettings(!Settings)}
              className={style.OpenSettings}
            />
          </div>
          <p className={style.index}>Images</p>
          <div className={style.imagesWrapper}>
            {FileImages.length > 1 && (
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
                    onClick={() => handleInvoke(f.replaceAll("\\", "/"))}
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
      </AnimatePresence>
    </>
  );
};

export default Home;
