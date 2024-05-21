"use client";
import { Button } from "@/components/ui/button";
import useArticle from "@/hooks/useArticle";
import { UUID } from "crypto";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import useMRT from "@/hooks/useMRT";

type Props = {
  params: {
    userId: UUID;
  };
};

function Create_Article({ params: { userId } }: Props) {
  const { createArticle, loading } = useArticle();
  const { getMRTList } = useMRT();
  const initialised = useRef(false);
  const [articleContent, setArticleContent] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [mrtStations, setMrtStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState("");

  interface Station {
    displayId: UUID;
    mrtId: string;
    mrtName: string;
  }

  interface Data {
    mrtList: {
      displayId: UUID;
      mrtId: string;
      mrtName: string;
    }[];
  }

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const fetchMRTList = async () => {
        try {
          const body = await getMRTList();
          const fetchedData: Data = await body.json();
          //console.log(fetchedData.mrtList);
          const formattedMrtList: Station[] = fetchedData.mrtList.map(
            (item) => ({
              displayId: item.displayId,
              mrtId: item.mrtId,
              mrtName: item.mrtName,
            })
          );

          setMrtStations(formattedMrtList);
          setSelectedStation(formattedMrtList[0].mrtName);
        } catch (e) {
          console.error(e);
        }
      };

      fetchMRTList();
    }
  }, []);

  const handleSubmit = async () => {
    try {
      await createArticle({
        authorId: userId,
        articleContent: articleContent,
        articleTitle: articleTitle,
        mrtStation: selectedStation,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="m-4">Title</h1>
        <Input
          name="title"
          value={articleTitle}
          onChange={(e) => {
            setArticleTitle(e.target.value);
          }}
          className="m-4 w-1/2"
          placeholder="Article Title"
        ></Input>

        <h1 className="m-4">Content</h1>
        <textarea
          name="content"
          value={articleContent}
          onChange={(e) => setArticleContent(e.target.value)}
          rows={4}
          className="m-4 block p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 
                        rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Article Content"
        ></textarea>

        <h1 className="m-4">Station</h1>
        <select
          onChange={(e) => setSelectedStation(e.target.value)}
          value={selectedStation}
          className="m-4 w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {mrtStations.map((item) => (
            <option key={item.displayId} value={item.mrtName}>
              {item.mrtName}
            </option>
          ))}
        </select>
        <Button disabled={loading} className="m-4">
          create
        </Button>
      </form>
    </>
  );
}

export default Create_Article;
