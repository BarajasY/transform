"use client";
import { invoke } from "@tauri-apps/api/tauri";
import style from "@/styles/home.module.css";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { form_path, loadConfig, saveConfig } from "./utils";

const Home = () => {
  const [PathConstructor, setPathConstructor] = useState([""]);
  const [FileImages, setFileImages] = useState<string[]>([]);
  const [Folders, setFolders] = useState<string[]>([""]);
  const [Settings, setSettings] = useState(false);
  const [Message, setMessage] = useState("");
  const [Quality, setQuality] = useState(0.0);
  const [InitialPath, setInitialPath] = useState("/");
  const [CurrentPath, setCurrentPath] = useState<string | null>("");
  const [Success, setSuccess] = useState(false);

  const handleInvoke = (folderPath: string | null) => {
    setCurrentPath(folderPath);
    invoke("dirs", { pathString: folderPath }).then((p: any) => {
      setFileImages(p[0]);
      setPathConstructor(p[1]);
      setFolders(p[2]);
    });
  };

  const createWebp = (fileName: string) => {
    invoke("make_webp", {
      pathFile: CurrentPath,
      fileName,
      quality: Quality,
    }).then((s) => successHandler(s));
  };

  const successHandler = (s: any) => {
    setMessage(s);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 800);
  };

  const saveJson = () => {
    saveConfig(InitialPath, Quality);
    setSettings(!Settings);
  };

  const getJson = () => {
    const loaded = loadConfig();
    setInitialPath(loaded.start!);
    setQuality(Number(loaded.quality));
    setSettings(!Settings);
  };

  const startWithConfig = () => {
    const loaded = loadConfig();
    setInitialPath(loaded.start! ?? "/");
    setQuality(Number(loaded.quality) ?? 75.0);
    handleInvoke(loaded.start);
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
              {Message}
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
                  placeholder={InitialPath}
                  onChange={(e) => setInitialPath(e.target.value)}
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
                  placeholder={Quality.toString() + ".0"}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
              </section>
              <section>
                <button onClick={() => saveJson()}>Submit</button>
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
              onClick={() => getJson()}
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
          <button onClick={() => startWithConfig()}>Start</button>
        </div>
      </AnimatePresence>
    </>
  );
};

export default Home;
