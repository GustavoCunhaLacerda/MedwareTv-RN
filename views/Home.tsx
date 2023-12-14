import React, { useRef, useEffect, useState } from "react";
import WebView from "react-native-webview";

const imageFiles = ["png", "gif", "jpg", "jpeg"]
const Home = () => {
  const counter = useRef(0);

  const [update, setUpdate] = useState(false);
  const [pages, setPages] = useState(null);
  const [webUri, setWebUri] = useState("");
  const [html, setHtml] = useState("");

  async function fetchData() {
    const response = await fetch(
      "https://api.medware.com.br/MedwareTv/?" +
        new URLSearchParams({
          codTv: 1,
        })
    );

    const pages = await response.json();
    setPages(pages);
  }

  useEffect(() => {
    let url = "https://api.medware.com.br/Arquivos/Geral/MOD1.mp4";
    url = url.substring(0, url.length - 1);

    const fileExtension = webUri.split(".").pop();

    let content = "";

    if (imageFiles.includes(fileExtension)) {
      content = `<img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 90%);transition: background-color 300ms; height: 100%; max-width: 100%; object-fit: contain;" src="${url}">`

      setHtml(
        `<html style="height: 100%;"><head><meta name="viewport" content="width=device-width, minimum-scale=0.1"></head><body style="margin: 0px; height: 100%; background-color: rgb(14, 14, 14);">${content}</body></html>`
      );

    } else {
      content = `<embed src="${url}" width="100%" height="100%"/>`;
      setHtml(
        url
      );
    }

    console.log(content);

   
  }, [webUri]);

  useEffect(() => {
    if (!pages) {
      return;
    }

    const updateImage = setInterval(() => {
      if (!pages) return;

      setWebUri(pages[counter.current]?.URL);

      counter.current = counter.current + 1;

      if (counter.current > pages.length) {
        counter.current = 0;
      }
    }, 5 * 2000);

    return () => clearInterval(updateImage);

  }, [pages]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <WebView
      source={{  }}
      style={{ flex: 1, height: "100%", width: "100%" }}
      scalesPageToFit={true}
      useWebKit={true}
    />
  );
};

export default Home;