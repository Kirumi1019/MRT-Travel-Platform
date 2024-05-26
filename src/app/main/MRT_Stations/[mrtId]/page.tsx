
import { auth } from "@/lib/auth";
import StationInfo from "./StationInfo"
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";
import { db } from "@/db";
import { mrtLikedTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { privateEnv } from "@/lib/env/private";

// Get url dynamic parameter
// "params" is fixed, cannot use other variable !!!!
type URLParams = {
    params: {
        mrtId: string;
    };
}

interface TrainInfo {
  CountDown: string;
  DestinationName: string;
  NowDateTime: string;
  StationName: string;
  TrainNumber: string;
}

async function Station({
    params: {mrtId},
}: URLParams){
    const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const id = session.user.id;
  const [liked] = await db.select({
    userId: mrtLikedTable.userId
  })
    .from(mrtLikedTable)
    .where(and(eq(mrtLikedTable.userId,id),
               eq(mrtLikedTable.mrtDisplayId, mrtId)
            )
    ).execute();
  
  let mrtNextTrain = [] as TrainInfo[];
  let error = '';
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/xml; charset=utf-8");

  const raw = `<?xml version="1.0" encoding="utf-8"?> 
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
  <soap:Body> 
  <getTrackInfo xmlns="http://tempuri.org/"> 
  <userName>${privateEnv.API_Username}</userName> 
  <passWord>${privateEnv.API_Password}</passWord> 
  </getTrackInfo> 
  </soap:Body> 
  </soap:Envelope>`
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    cache: "no-store" as RequestCache,
  };
  try{
    const response = await fetch("https://api.metro.taipei/metroapi/TrackInfo.asmx", requestOptions);
    let result = await response.text();
    // the return data is in string type and need to be preprocess
    // in order to change the string type to JSON
    console.log(result);
    const index = result.indexOf(']');
    result = result.substring(0,index+1);
    // console.log(result);
    mrtNextTrain = JSON.parse(result);
  }catch(err)
  {
    error = (err as Error).message
    console.log(error);
  }

    
    return (
        <>
            <StationInfo userId={id} initialLiked={Boolean(liked)}
             mrtNextTrain={mrtNextTrain} error={error}/>
        </>
    )
}
export default Station