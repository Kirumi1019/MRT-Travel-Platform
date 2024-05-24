import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useMRTLine() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getMrtLineList = async () => {
    setLoading(true);

    const res = await fetch(`/api/mrtLine`, {
      method: "GET",
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      // throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
    return res;
  };

  return { getMrtLineList, loading };
}
