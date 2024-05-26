import { NextResponse, type NextRequest } from "next/server";
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      mrtName: string;
    };
  }
) 
{
  let mrtName = params.mrtName;
  mrtName = mrtName[mrtName.length - 1] === "站" ? mrtName : mrtName+'站';
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/xml; charset=utf-8");

  const raw = `<?xml version="1.0" encoding="utf-8"?> 
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
  <soap:Body> 
  <getLockerMRTSationName xmlns="http://tempuri.org/"> 
  <userName>b10705028@ntu.edu.tw</userName> 
  <passWord>wh3hyS5g</passWord> 
  <SationName>${mrtName}</SationName> 
  </getLockerMRTSationName> 
  </soap:Body> 
  </soap:Envelope> `
  // Remember that it will store in server cache after the first request!!!
  // So we have to overlook the data in cache ('no-store') and request again 
  // default: 'force-cache'
  // You can also uses next: { revalidate: false | 0 | number } to specify how long the data will be in the cache for
  // 0 means Prevent the resource from being cached.
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    cache: "no-store" as RequestCache,
  };

  try {
    const response = await fetch("https://api.metro.taipei/metroapi/locker.asmx", requestOptions);
    let result = await response.text();
    // console.log(result); // [{"StationName":"台北...]<?xml version="1.0" encoding="utf-8"?><soap...
    // the return data is in string type and need to be preprocess
    // in order to change the string type to JSON
    const index = result.indexOf(']');
    result = result.substring(0,index+1);
    result = JSON.parse(result);
    // console.log('in');
    // console.log(params.mrtName);
    // console.log(result[0]);
    // console.log('getting MRT api data');
    return NextResponse.json({Lockerdata: result});
  } catch (error) {
    console.error(error);
  };
}
