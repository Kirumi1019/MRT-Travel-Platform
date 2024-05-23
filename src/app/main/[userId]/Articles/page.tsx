"use client";
import useArticles from "@/hooks/useArticles";
import useMember from "@/hooks/useMember";
import { UUID } from "crypto";
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
type Props = {
  params: {
    userId: UUID;
  };
};
function Articles({ params: { userId } }: Props) {
  interface Article {
    displayId: UUID;
    authorId: UUID;
    articleContent: string;
    articleTitle: string;
  }

  interface Member {
    displayId: UUID;
    userName: string;
  }

  interface ArticleData {
    articleList: {
      displayId: UUID;
      authorId: UUID;
      articleContent: string;
      articleTitle: string;
    }[];
  }

  interface MemberData {
    userList: {
      displayId: UUID;
      userName: string;
    }[];
  }

  const { getArticles, loading } = useArticles();
  const { getMembers } = useMember();
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [memberList, setMemberList] = useState<Member[]>([]);
  const initialised = useRef(false);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const fetchedArticleList = async () => {
        try {
          const body = await getArticles();
          const fetchedData: ArticleData = await body.json();
          console.log(fetchedData);
          const formattedArticleList: Article[] = fetchedData.articleList.map(
            (item) => ({
              displayId: item.displayId,
              authorId: item.authorId,
              articleContent: item.articleContent,
              articleTitle: item.articleTitle,
            })
          );

          setArticleList(formattedArticleList);
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

      fetchedArticleList();
      fetchedMemberList();
    }
  }, []);

  const lookUpAuthorName = (authorId: string) => {
    const member = memberList.find((item) => item.displayId === authorId);
    return member?.userName;
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
            <TableRow key={item.displayId}>
              <TableCell className="font-medium">{item.articleTitle}</TableCell>
              <TableCell>{lookUpAuthorName(item.authorId)}</TableCell>
              <TableCell>
                <Link href={`/main/${userId}/Articles/${item.displayId}`}>
                  <Button>More</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Articles;
