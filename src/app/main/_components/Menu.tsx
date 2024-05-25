import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Plus,
  UserCircle,
  Landmark,
  Map,
  Bookmark,
  TrainFront,
  University,
} from "lucide-react";

async function Menu() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const id = session.user.id;
  const username = session.user?.username;

  return (
    <div className="flex flex-col space-y-2 font-medium">
      <Link href={`/main/${id}/MyInfo`}>
        <Button variant="sidebar">
          <UserCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <div className="ms-3">
            <span className="font-bold"> {username} </span>&apos;s Profile
          </div>
        </Button>
      </Link>
      <Link href={`/main/${id}/Articles`}>
        <Button variant="sidebar">
          <Landmark className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <span className="ms-3"> Travel Articles</span>
        </Button>
      </Link>
      <Link href={`/main/${id}/LikedArticles`}>
        <Button variant="sidebar">
          <Bookmark className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <span className="ms-3"> Favorites</span>
        </Button>
      </Link>
      <Link href={`/main/${id}/Create_Article`}>
        <Button variant="sidebar">
          <Plus className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <span className="ms-3"> Create Article</span>
        </Button>
      </Link>
      {/* <Link href={`/main/${id}/My_Articles`}>
        <Button variant='sidebar'>
          <Plus className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <span className="ms-3"> My Articles</span>
        </Button>
      </Link> */}
      <Link href={`/main/MRT_Route`}>
        <Button variant="sidebar">
          <Map className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <span className="ms-3"> MRT Route Map</span>
        </Button>
      </Link>
      <Link href={`/main/MRT_Stations`}>
        <Button variant="sidebar">
          <TrainFront className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <span className="ms-3"> MRT Stations</span>
        </Button>
      </Link>
      <Link href={`/main/${id}/LikedStation`}>
        <Button variant="sidebar">
          <University className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
          <span className="ms-3">My Stations</span>
        </Button>
      </Link>
    </div>
  );
}

export default Menu;
