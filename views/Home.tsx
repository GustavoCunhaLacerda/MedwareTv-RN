import React, { useRef, useEffect, useState } from "react";
import WebView from "react-native-webview";
import api from "../api";
import { MedwareTvPage } from "../api/medwaretv";
import util from "../util";

const imageFiles = ["png", "gif", "jpg", "jpeg"];
const videoFiles = ["mp4", "avi", "wmv"];

type TVPage = MedwareTvPage & {
  MediaType?: "video" | "text" | "image";
  HTML?: string | null;
};

function useBaseHTML(content: string) {
  return `
    <html style="height: 100%;">
      <head>
        <meta name="viewport" content="width=device-width, minimum-scale=0.1">
      </head>
      <body style="margin: 0px; height: 100%; background-color: rgb(14, 14, 14);">
      ${content}
      </body>
    </html>`;
}

const Home = () => {
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
      if (!page.MediaType) {
        return { ...page, HTML: useBaseHTML("<p>Arquivo inválido!</p>") };
      }

      if (page.MediaType == "image") {
        const imageHTML = `
            <img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: #000;transition: background-color 300ms;height: 100%;max-width: 100%;object-fit: contain;" src="${page.URL}">`;
        return { ...page, HTML: imageHTML };
      }

      if (page.MediaType == "text") {
        const imageHTML = `
            <embed 
              type="text/txt" 
              src="${page.URL}" width="100%" height="100%"
            >`;
        return { ...page, HTML: imageHTML };
      }

      return page;
    });
  }

  async function buildSlideList() {
    try {
      setPages([]);
      const response = await api.medwaretv.list<MedwareTvPage[]>("1");

      const pagesWithMediaType = addMediaType(response);
      const pagesWithHtml = addHtml(pagesWithMediaType);

      // console.log({ pagesWithMediaType });
      // console.log({ pagesWithHtml });

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

    console.log("Resetou");

    buildSlideList();
  }

  useEffect(() => {
    if (pages.length > 0) showSlides();
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
      />
    )
  );
};

export default Home;
