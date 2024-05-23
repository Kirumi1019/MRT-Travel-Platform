"use client";

import { useEffect, useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import useLike from "@/hooks/useMrtLike";
import { useParams } from "next/navigation";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

type LikeButtonProps = {
  userId: string,
  initialLiked: boolean,
};

export default function LikeButton({
  userId,
  initialLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const { likeMrt, unlikeMrt, loading } = useLike();
  const params = useParams<{mrtId: string}>();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, when we click on the
    // button, the Link will also be clicked, which will cause the page to
    // navigate to the tweet page, which is not what we want. So we stop the
    // event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!userId) return;
    if (liked) {
      await unlikeMrt({
        userId,
        mrtDisplayId: params.mrtId,
      });
      setLiked(false);
    } else {
      await likeMrt({
        userId,
        mrtDisplayId: params.mrtId,
      });
      setLiked(true);
    }
  };

  // We render `liked` state on the client.
  // The initial values from the server are only used to initialize the state
  // which does nothing on subsequent renders, thus the liked
  // will not be updated on the client even if we do a reouter.refresh().
  // To solve this, we need to update the state when the initial values change.
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
    >
      
      {initialLiked ? (<FavoriteIcon 
        className="text-red-500 transition-transform transform hover:scale-150 duration-400 ease-in-out"
        />) 
        : 
        <FavoriteBorderIcon
        className="text-gray-500 transition-transform transform hover:scale-150 duration-400 ease-in-out"
        />}
    </button>
  );
}
