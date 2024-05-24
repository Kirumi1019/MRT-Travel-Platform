import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useStationLinePair() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getStationLinePair = async () => {
    setLoading(true);

    const res = await fetch(`/api/Station_Line_Pair`, {
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

  return { getStationLinePair };
}
