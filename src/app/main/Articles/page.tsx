"use client";
import useArticle from "@/hooks/useArticle";
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

function Articles() {
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

  const { getArticles, loading } = useArticle();
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
          //console.log(fetchedData.articleList);
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

  useEffect(() => {
    lookUpAuthorName("63dbcbdd-92b4-419b-bc7e-0da5338925de");
  }, [memberList]);

  const lookUpAuthorName = (authorId: string) => {
    const member = memberList.find((item) => item.displayId === authorId);
    return member?.userName;
  };

  return (
    <>
      <h1>所有文章</h1>
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
                <Link href={`/main/Articles/${item.displayId}`}>
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
