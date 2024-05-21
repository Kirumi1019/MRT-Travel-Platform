"use client";
import useArticle from "@/hooks/useArticle";
import { UUID } from "crypto";
import { useState, useEffect, useRef } from "react";

function Articles() {
  interface Article {
    displayId: UUID;
    authorId: UUID;
    articleContent: string;
    articleTitle: string;
  }

  interface Data {
    articleList: {
      displayId: UUID;
      authorId: UUID;
      articleContent: string;
      articleTitle: string;
    }[];
  }

  const { getArticles, loading } = useArticle();
  const [articleList, setArticleList] = useState<Article[]>([]);
  const initialised = useRef(false);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      const fetchedArticleList = async () => {
        try {
          const body = await getArticles();
          const fetchedData: Data = await body.json();
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

      fetchedArticleList();
    }
  }, []);

  return (
    <>
      <div>Articles</div>
      {articleList.map((item) => (
        <div key={item.displayId}>{item.articleTitle}</div>
      ))}
    </>
  );
}

export default Articles;
