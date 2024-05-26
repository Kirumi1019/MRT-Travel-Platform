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
    <div className="group relative overflow-hidden">
      <Button variant="sidebar" className="relative z-10">
        <UserCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        <div className="ms-3">
          <span className="font-bold"> {username} </span>&apos;s Profile
        </div>
      </Button>
      <div className="absolute inset-0 bg-blue-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
    </div>
  </Link>
  <Link href={`/main/${id}/Articles`}>
    <div className="group relative overflow-hidden">
      <Button variant="sidebar" className="relative z-10">
        <Landmark className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        <span className="ms-3"> Travel Articles</span>
      </Button>
      <div className="absolute inset-0 bg-blue-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
    </div>
  </Link>
  <Link href={`/main/${id}/LikedArticles`}>
    <div className="group relative overflow-hidden">
      <Button variant="sidebar" className="relative z-10">
        <Bookmark className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        <span className="ms-3"> Favorites</span>
      </Button>
      <div className="absolute inset-0 bg-blue-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
    </div>
  </Link>
  <Link href={`/main/${id}/Create_Article`}>
    <div className="group relative overflow-hidden">
      <Button variant="sidebar" className="relative z-10">
        <Plus className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        <span className="ms-3"> Create Article</span>
      </Button>
      <div className="absolute inset-0 bg-blue-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
    </div>
  </Link>
  <Link href={`/main/MRT_Route`}>
    <div className="group relative overflow-hidden">
      <Button variant="sidebar" className="relative z-10">
        <Map className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        <span className="ms-3"> MRT Route Map</span>
      </Button>
      <div className="absolute inset-0 bg-blue-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
    </div>
  </Link>
  <Link href={`/main/MRT_Stations`}>
    <div className="group relative overflow-hidden">
      <Button variant="sidebar" className="relative z-10">
        <TrainFront className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        <span className="ms-3"> MRT Stations</span>
      </Button>
      <div className="absolute inset-0 bg-blue-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
    </div>
  </Link>
  <Link href={`/main/${id}/LikedStation`}>
    <div className="group relative overflow-hidden">
      <Button variant="sidebar" className="relative z-10">
        <University className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        <span className="ms-3">My Stations</span>
      </Button>
      <div className="absolute inset-0 bg-blue-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
    </div>
  </Link>
</div>
  );
}

export default Menu;
