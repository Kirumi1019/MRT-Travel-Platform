import { NextResponse, type NextRequest } from "next/server";
import { cache } from "react";

interface ObjectWithCartLoads {
  TrainNumber: string;
  CN1: string;
  CID: string;
  StationID: string;
  Cart1L: string;
  Cart2L: string;
  Cart3L: string;
  Cart4L: string;
  Cart5L: string;
  Cart6L: string;
  utime: string;
  cartLoads: string[];
}

interface Congestion {
  TrainNumber: string;
  CN1: string;
  CID: string;
  StationID: string;
  Cart1L: string;
  Cart2L: string;
  Cart3L: string;
  Cart4L: string;
  Cart5L: string;
  Cart6L: string;
  utime: string;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      trainNumber: string;
    };
  }
) 
{

    const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/xml; charset=utf-8");

  const raw = `<?xml version="1.0" encoding="utf-8"?> 
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
<soap:Body> 
<getCarWeightByInfoEx xmlns="http://tempuri.org/"> 
<userName>B10705028@ntu.edu.tw</userName> 
<passWord>wh3hyS5g</passWord> 
</getCarWeightByInfoEx>
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
    cache: "no-store",
  };
  
  try {
    const response = await fetch("https://api.metro.taipei/metroapi/CarWeight.asmx", requestOptions);
    let result = await response.text();
    // console.log(result);
    // the return data is in string type and need to be preprocess
    // in order to change the string type to JSON
    const index = result.indexOf(']');
    result = result.substring(0,index+1);
    const resultJson = JSON.parse(result);

    const resultWithCartLoads: ObjectWithCartLoads[] = resultJson.map((obj: Congestion) => {
      const cartLoads: string[] = [];

      for (let i = 1; i <= 6; i++) {
        const cartLoadKey = `Cart${i}L` as keyof ObjectWithCartLoads;
        if (obj.hasOwnProperty(cartLoadKey)) {
          cartLoads.push(obj[cartLoadKey]);
        }
      }
    
      return { ...obj, cartLoads };
    });

    // Find the object with the matching trainNumber
    const matchingObject = resultWithCartLoads.find(
      (obj) => obj.TrainNumber === params.trainNumber
    );

    if (matchingObject) {
      return NextResponse.json({ congestionData: matchingObject });
    } 

    // console.log(result[result.length-1]);
    // console.log('getting MRT api data');
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: "Train number not found" });
  };
}
