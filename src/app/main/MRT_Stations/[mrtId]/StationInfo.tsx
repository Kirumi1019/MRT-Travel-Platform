"use client"
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

import useSpecificMRT from "@/hooks/useSpecificMRT";
import { useEffect, useState } from "react";
import NextTrain from "./NextTrain";
import LikeButton from "./LikeButton";
import Youbike from "./Youbike";

import { CircularProgress } from '@mui/material';

// Define the type for the mrtWholeInfo props
type StationInfo = {
    mrtStationDisplayId: string,
    mrtStationName: string,
    mrtLineNames: string[],
  };

type User = {
  userId: string,
  initialLiked: boolean,
}

function StationInfo({userId, initialLiked}: User){

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
              // console.log(info);
              // console.log(info.mrtLineNames);
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
                <div className={`bg-gradient-to-r from-green-200 via-indigo-300 to-red-200 rounded-lg shadow-lg p-6 relative`}>
                  <div className="absolute top-10 right-10">
                    <LikeButton userId={userId} initialLiked={initialLiked} />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="mb-4">
                      <strong className="block text-1xl mb-2 text-zinc-600">Station Name:</strong>
                      <p className="text-3xl font-bold text-black-100">{stationInfo.mrtStationName}</p>
                    </div>
                    <div>
                      <strong className="block text-1xl mb-2 text-zinc-600">Line Names:</strong>
                      <p className="text-3xl font-bold text-black-100">{
                        stationInfo.mrtLineNames.length > 1 ? (stationInfo.mrtLineNames.join(', ')) 
                        :
                        (stationInfo.mrtLineNames)

                      }</p>
                    </div>
                  </div>
                </div>
                <NextTrain mrtName={stationInfo.mrtStationName} />
                <Youbike mrtName={stationInfo.mrtStationName}/>
              </>
        ) : (
          <div className="flex justify-center items-center col-span-2">
          <CircularProgress size={12}/>
          <p className="ml-2 text-gray-600 animate-pulse">Loading...</p>
        </div>
            )}
      </>
    )
}
export default StationInfo