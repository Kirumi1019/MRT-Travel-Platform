import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useArticles() {
  const [loading, setLoading] = useState(false);
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
      throw new Error(body.error);
    }
    router.refresh();
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

  return {
    getArticles,
    createArticle,
    loading,
  };
}
