import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useMember() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const registerMember = async ({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) => {
    setLoading(true);

    const res = await fetch(`/api/register`, {
      method: "PUT",
      body: JSON.stringify({
        email,
        username,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      // throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const loginMember = async ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password?: string;
  }) => {
    setLoading(true);

    const res = await fetch(`/api/login`, {
      method: "PUT",
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      // throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const updateMember = async ({
    email,
    username,
    password,
    displayId,
  }: {
    email: string;
    username: string;
    password: string;
    displayId: string;
  }) => {
    setLoading(true);

    const res = await fetch(`/api/members`, {
      method: "PUT",
      body: JSON.stringify({
        email,
        username,
        password,
        displayId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
    setLoading(false);
  };

  const getMembers = async () => {
    setLoading(true);
    const res = await fetch(`/api/members`, { method: "GET" });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
    return res;
  };

  return {
    updateMember,
    registerMember,
    loginMember,
    getMembers,
    loading,
    errorMessage,
  };
}
