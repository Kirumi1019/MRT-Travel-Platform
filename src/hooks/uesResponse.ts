import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useResponse() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createResponse = async ({
    articleId,
    userId,
    rate,
    responseContent,
  }: {
    articleId: string;
    userId: string;
    rate: number;
    responseContent: string;
  }) => {
    setLoading(true);
    const res = await fetch(`/api/response`, {
      method: "POST",
      body: JSON.stringify({
        articleId,
        userId,
        rate,
        responseContent,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
  };

  const getResponses = async ({ articleId }: { articleId: string }) => {
    setLoading(true);
    const res = await fetch(`/api/response`, {
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
    setLoading(false);
    return res;
  };
  return { createResponse, getResponses, loading };
}
