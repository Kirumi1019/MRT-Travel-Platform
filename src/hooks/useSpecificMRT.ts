import { useState } from "react";

import { useRouter, useParams } from "next/navigation";

export default function useSpecificMRT() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // useParams can get the containing the current route's dynamic parameters.
  const params = useParams<{mrtId: string}>();

  const getSpecificMRT = async () => {
    setLoading(true);

    const res = await fetch(`/api/mrt/${params.mrtId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      // console.log(body.error);
    }
    router.refresh();
    setLoading(false);
    return res;
  };

  return {
    getSpecificMRT,
    loading,
    errorMessage,
  };
}
