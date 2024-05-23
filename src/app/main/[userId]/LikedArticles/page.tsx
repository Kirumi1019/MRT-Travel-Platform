"use client";
import { UUID } from "crypto";

type Props = {
  params: {
    userId: UUID;
  };
};

function LikedArticles({ params: { userId } }: Props) {
  return <>LikedArticles:{userId}</>;
}

export default LikedArticles;
