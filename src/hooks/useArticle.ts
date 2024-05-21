import { useState } from "react";

import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { UUID } from "crypto";
import { GET } from "@/app/api/articles/route";

export default function useArticle() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createArticle = async ({
    authorId,
    articleContent,
    articleTitle,
  }: {
    authorId: string;
    articleContent: string;
    articleTitle: string;
  }) => {
    setLoading(true);
    const res = await fetch(`/api/articles`, {
      method: "POST",
      body: JSON.stringify({
        authorId,
        articleContent,
        articleTitle,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
    return res;
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
