import { useState } from "react";

import { useRouter } from "next/navigation";
import { UUID } from "crypto";

export default function useLike() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const likeMrt = async ({
    userId,
    mrtDisplayId,
  }: {
    userId: string;
    mrtDisplayId: string;
  }) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/mrtLikes", {
      method: "POST",
      body: JSON.stringify({
        userId,
        mrtDisplayId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const unlikeMrt = async ({
    userId,
    mrtDisplayId,
  }: {
    userId: string;
    mrtDisplayId: string;
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/mrtLikes", {
      method: "DELETE",
      body: JSON.stringify({
        userId,
        mrtDisplayId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const getLikeMrt = async ({ userId }: { userId: UUID }) => {
    setLoading(true);
    const res = await fetch("/api/mrtLikes", {
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
    setLoading(false);
    return res;
  };

  return {
    likeMrt,
    unlikeMrt,
    getLikeMrt,
    loading,
  };
}
