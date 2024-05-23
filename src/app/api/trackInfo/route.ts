import next from "next";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { cache } from "react";

export async function GET() 
{
  
  
  

    const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/xml; charset=utf-8");

  const raw = "<?xml version=\"1.0\" encoding=\"utf-8\"?> \r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" \r\nxmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" \r\nxmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \r\n<soap:Body> \r\n<getTrackInfo xmlns=\"http://tempuri.org/\"> \r\n<userName>B10705028@ntu.edu.tw</userName> \r\n<passWord>wh3hyS5g</passWord> \r\n</getTrackInfo> \r\n</soap:Body> \r\n</soap:Envelope>";

  // Remember that it will store in server cache after the first request!!!
  // So we have to overlook the data in cache ('no-store') and request again 
  // default: 'force-cache'
  // You can also uses next: { revalidate: false | 0 | number } to specify how long the data will be in the cache for
  // 0 means Prevent the resource from being cached.
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    cache: "no-store",
  };

  try {
    const response = await fetch("https://api.metro.taipei/metroapi/TrackInfo.asmx", requestOptions);
    let result = await response.text();
    // the return data is in string type and need to be preprocess
    // in order to change the string type to JSON
    const index = result.indexOf(']');
    result = result.substring(0,index+1);
    result = JSON.parse(result);
    console.log(result[0]);
    console.log('getting MRT api data');
    return NextResponse.json({Mrtdata: result});
  } catch (error) {
    console.error(error);
  };
}
