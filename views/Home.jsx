import React, { useRef, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

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
    let url = (new URL(webUri)).href;
    url = url.substring(0, url.length - 1); 
    console.log(url);
    setHtml(
      `<html style="height: 100%;"><head><meta name="viewport" content="width=device-width, minimum-scale=0.1"><title>PCS.png (2480×3508)</title></head><body style="margin: 0px; height: 100%; background-color: rgb(14, 14, 14);"><img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 90%);transition: background-color 300ms; height: 100%; max-width: 100%; object-fit: contain;" src="${url}"></body></html>`
    );
  }, [webUri]);

  useEffect(() => {
    if (!pages) {
      return;
    }

    const updateImage = setInterval(() => {
      if (!pages) return;

      counter.current = counter.current + 1;

      if (counter.current > pages.length) {
        console.log("entrouAqui");
        counter.current = 0;
      }

      setWebUri(pages[counter.current]?.URL);

      setUpdate(true);
    }, 5 * 1000);

    return () => clearInterval(updateImage);

  }, [pages]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <WebView
      source={{ html }}
      style={{ flex: 1, height: "100%", width: "100%" }}
      scalesPageToFit={true}
      useWebKit={true}
    />
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  webview: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
});
