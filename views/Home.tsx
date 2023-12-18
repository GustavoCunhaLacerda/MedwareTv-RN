import React, { useRef, useEffect, useState } from "react";
import WebView from "react-native-webview";
import api from "../api";
import { MedwareTvPage } from "../api/medwaretv";
import util from "../util";
import App from "../App";

const imageFiles = ["png", "gif", "jpg", "jpeg"];
const videoFiles = ["mp4", "avi", "wmv"];

type TVPage = MedwareTvPage & {
  MedTv?: "MedTV";
  MediaType?: "video" | "text" | "image";
  HTML?: string | null;
};

function useBaseHTML(content: string) {
  return `
    <html style="height: 100%;">
      <head>
        <meta name="viewport" content="width=device-width, minimum-scale=0.1">
      </head>
      <body style="margin: 0px; padding: 0; height: 100%; background-color: rgb(14, 14, 14);">
      ${content}
      </body>
    </html>`;
}

const Home = ({ codTv, showAlert }) => {
  const [pages, setPages] = useState<TVPage[]>([]);
  const [currentPage, setCurrentPage] = useState<TVPage | null>(null);

  function addMediaType(pages: MedwareTvPage[]) {
    return pages.map((page) => {
      const contentFileExtension = page.URL.split(".").pop() ?? "";

      const pageWithMediaType: TVPage = {
        ...page,
      };

      if (imageFiles.includes(contentFileExtension)) {
        pageWithMediaType.MediaType = "image";
        return pageWithMediaType;
      }

      if (videoFiles.includes(contentFileExtension)) {
        pageWithMediaType.MediaType = "video";
        return pageWithMediaType;
      }

      if (contentFileExtension === "txt") {
        pageWithMediaType.MediaType = "text";
        return pageWithMediaType;
      }

      return pageWithMediaType;
    });
  }

  function addHtml(pages: TVPage[]) {
    return pages.map((page) => {
      if (page.MediaType == "image") {
        const imageHTML = `
            <img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: #000;transition: background-color 300ms;height: 100%;max-width: 100%;object-fit: contain;" src="${page.URL}">`;
        return { ...page, HTML: imageHTML };
      } else if (page.MediaType == "text") {
        const imageHTML = `
            <embed 
              type="text/txt" 
              src="${page.URL}" width="100%" height="100%"
              style="width: 100%; height: 100%; color: #fff; text-color: #fff; display:flex; justify-content: center; align-items: center"
            >`;
        return { ...page, HTML: imageHTML };
      }

      return page;
    });
  }

  async function buildSlideList() {
    try {
      if (codTv == "0") {
        showAlert();
      }
      setPages([]);
      const response = await api.medwaretv.list<MedwareTvPage[]>(codTv);

      console.log(response);

      const pagesWithMediaType = addMediaType(response);
      const pagesWithHtml = addHtml(pagesWithMediaType);

      setPages(pagesWithHtml);
    } catch (error) {
      console.log(error);
      setPages([]);
    }
  }

  async function showSlides() {
    for (const page of pages) {
      setCurrentPage(page);
      await util.sleep(page.Tempo);
    }
    buildSlideList();
  }

  useEffect(() => {
  buildSlideList();
  }, [codTv]);

  useEffect(() => {
    if (pages.length > 0) !showSlides();
  }, [pages]);

  useEffect(() => {
    buildSlideList();
  }, []);

  return (
    currentPage && (
      <WebView
        source={
          currentPage.HTML
            ? { html: currentPage.HTML }
            : { uri: currentPage.URL }
        }
        scalesPageToFit={true}
        style={{
          flex: 1,
          backgroundColor: currentPage.MediaType == "text" ? "#fff" : "#000",
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        }}
      />
    )
  );
};

export default Home;
