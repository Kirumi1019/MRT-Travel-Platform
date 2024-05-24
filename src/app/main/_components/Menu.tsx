import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, User, Home, Map, Bookmark } from "lucide-react";

async function Menu() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const id = session.user.id;
  return (
    <div className="flex flex-col space-y-2 font-medium">
      <Link href={`/main/${id}/MyInfo`}>
        <Button variant='sidebar'>
          <User className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" /> <span className="ms-3">My Info</span>
        </Button>
      </Link>
      <Link href={`/main/${id}/Articles`}>
        <Button variant='sidebar'>
          <Home className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" /> <span className="ms-3">View Articles</span>
        </Button>
      </Link>
      <Link href={`/main/${id}/LikedArticles`}>
        <Button variant='sidebar'>
          <Bookmark className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" /> <span className="ms-3">Saved Articles</span>
        </Button>
      </Link>
      <Link href={`/main/MRT_Route`}>
        <Button variant='sidebar'>
          <Map className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" /> <span className="ms-3">MRT Route</span>
        </Button>
      </Link>
      <Link href={`/main/MRT_Stations`}>
        <Button variant='sidebar'>
          <span className="ms-3">MRT Stations</span>
        </Button>
      </Link>
      <Link href={`/main/${id}/Create_Article`}>
        <Button variant='fab'>
          <Plus className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-blue" />
        </Button>
      </Link>
    </div>
  );
}

export default Menu;
