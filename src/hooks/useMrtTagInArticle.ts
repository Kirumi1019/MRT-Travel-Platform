import { useState } from "react";

import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { UUID } from "crypto";

export default function useMrtTagInArticle() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getMrtTags = async ({ articleId }: { articleId: UUID }) => {
    setLoading(true);
    const res = await fetch(`/api/articleMrtTag`, {
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

  return { getMrtTags };
}
