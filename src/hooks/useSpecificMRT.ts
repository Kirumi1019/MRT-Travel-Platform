import { useState } from "react";
import { useParams } from "next/navigation";

export default function useSpecificMRT() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams<{ mrtId: string }>();

  const getSpecificMRT = async () => {
    setLoading(true);

    const res = await fetch(`/api/mrt/${params.mrtId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
    }

    setLoading(false);
    return res;
  };

  return {
    getSpecificMRT,
    loading,
    errorMessage,
  };
}
