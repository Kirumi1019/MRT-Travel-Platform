import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useArticles() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const createArticle = async ({
    authorId,
    articleContent,
    articleTitle,
    mrtDisplayIds,
  }: {
    authorId: string;
    articleContent: string;
    articleTitle: string;
    mrtDisplayIds: string[];
  }) => {
    setLoading(true);
    const res = await fetch(`/api/articles`, {
      method: "POST",
      body: JSON.stringify({
        authorId,
        articleContent,
        articleTitle,
        mrtDisplayIds,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      // throw new Error(body.error);
    }
    // router.refresh();
    setLoading(false);
  };

  const getArticles = async () => {
    setLoading(true);
    const res = await fetch(`/api/articles`, { method: "GET" });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
    return res;
  };

  const updateArticles = async ({
    articleId,
  }:{
    articleId: string,
  }) => {
    setLoading(true);
    const res = await fetch(`/api/articles/${articleId}`, { method: "PUT" });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
    return res;
  }

  return {
    errorMessage,
    getArticles,
    createArticle,
    updateArticles,
    loading,
  };
}
