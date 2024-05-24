import RoofingIcon from '@mui/icons-material/Roofing';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

import Menu from "./Menu";

async function Navbar() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const username = session.user?.username;

  return (
    <div className="w-full flex flex-col bg-gray-100 shadow">
      <nav className="font-semibold sticky top-0 z-10 bg-white shadow-md flex justify-between items-center p-4">
        <Link href={'/main'} className='flex items-center space-x-2 h-6 me-3 sm:h-7'>
          <RoofingIcon />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Hello, {username}</span>
        </Link>
      </nav>

      <div className="flex-grow p-3">
        <Menu />
      </div>

      <div>
          <Link href={'/'}>
            <Button className="bg-red-500 hover:bg-red-600 text-white">Log out</Button>
          </Link>
        </div>
    </div>
  );
}

export default Navbar;
