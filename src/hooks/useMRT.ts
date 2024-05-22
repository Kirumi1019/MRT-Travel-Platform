import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useMRT() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const registerMRT = async ({ mrtName }: { mrtName: string }) => {
    setLoading(true);

    const res = await fetch(`/api/mrt`, {
      method: "PUT",
      body: JSON.stringify({
        mrtName,
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

  const getMRTList = async () => {
    setLoading(true);

    const res = await fetch(`/api/mrt`, {
      method: "GET",
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
    }
    router.refresh();
    setLoading(false);
    return res;
  };

  return {
    registerMRT,
    getMRTList,
    loading,
    errorMessage,
  };
}
