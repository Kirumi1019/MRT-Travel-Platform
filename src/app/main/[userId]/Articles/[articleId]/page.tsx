"use client";
import useArticle from "@/hooks/useArticle";
import useMrtTagInArticle from "@/hooks/useMrtTagInArticle";
import useMRT from "@/hooks/useMRT";
import useResponse from "@/hooks/uesResponse";
import { UUID } from "crypto";
import { useRef, useState, useEffect } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: {
    userId: UUID;
    articleId: UUID;
  };
};

function Article({ params: { userId, articleId } }: Props) {
  const { getArticle } = useArticle();
  const { getMrtTags } = useMrtTagInArticle();
  const { getMRTList } = useMRT();
  const { loading, createResponse } = useResponse();
  const initialised = useRef(false);
  const [article, setArticle] = useState<Article>({
    articleContent: "",
    articleCreatedDate: "",
    articleTitle: "",
    authorId: `${""}-${""}-${""}-${""}-${""}`,
    displayId: `${""}-${""}-${""}-${""}-${""}`,
  });
  const [mrtTags, setMrtTags] = useState<MrtTag[]>([]);
  const [mrtStations, setMrtStations] = useState<Station[]>([]);
  const [commentContent, setCommentContent] = useState("");

  interface Article {
    articleContent: string;
    articleCreatedDate: string;
    articleTitle: string;
    authorId: UUID;
    displayId: UUID;
  }

  interface MrtTag {
    articleId: UUID;
    mrtDisplayId: UUID;
  }

  interface MrtTagList {
    Tags: {
      articleId: UUID;
      mrtDisplayId: UUID;
    }[];
  }

  interface Station {
    displayId: UUID;
    mrtName: string;
  }

  interface Data {
    mrtList: {
      displayId: UUID;
      mrtName: string;
    }[];
  }

  const lookUpStationName = (mrtDisplayId: string) => {
    const station = mrtStations.find((item) => item.displayId === mrtDisplayId);
    return station?.mrtName;
  };

  const handleSubmitComment = async () => {
    try {
      const body = await createResponse({
        articleId: articleId,
        userId: userId,
        rate: 5,
        responseContent: commentContent,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!initialised.current) {
      const fetchedArticle = async () => {
        try {
          const body = await getArticle({ articleId });
          const fetchedData: Article = await body.json();
          //console.log(fetchedData);
          setArticle(fetchedData);
        } catch (error) {
          console.log(error);
        }
      };
      const fetchedMrtTags = async () => {
        try {
          const body = await getMrtTags({ articleId });
          const fetchedData: MrtTagList = await body.json();
          //console.log(fetchedData);
          const formattedMrtTagList: MrtTag[] = fetchedData.Tags.map(
            (item) => ({
              articleId: item.articleId,
              mrtDisplayId: item.mrtDisplayId,
            })
          );
          //console.log(formattedMrtTagList);
          setMrtTags(formattedMrtTagList);
        } catch (error) {
          console.log(error);
        }
      };

      const fetchMRTList = async () => {
        try {
          const body = await getMRTList();
          const fetchedData: Data = await body.json();
          //console.log(fetchedData.mrtList);
          const formattedMrtList: Station[] = fetchedData.mrtList.map(
            (item) => ({
              displayId: item.displayId,
              mrtName: item.mrtName,
            })
          );

          setMrtStations(formattedMrtList);
        } catch (e) {
          console.error(e);
        }
      };

      fetchedArticle();
      fetchedMrtTags();
      fetchMRTList();
      initialised.current = true;
    }
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="text-3xl">
          <CardTitle>{article.articleTitle}</CardTitle>
        </CardHeader>
        <CardContent>{article.articleContent}</CardContent>
        <CardFooter>
          {mrtTags.map((item) => (
            <Link
              key={item.mrtDisplayId}
              href={`/main/MRT_Stations/${item.mrtDisplayId}`}
            >
              <Button className={"m-4"}>
                {lookUpStationName(item.mrtDisplayId)}
              </Button>
            </Link>
          ))}
        </CardFooter>
      </Card>

      <form onSubmit={handleSubmitComment}>
        <h1 className="m-4">Comments</h1>
        <textarea
          name="comment_content"
          rows={4}
          value={commentContent}
          onChange={(e) => {
            setCommentContent(e.target.value);
          }}
          className="m-4 block p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 
                        rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Leave a comment"
        ></textarea>
        <Button disabled={loading} className="m-4">
          Share
        </Button>
      </form>
    </>
  );
}

export default Article;
