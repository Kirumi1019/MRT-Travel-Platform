import { useState } from "react";

import { useRouter } from "next/navigation";
import { UUID } from "crypto";
import { NextResponse } from "next/server";

export default function useLikeArticle() {
  const [likeArticleLoading, setLikeArticleLoadingLoading] = useState(false);
  const router = useRouter();

  const createLikeArticle = async ({
    articleId,
    userId,
  }: {
    articleId: UUID;
    userId: UUID;
  }) => {
    setLikeArticleLoadingLoading(true);
    const res = await fetch(`/api/likeArticle`, {
      method: "POST",
      body: JSON.stringify({
        articleId,
        userId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLikeArticleLoadingLoading(false);
  };

  const checkIfExistLikeArticle = async ({
    articleId,
    userId,
  }: {
    articleId: UUID;
    userId: UUID;
  }) => {
    setLikeArticleLoadingLoading(true);
    const res = await fetch(`/api/likeArticle`, {
      method: "PUT",
      body: JSON.stringify({
        articleId,
        userId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLikeArticleLoadingLoading(false);
    return res;
  };

  const getLikedArticleList = async ({ userId }: { userId: UUID }) => {
    setLikeArticleLoadingLoading(true);
    const res = await fetch(`/api/likeArticle2`, {
      method: "PUT",
      body: JSON.stringify({
        userId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLikeArticleLoadingLoading(false);
    return res;
  };

  const deleteLikedArticle = async ({ articleId }: { articleId: UUID }) => {
    const res = await fetch(`/api/removeLikeArticle`, {
      method: "PUT",
      body: JSON.stringify({
        articleId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLikeArticleLoadingLoading(false);
    //return res;
    return new NextResponse("Ok", { status: 200 });
  };

  return {
    createLikeArticle,
    checkIfExistLikeArticle,
    getLikedArticleList,
    deleteLikedArticle,
    likeArticleLoading,
  };
}
