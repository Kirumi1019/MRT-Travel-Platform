"use client";
// import { useParams } from 'next/navigation'; // use for getting url params
// pages/index.tsx
import { useEffect, useState } from "react";

import { UserRound } from 'lucide-react';

import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';

interface Congestion {
  TrainNumber: string;
  CN1: string;
  CID: string;
  StationID: string;
  Cart1L: string;
  Cart2L: string;
  Cart3L: string,
  Cart4L: string,
  Cart5L: string,
  Cart6L: string,
  utime: string,
  cartLoads: string[];
}

function Congestion({trainNumber}: {trainNumber: string}) {
  const [congestionInfo, setCongestionInfo] = useState<Congestion>();
  const [error, setError] = useState<string>("");
  const [notfound, setNotFound] = useState<boolean>(false);

  // useParams can get the containing the current route's dynamic parameters.
  // const params = useParams<{mrtId: string}>();

  // With no dependency, this will only render once
  useEffect(() => {
    const fetchCongestionInfo = async () => {
      if(!trainNumber) return ;
      try {
        const response = await fetch(`/api/congestion/${trainNumber}`, {
          method: "GET",
        });
        // // console.log('fetch api response');
        // // console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        
        // return data with list of type Congestion objects
        const dataList = await response.json();
        // console.log(dataList);
        // dataList.congestionData contain a list of info
        // see congestionInfo api if want to console.log what the api got
        if (dataList.error) {
          setNotFound(true);
        } else {
          // console.log(dataList.congestionData);
          setCongestionInfo(dataList.congestionData);
        }
      } catch (err) {
        console.log(err);
        setError((err as Error).message);
      }
    };

    fetchCongestionInfo();
  }, [trainNumber]);

  return (
    <>
      {!trainNumber && (
        <Alert severity="error" className="mb-4 mt-0.5">The train doesnot contain congestion info...</Alert>
      )}
      {trainNumber ? (
        congestionInfo === undefined ? (
          <div className="flex justify-center items-center col-span-2">
                <CircularProgress size={12}/>
                <p className="ml-2 text-gray-600 animate-pulse">Loading...</p>
              </div>
        ) : congestionInfo === null ? (
          <Alert severity="error" className="mb-4">No data available</Alert>
        ) : (
          <div className="flex flex-wrap p-1">
            <div className="bg-white shadow-md rounded-lg p-4 mr-4 mb-4 w-full sm:w-auto">
              <p>Now the Car is at StationID: {congestionInfo.StationID}</p>
              <div className="flex items-center mt-2">
                <div className="flex flex-wrap">
                  {congestionInfo.cartLoads.map((load, index) => (
                    <div key={index} className="mr-2 mb-2 flex items-center">
                      <p className="mr-1">Cart {index + 1}:</p>
                      {renderLoadIcon(parseInt(load))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}
    </>
  );
}

const renderLoadIcon = (load: number) => {
  const color = getColorForLoad(load);
  return <UserRound size={24} className={`${color}`} />;
};

type ColorType = {
  [key: number]: string, 
}

const getColorForLoad = (load: number) => {
  const loadColors: ColorType = {
    1: "text-green-500", // Green
    2: "text-green-400", // Light Green
    3: "text-yellow-500", // Yellow
    4: "text-orange-500", // Orange
    5: "text-red-500", // Red
  };

  return loadColors[load] || "text-gray-500"; // Default to gray if load is not in the range 1-5
};

export default Congestion;
