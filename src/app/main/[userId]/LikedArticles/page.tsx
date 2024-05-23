"use client";
import { UUID } from "crypto";
import useLikeArticle from "@/hooks/useLikeArticle";
import useArticle from "@/hooks/useArticle";
import useMember from "@/hooks/useMember";
import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type Props = {
  params: {
    userId: UUID;
  };
};

interface ArticleId {
  articleId: UUID;
}

interface ArticleIdList {
  articleList: {
    articleId: UUID;
  }[];
}

interface Article {
  articleId: UUID;
  authorId: UUID;
  articleContent: string;
  articleTitle: string;
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

function LikedArticles({ params: { userId } }: Props) {
  const { likeArticleLoading, getLikedArticleList, deleteLikedArticle } =
    useLikeArticle();
  const { getArticle } = useArticle();
  const { getMembers } = useMember();
  const [articleIdList, setArticleIdList] = useState<ArticleId[]>([]);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [memberList, setMemberList] = useState<Member[]>([]);
  const initialised = useRef(false);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;

      const fetchedLikedArticleIds = async () => {
        try {
          const body = await getLikedArticleList({ userId });
          const fetchedData: ArticleIdList = await body.json();
          const formattedArticleIdList = fetchedData.articleList.map(
            (item) => ({
              articleId: item.articleId,
            })
          );
          setArticleIdList(formattedArticleIdList);
        } catch (error) {
          console.log(error);
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

      fetchedLikedArticleIds();
      fetchedMemberList();
    }
  }, []);

  useEffect(() => {
    const fetchedLikedArticles = async () => {
      try {
        articleIdList.map(async (item) => {
          const body = await getArticle(item);
          //console.log(body.json());
          const fetchedData: Article = await body.json();
          setArticleList((list) => [...list, fetchedData]);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchedLikedArticles();
  }, [articleIdList]);

  const lookUpAuthorName = (authorId: string) => {
    const member = memberList.find((item) => item.displayId === authorId);
    return member?.userName;
  };

  const handleRemoveLikedArticle = async (articleId: UUID) => {
    try {
      await deleteLikedArticle({ articleId });
      toast({
        title: "Success",
        description: "Article removed from your list",
      });

      setArticleList((list) =>
        list.filter((item) => item.articleId !== articleId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articleList.map((item) => (
            <TableRow key={item.articleId}>
              <TableCell className="font-medium w-1/2">
                {item.articleTitle}
              </TableCell>
              <TableCell className="w-1/4">
                {lookUpAuthorName(item.authorId)}
              </TableCell>
              <TableCell>
                <Link href={`/main/${userId}/Articles/${item.articleId}`}>
                  <Button className="ml-2 mr-2">More</Button>
                </Link>
                <Button
                  onClick={(e: any) => {
                    handleRemoveLikedArticle(item.articleId);
                  }}
                  className="ml-2 mr-2"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default LikedArticles;
