"use client";
import * as React from 'react';
import useArticle from "@/hooks/useArticle";
import useMrtTagInArticle from "@/hooks/useMrtTagInArticle";
import useMRT from "@/hooks/useMRT";
import useResponse from "@/hooks/uesResponse";
import useMember from "@/hooks/useMember";
import useLikeArticle from "@/hooks/useLikeArticle";
import RatingComponent from "@/components/ui/rating";
import { Bookmark } from "lucide-react";
import { UUID } from "crypto";
import { useRef, useState, useEffect } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

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
  const { getMembers } = useMember();
  const { createLikeArticle, checkIfExistLikeArticle, likeArticleLoading } =
    useLikeArticle();
  const { loading, createResponse, getResponses } = useResponse();
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
  const [ResponseList, setResponseList] = useState<Response[]>([]);
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [rate, setRate] = useState(5);
  const [articleSaved, setArticleSaved] = useState(true);
  interface Article {
    articleContent: string;
    articleCreatedDate: string;
    articleTitle: string;
    authorId: UUID;
    displayId: UUID;
  }

  interface Response {
    displayId: UUID;
    rate: number;
    responseContent: string;
    responseCreatedDate: string;
    userId: UUID;
    articleId: UUID;
  }

  interface ResponseList {
    articleResponse: {
      displayId: UUID;
      rate: number;
      responseContent: string;
      responseCreatedDate: string;
      userId: UUID;
      articleId: UUID;
    }[];
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

  interface Member {
    displayId: UUID;
    userName: string;
  }

  interface MemberData {
    userList: {
      displayId: UUID;
      userName: string;
    }[];
  }

  const lookUpStationName = (mrtDisplayId: string) => {
    const station = mrtStations.find((item) => item.displayId === mrtDisplayId);
    return station?.mrtName;
  };

  const lookUpAuthorName = (authorId: string) => {
    const member = memberList.find((item) => item.displayId === authorId);
    return member?.userName;
  };

  const convertRateStar = (count: number) => {
    const starList: number[] = [];
    const hollowStarList: number[] = [];
    var uid: number = 0;

    for (var i = 0; i < 5; i++) {
      if (i < count) {
        starList.push(uid);
      } else hollowStarList.push(uid);
      uid++;
    }

    return (
      <div>
        {starList.map((item) => (
          <StarIcon key={item} />
        ))}
        {hollowStarList.map((item) => (
          <StarBorderIcon key={item} />
        ))}
      </div>
    );
  };

  const handleSubmitComment = async () => {
    try {
      const body = await createResponse({
        articleId: articleId,
        userId: userId,
        rate: rate,
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

      const fetchedMRTList = async () => {
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

      const fetchedResponseList = async () => {
        try {
          const body = await getResponses({ articleId });
          const fetchedData: ResponseList = await body.json();
          const formattedResponseList: Response[] =
            fetchedData.articleResponse.map((item) => ({
              displayId: item.displayId,
              rate: item.rate,
              responseContent: item.responseContent,
              responseCreatedDate: item.responseCreatedDate,
              userId: item.userId,
              articleId: item.articleId,
            }));
          //console.log(formattedResponseList);
          setResponseList(formattedResponseList);
        } catch (e) {
          console.error(e);
        }
      };

      const fetchedMemberList = async () => {
        try {
          const body = await getMembers();
          const fetchedData: MemberData = await body.json();
          //console.log(fetchedData.userList);
          const formattedMemberList: Member[] = fetchedData.userList.map(
            (item) => ({
              displayId: item.displayId,
              userName: item.userName,
            })
          );
          setMemberList(formattedMemberList);
        } catch (error) {
          console.log(error);
        }
      };

      fetchedArticle();
      fetchedMrtTags();
      fetchedMRTList();
      fetchedResponseList();
      fetchedMemberList();
      checkIfArticleSaved();

      initialised.current = true;
    }
  }, []);

  const checkIfArticleSaved = async () => {
    try {
      const check = await checkIfExistLikeArticle({ articleId, userId });
      const body = check.json();
      body.then((result) => {
        const checkExist: boolean = JSON.parse(result.checkExist);
        setArticleSaved(checkExist);
        if (checkExist) {
          toast({
            title: "You have already saved this article",
          });
        }
        //console.log(articleSaved);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const saveThisArticle = async () => {
    try {
      await createLikeArticle({ articleId, userId });
      setArticleSaved(true);
      toast({ title: "Success", description: "article saved" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Card className="bg-white dark:bg-gray-900 py-8 lg:py-12 antialiased max-w-2xl mx-auto px-8">
        <CardHeader className="text-3xl flex items-center justify-center">
          <CardTitle>{article.articleTitle}</CardTitle>
          <Button
            onClick={saveThisArticle}
            disabled={likeArticleLoading || loading || articleSaved}
            className="m-4 ml-0"
          >
            <Bookmark />
            <span>Save</span>
          </Button>
        </CardHeader>
        <CardContent>{article.articleContent}</CardContent>
        <CardFooter>
          {mrtTags.map((item) => (
            <Link
              key={item.mrtDisplayId}
              href={`/main/MRT_Stations/${item.mrtDisplayId}`}
            >
              <Button className="m-4 ml-0">
                {lookUpStationName(item.mrtDisplayId)}
              </Button>
            </Link>
          ))}
        </CardFooter>
      </Card>

      <Card className="bg-white dark:bg-gray-900 py-8 lg:py-12 antialiased max-w-2xl mx-auto px-2">
        <form onSubmit={handleSubmitComment}>
          <h1 className="m-4">Leave a comment</h1>
          <textarea
            name="comment_content"
            rows={4}
            value={commentContent}
            onChange={(e) => {
              setCommentContent(e.target.value);
            }}
            className="m-4 block p-2.5 w-4/5 text-sm text-gray-900 bg-gray-50 
                        rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 
                      "
            placeholder="Your comment"
          ></textarea>
          <h1 className="m-4">Rate this article</h1>
          <Input
            type="number"
            className="m-4 w-1/6"
            max="5"
            min="1"
            value={rate}
            onChange={(e) => {
              setRate(e.target.valueAsNumber);
            }}
          />
          <RatingComponent
            max={5}
            min={1}
            value={rate}
          />
          <Button disabled={loading} className="m-4 inline-flex items-center py-2.5 text-black px-4 text-xs font-medium text-center bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800">
            <div className="span">Post</div>
          </Button>
        </form>
      </Card>
      {ResponseList.map((item) => (
        <Card className="bg-white dark:bg-gray-900 py-8 lg:py-12 antialiased max-w-2xl mx-auto px-2" key={item.displayId}>
          <CardHeader className="flex justify-between items-center mb-2">
            <CardTitle className="font-normal">
              @ {lookUpAuthorName(item.userId)}
            </CardTitle>
            {convertRateStar(item.rate)}
          </CardHeader>
          <CardFooter className='inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600'>
            <div>
              <CardContent className="p-0 font-medium">
                {item.responseContent}
              </CardContent>
            </div>
          </CardFooter>
          <CardFooter>
            <div>
              <CardDescription className="p-0 font-light ">
                - {item.responseCreatedDate}
              </CardDescription>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default Article;
