import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) 
{
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "text/xml; charset=utf-8");
myHeaders.append("Cookie", "__cf_bm=ad6ynznIBybWoxM4ijIfzXNpR287jhwK8du068czHgQ-1716294315-1.0.1.1-S6uAzpBJ6UcWgXeWEz2.MuNrqdnW7WY9IX4FWZ_pwP3L93iSpIh4bTrwizqieq4DJzquwdDXGDICUHW2uRp.VA; ASP.NET_SessionId=2xtpwmz3f2hpcnahpg2l55ol; TS01232bc6=0110b39faee27f7b94e3b80fb364df1ba66bfb4eb9a7b05744d2e9bf78e88696a16b6846aeefb615d2f6475bbdad525303108e06ec; TS0131301b=01ca5d79a18e648ec5f69c3c010d789420e64f0e704ade8411098c2b032bfedc14db9113b19ffee8dc41c7a7d5976fbd59803c99da2447ad1808fe0f4be34fad77b413f95d");

const raw = "<?xml version=\"1.0\" encoding=\"utf-8\"?> \r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" \r\nxmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" \r\nxmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"> \r\n<soap:Body> \r\n<getTrackInfo xmlns=\"http://tempuri.org/\"> \r\n<userName>B10705028@ntu.edu.tw</userName> \r\n<passWord>wh3hyS5g</passWord> \r\n</getTrackInfo> \r\n</soap:Body> \r\n</soap:Envelope>";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

try {
  const response = await fetch("https://api.metro.taipei/metroapi/TrackInfo.asmx", requestOptions);
  let result = await response.text();
  // the return data is in string type and need to be preprocess
  // in order to change the string type to JSON
  const index = result.indexOf(']');
  result = result.substring(0,index+1);
  result = JSON.parse(result);
  console.log(typeof(result));
  return NextResponse.json({Mrtdata: result});
} catch (error) {
  console.error(error);
};
}
