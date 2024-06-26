import { useState } from "react";

import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { UUID } from "crypto";

export default function useArticle() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getArticle = async ({ articleId }: { articleId: UUID }) => {
    setLoading(true);
    const res = await fetch(`/api/article`, {
      method: "PUT",
      body: JSON.stringify({ articleId }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
    return res;
  };

  return { getArticle };
}
