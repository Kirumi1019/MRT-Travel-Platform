"use client"
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

import useSpecificMRT from "@/hooks/useSpecificMRT";
import { useEffect, useState } from "react";
import NextTrain from "./NextTrain";

// Define the type for the mrtWholeInfo props
type StationInfo = {
    mrtStationDisplayId: string,
    mrtStationName: string,
    mrtLineNames: string[],
  };

function StationInfo(){

    const [stationInfo,setStationInfo] = useState<StationInfo | null>(null);
    const {getSpecificMRT, errorMessage}= useSpecificMRT();

    useEffect(() => {
        const fetchMRTList = async () => {
            try {
              const res = await getSpecificMRT();
              let info = await res.json();

              // get the object values
              // info is a object with mrtDisplay_id as key
              // We only need the value here !!!
              info = Object.values(info)
              // after turning, it becomes an array
              // the data is stored is the first element
              setStationInfo(info[0]);
              console.log(info);
              // conssole.log(info.mrtLineNames);
              // console.log(stationInfo);
            } catch (e) {
              console.error(e);
            }
        }

        fetchMRTList();
      }, []);
    
    useEffect(() => {
      if (errorMessage) {
          toast({
              variant: "destructive",
              title: errorMessage,
              action: <ToastAction altText="Try again">Got it</ToastAction>,
          });
    }
    }, [errorMessage]);

    return (
      <>
        {stationInfo ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <strong className="block text-lg font-bold mb-2">Station Name:</strong>
                <p className="text-gray-800">{stationInfo.mrtStationName}</p>
              </div>
              <div>
                <strong className="block text-lg font-bold mb-2">Line Names:</strong>
                <p className="text-gray-800">{stationInfo.mrtLineNames.join(', ')}</p>
              </div>
            </div>
            <NextTrain mrtName={stationInfo.mrtStationName}/>
          </>
        ) : (
            <p>Loading...</p>
        )}
      </>
    )
}
export default StationInfo