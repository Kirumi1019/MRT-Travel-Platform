import { NextResponse, type NextRequest } from "next/server";

/* 
Youbike return an array of objects
{
  sno: '500101154',
  sna: 'YouBike2.0_敦化市民路口',
  sarea: '大安區',
  mday: '2024-05-25 11:10:29',
  ar: '敦化南路1段158號(前)',
  sareaen: 'Daan Dist.',
  snaen: 'YouBike2.0_Dunhua S. Rd. & Civic Blvd. Intersection',
  aren: 'No. 158， Sec. 1， Dunhua S. Rd.',
  act: '1',
  srcUpdateTime: '2024-05-25 11:10:33',
  updateTime: '2024-05-25 11:10:52',
  infoTime: '2024-05-25 11:10:29',
  infoDate: '2024-05-25',
  total: 23,
  available_rent_bikes: 0,
  latitude: 25.04405,
  longitude: 121.5486,
  available_return_bikes: 23
}
sno(站點代號)、sna(場站中文名稱)、total(場站總停車格)
available_rent_bikes(場站目前車輛數量)、sarea(場站區域)
mday(資料更新時間)、latitude(緯度)、longitude(經度)
ar(地點)、sareaen(場站區域英文)、snaen(場站名稱英文)
aren(地址英文)、available_return_bikes(空位數量)
act(全站禁用狀態、(0:禁用、1:啟用))、srcUpdateTime(YouBike2.0系統發布資料更新的時間)
updateTime(大數據平台經過處理後將資料存入DB的時間)、infoTime(各場站來源資料更新時間)
infoDate(各場站來源資料更新時間)


New Taipei
{
  sno: '500203004',
  sna: 'YouBike2.0_捷運三重站(1號出口)',
  tot: '36',
  sbi: '7',
  sarea: '三重區',
  mday: '20240525171319',
  lat: '25.05464',
  lng: '121.48322',
  ar: '捷運路36號(旁)',
  sareaen: 'Sanchong Dist',
  snaen: 'YouBike2.0_MRT Sanchong Sta. (Exit 1)',
  aren: 'No. 36, Jieyun Rd.',
  bemp: '29',
  act: '1'
}
sbi: 可借數量
bemp 可歸還數量


MRT return an array of objects
{"StationName":"松山機場",
"sno":"500110012",
"sna":"民福三號綠地",
"lat":"25.06374",
"lng":"121.54767"}
*/

interface YouBikeStation {
  sno: string;
  sna: string;
  act: string;
  total: number;
  available_rent_bikes: number;
  available_return_bikes: number;
}

interface NewYouBikeStation {
  sno: string,
  sna: string,
  tot: string,
  sbi: string,
  sarea: string,
  mday: string,
  lat: string,
  lng: string,
  ar: string,
  sareaen: string,
  snaen: string,
  aren: string,
  bemp: string,
  act: string,
}

interface MRTStation {
  StationName: string;
  sno: string;
  sna: string;
  lat: string;
  lng: string;
}

interface MergedStation {
  sna: string;
  total: number;
  available_rent_bikes: number;
  available_return_bikes: number;
  act: string;
}

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
  const requestOptionsYouBike = {
    method: "GET",
  };

  try {
    // New Taipei Youbike public api
    
    const responseNewTaipeiYoubikev2 = await fetch("https://data.ntpc.gov.tw/api/datasets/010e5b15-3823-4b20-b401-b1cf000550c5/json?size=1000000000",
    requestOptionsYouBike);
    const resultNewTaipeiYoubikev2 = await responseNewTaipeiYoubikev2.json();

    const responseNewTaipeiYoubikev1 = await fetch("https://data.ntpc.gov.tw/api/datasets/71cd1490-a2df-4198-bef1-318479775e8a/json?size=1000000",
    requestOptionsYouBike);
    const resultNewTaipeiYoubikev1 = await responseNewTaipeiYoubikev1.json();

    const resultNewTaipeiYoubike = [...resultNewTaipeiYoubikev1, ...resultNewTaipeiYoubikev2]

    // column name changed
    const modifiedData = resultNewTaipeiYoubike.map(({ 
      sno,sna,
      tot,
      sbi,
      bemp,
      act,
    }:NewYouBikeStation) => ({
      total: parseInt(tot),
      available_rent_bikes: parseInt(sbi),
      available_return_bikes: parseInt(bemp),
      sno,sna,act
    }));
    // console.log(resultNewTaipeiYoubike);
    
    // Taipei YouBike public api
    const responseTaipeiYoubike = await fetch("https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json",
    requestOptionsYouBike);
    const resultTaipeiYoubike = await responseTaipeiYoubike.json();

    const NorthTaipeiresult = [...modifiedData, ...resultTaipeiYoubike]
    
    // console.log(NorthTaipeiresult[0]);
    // console.log(NorthTaipeiresult[NorthTaipeiresult.length-1]);
    // console.log(resultNewTaipeiYoubike);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/xml; charset=utf-8");

    const raw = `<?xml version="1.0" encoding="utf-8"?> 
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
    <soap:Body> 
    <getYourBikeNearByName xmlns="http://tempuri.org/"> 
    <userName>B10705028@ntu.edu.tw</userName> 
    <passWord>wh3hyS5g</passWord>
    <SationName>${params.mrtName}</SationName> 
    </getYourBikeNearByName>
    </soap:Body> 
    </soap:Envelope> `;
    // Remember that it will store in server cache after the first request!!!
    // So we have to overlook the data in cache ('no-store') and request again 
    // default: 'force-cache'
    // You can also uses next: { revalidate: false | 0 | number } to specify how long the data will be in the cache for
    // 0 means Prevent the resource from being cached.
    const requestOptionsMRT = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      cache: "no-store",
    };
    const responseMRT = await fetch("https://api.metro.taipei/MetroAPI/UBike.asmx",
     requestOptionsMRT);
     let resultMRTAPI = await responseMRT.text();
     // the return data is in string type and need to be preprocess
     // in order to change the string type to JSON
     const index = resultMRTAPI.indexOf(']');
     resultMRTAPI = resultMRTAPI.substring(0,index+1);
     const resultMRT = JSON.parse(resultMRTAPI);

    //  const test: YouBikeStation = resultMRT.find((youbike: YouBikeStation) => youbike.sno === '500220016');
    //  console.log(test);  
    
    // const test: YouBikeStation = NorthTaipeiresult.find((youbike: YouBikeStation) => youbike.sno === '500220016');
    // console.log(test);  

    // mergin data into one
    const mergedData: MergedStation[] = resultMRT.map((mrtStation: MRTStation) => {
      const youbikeStation: YouBikeStation = NorthTaipeiresult.find((youbike: YouBikeStation) => youbike.sno === mrtStation.sno);
      
      if (youbikeStation) {
        return {
          sna: youbikeStation.sna,
          total: youbikeStation.total,
          available_rent_bikes: youbikeStation.available_rent_bikes,
          available_return_bikes: youbikeStation.available_return_bikes,
          act: youbikeStation.act,
        };
      }
    
      return null;
    });
    // console.log('Merged Data ====================');
    // console.log(mergedData);
    // console.log('Merged Data ====================');

    return NextResponse.json({youbike: mergedData});
  } catch (error) {
    console.error(error);
  };
}
