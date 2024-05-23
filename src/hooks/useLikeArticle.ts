import { useState } from "react";

import { useRouter } from "next/navigation";
import { UUID } from "crypto";

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

  return { createLikeArticle, likeArticleLoading };
}
