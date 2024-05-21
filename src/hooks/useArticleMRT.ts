import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useArticleMRT() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createMrtTag = async ({
    articleId,
    mrtName,
  }: {
    articleId: string;
    mrtName: string;
  }) => {
    setLoading(true);
    const res = await fetch(`/api/mrtArticle`, {
      method: "POST",
      body: JSON.stringify({
        articleId,
        mrtName,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
  };

  return {
    createMrtTag,
    loading,
  };
}
