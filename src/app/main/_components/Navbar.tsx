import RoofingIcon from '@mui/icons-material/Roofing';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

import Menu from "./Menu";

async function Navbar() {
  const session = await auth();

  // console.log(session);
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  
  const username = session.user?.username;

  return (
    <div className="w-full flex flex-col justify-stretch">
      <nav className="font-bold sticky flex flex-around justify-start content-center top-0 w-full border bg-slate-200 p-3">
        <Link className='flex justify-around w-3/4' href={'/main'}>
          <RoofingIcon />
          Hello, {username}
        </Link>
      </nav>

      <div className="h-full flex flex-col justify-between">
        <section className="h-3/4 flex flex-col justify-around  m-3">
          <Menu />
        </section>

        <div className="m-3">
          <Link href={'/'}>
            <Button>Log out</Button>
          </Link>
        </div>
      </div>


    </div>
  );
}

export default Navbar;
