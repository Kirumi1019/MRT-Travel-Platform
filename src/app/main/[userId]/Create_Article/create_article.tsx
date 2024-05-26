"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import useArticles from "@/hooks/useArticles";
import { useEffect, useState } from "react";

type Props = {
    userId: string,
    mrtWholeInfo: Station[],
    mrtLineList: MrtLine[],
};

type Station = {
  mrtStationDisplayId: string,
  mrtStationName: string,
  mrtLineName: string,
  stationId: string,
  lineDislpayId: string,
}
interface MrtLine {
  displayId: string;
  lineName: string;
}

function Create_Article({ userId, mrtWholeInfo, mrtLineList  }: Props) {
  const { toast } = useToast();
  const { createArticle, loading, errorMessage } = useArticles();
  const [articleContent, setArticleContent] = useState<string>("");
  const [articleTitle, setArticleTitle] = useState<string>("");
  const [selectedStations, setSelectedStations] = useState<string[]>([]);


  useEffect(() => {
    if(errorMessage)
      {
        toast({
          variant: "destructive",
          title: errorMessage,
          action: <ToastAction altText="Try again">Got it</ToastAction>,
        });
      }
  }, [errorMessage, toast])

  const handleSubmit = async () => {
    try {
      const body = await createArticle({
        authorId: userId,
        articleContent: articleContent,
        articleTitle: articleTitle,
        mrtDisplayIds: selectedStations,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const mapStationToLine = (PairList: Station[], lineId: string) => {
    const resList = PairList.filter((list) => list.lineDislpayId === lineId);
    return (
      <>
        {resList.map((item) => (
          <AccordionContent
            key={item.mrtStationDisplayId}
            className="m-4 w-1/3 flex items-center"
          >
            <label className="w-1/2 h-full" htmlFor={item.stationId}>
              {item.stationId}{" "}
              {item.mrtStationName}
            </label>
            <Input
              type="checkbox"
              id={item.mrtStationDisplayId}
              value={item.mrtStationDisplayId}
              className="max-h-full w-1/2"
              onChange={(e) => {
                if (!selectedStations.includes(item.mrtStationDisplayId)) {
                  setSelectedStations((list) => [...list, e.target.value]);
                } else
                  setSelectedStations((list) =>
                    list.filter(
                      (stationDisplayId) =>
                        stationDisplayId != item.mrtStationDisplayId
                    )
                  );
              }}
              checked={selectedStations.includes(item.mrtStationDisplayId)}
            ></Input>
          </AccordionContent>
        ))}
      </>
    );
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
          rows={10}
          className="m-4 block p-2.5 w-1/2  text-sm text-gray-900 bg-gray-50 
                        rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Article Content (Drag the bottome-right corner to expand)"
        ></textarea>

        <h1 className="m-4">Station</h1>
        <Accordion type="single" collapsible className="w-1/2 m-4">
          {mrtLineList.map((item) => (
            <AccordionItem key={item.displayId} value={item.lineName}>
              <AccordionTrigger>{item.lineName}</AccordionTrigger>
              {mapStationToLine(mrtWholeInfo, item.displayId)}
            </AccordionItem>
          ))}
        </Accordion>
        <Button disabled={loading} className="m-4">
          Share
        </Button>
      </form>
    </>
  );
}

export default Create_Article;
