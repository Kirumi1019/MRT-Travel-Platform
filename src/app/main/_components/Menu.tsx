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
        <Link href={`/mainPage/${id}/MyInfo`}>
          <Button>My Info</Button>
        </Link>
      </div>
      <div className="w-full">
        Shop something
      </div>
      <div className="w-full">
        <Link href={'/mainPage/Products'}>
          <Button>All Products</Button>
        </Link>
      </div>

      <div className="w-full">
        <Link href={`/mainPage/${id}/Orders`}>
          <Button>My Orders</Button>
        </Link>
      </div>

      <div className="w-full">
        <Link href={`/mainPage/${id}/Reports`}>
          <Button>Report Seller</Button>
        </Link>
      </div>

      <div className="w-full">
        Sell something
      </div>

      <div className="w-full">
        <Link href={`/mainPage/${id}/MyProducts`}>
          <Button>My Products</Button>
        </Link>
      </div>

      <div className="w-full">
        <Link href={`/mainPage/${id}/AddProduct`}>
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="w-full">
        <Link href={`/mainPage/${id}/MyOrders`}>
          <Button>My Orders</Button>
        </Link>
      </div>

      <div className="w-full">
        <Link href={`/mainPage/${id}/Transactions`}>
          <Button>Sold Items</Button>
        </Link>
      </div>

      <div className="w-full">
        <Link href={`/mainPage/${id}/Reports`}>
          <Button>Report Buyer</Button>
        </Link>
      </div>
    </>


  );
}

export default Menu;
