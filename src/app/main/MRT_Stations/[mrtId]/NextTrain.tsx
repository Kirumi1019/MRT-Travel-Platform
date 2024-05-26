"use client";
// import { useParams } from 'next/navigation'; // use for getting url params
// pages/index.tsx
import { useEffect, useState } from "react";
import Locker from "./Locker";

// import mui icon
import TrainOutlinedIcon from "@mui/icons-material/TrainOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Congestion from "./Congestion";

import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';

interface TrainInfo {
  CountDown: string;
  DestinationName: string;
  NowDateTime: string;
  StationName: string;
  TrainNumber: string;
}

type MRTName = {
  mrtName: string;
};

function NextTrain({ mrtName }: MRTName) {
  const [trackInfo, setTrackInfo] = useState<TrainInfo[]>([]);
  const [error, setError] = useState<string>("");

  // useParams can get the containing the current route's dynamic parameters.
  // const params = useParams<{mrtId: string}>();

  // With no dependency, this will only render once
  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        const response = await fetch("/api/trackInfo", {
          method: "GET",
          cache: "no-store" as RequestCache,
        });
        // console.log('fetch api response');
         console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const dataList = await response.json();
        // dataList.Mrtdata contain a list of info
        // see trackInfo api if want to console.log what the api got
        setTrackInfo(dataList.Mrtdata);
      } catch (err) {
        console.log(err);
        setError((err as Error).message);
      }
    };

    fetchTrackInfo();
  }, []);

  return (
    <>
      <h1 className="p-4 text-2xl font-bold text-gray-800">Track Info</h1>
    <div className="max-w-screen-lg mx-auto flex flex-wrap justify-between gap-8 px-8">
    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {trackInfo.length > 0 ? (
        trackInfo.map((train, index) =>
          (train.StationName === mrtName || train.StationName === mrtName+"站")  ? (
            <div
              key={index}
              className="w-full bg-white shadow-lg rounded-lg p-4 py-1 col-span-1 transition-all duration-300 hover:shadow-xl hover:scale-110"
            >
              <div className="flex items-center mb-2 text-gray-800">
                <TrainOutlinedIcon className="mr-2 text-green-500" />
                <h2 className="text-lg font-bold">
                  Destination Name: {train.DestinationName}
                </h2>
              </div>
              <div className="flex items-center mb-2 text-gray-600">
                {train.CountDown === "營運時間已過" ? <DoDisturbIcon className="mr-2 text-red-500" /> : <TimerOutlinedIcon className="mr-2 text-orange-500" />}
                Countdown: {train.CountDown}
              </div>
              <div className="flex items-center text-gray-600">
                <LocationOnOutlinedIcon className="mr-2 text-blue-500" />
                Train Number: {train.TrainNumber}
              </div>
              <Congestion trainNumber={train.TrainNumber}/>
            </div>
          ) : null
        )
      ) : (
        <div className="flex justify-center items-center col-span-2">
          <CircularProgress size={12}/>
          <p className="ml-2 text-gray-600 animate-pulse">Loading...</p>
        </div>
      )}
    </div>
      <Locker mrtName={mrtName}/>
    </>
  );
}

export default NextTrain;
