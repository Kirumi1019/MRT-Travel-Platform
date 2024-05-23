"use client"
// import { useParams } from 'next/navigation'; // use for getting url params
// pages/index.tsx
import { useEffect, useState } from 'react';

interface TrainInfo {
  CountDown: string;
  DestinationName: string;
  NowDateTime: string;
  StationName: string;
  TrainNumber: string;
}

type MRTName = {
  mrtName: string,
}

function NextTrain(
  {mrtName}
    :
  MRTName){
  const [trackInfo, setTrackInfo] = useState<TrainInfo[]>([]);
  const [error, setError] = useState<string>("");

  // useParams can get the containing the current route's dynamic parameters.
  // const params = useParams<{mrtId: string}>();
  
  // With no dependency, this will only render once
  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        const response = await fetch('/api/trackInfo', {
          method: 'GET',
        });
        // console.log('fetch api response');
        // console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const dataList = await response.json();
        // dataList.Mrtdata contain a list of info
        // see trackInfo api if want to console.log what the api got
        setTrackInfo(dataList.Mrtdata);  
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    };

    fetchTrackInfo();
  }, []);

  return (
    <>
    <h1 className="p-4 text-2xl font-bold">Track Info</h1>
    <div className="max-w-screen-lg mx-auto flex flex-wrap gap-4 px-5">
      {error && <p className="text-red-500 col-span-2">{error}</p>}
      {trackInfo.length > 0 ? (
        trackInfo.map((train, index) => (
          mrtName[mrtName.length - 1] === '站' ? (
            train.StationName === mrtName ? (
              <div key={index} className="bg-gray-100 p-4 rounded-md w-1/3">
                <div className="font-bold">Destination Name: {train.DestinationName}</div>
                <p>Countdown: {train.CountDown}</p>
                <p>Train Number: {train.TrainNumber}</p>
                {/* <p>Station Name: {train.StationName}</p> */}
              </div>
            ) : null 
          ) : 
          (
            train.StationName === mrtName+'站' ? (
              <div key={index} className="bg-gray-100 p-4 rounded-md w-200">
                <div className="font-bold">Destination Name: {train.DestinationName}</div>
                <p>Countdown: {train.CountDown}</p>
                <p>Train Number: {train.TrainNumber}</p>
                {/* <p>Station Name: {train.StationName}</p> */}
              </div>
            ) : null 
          )
        ))
      ) : (
        <p className="col-span-2">Loading...</p>
      )}
    </div>
    </>
  );
};

export default NextTrain;
