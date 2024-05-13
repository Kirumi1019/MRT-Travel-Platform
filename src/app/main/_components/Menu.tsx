import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Menu() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const id = session.user.id;
  return (
    <>
      <div className="w-full">
        <Link href={`/main/${id}/MyInfo`}>
          <Button>My Info</Button>
        </Link>
      </div>
    </>


  );
}

export default Menu;
