"use client";
// import { useParams } from 'next/navigation'; // use for getting url params
// pages/index.tsx
import { useEffect, useState } from "react";

// import mui icon
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import LuggageIcon from '@mui/icons-material/Luggage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

interface Locker {
  StationName: string;
  Size: string;
  LockerDescription: string;
  payment: string;
  QuantityAvailable: string;
  Total: string;
}

type MRTName = {
  mrtName: string;
};

function NextTrain({ mrtName }: MRTName) {
  const [lockerInfo, setLockerInfo] = useState<Locker[]>([]);
  const [error, setError] = useState<string>("");

  // useParams can get the containing the current route's dynamic parameters.
  // const params = useParams<{mrtId: string}>();

  // With no dependency, this will only render once
  useEffect(() => {
    const fetchLockerInfo = async () => {
      try {
        const response = await fetch(`/api/${mrtName}/lockerInfo`, {
          method: "GET",
        });
        // console.log('fetch api response');
        // console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const dataList = await response.json();

        // Sort the lockerInfo array based on StationName in alphabetical order
        const sortedLockerInfo = dataList.Mrtdata.sort((a: Locker, b:Locker) =>
          a.LockerDescription.localeCompare(b.LockerDescription)
        );

        // dataList.Mrtdata contain a list of info
        // see lockerInfo api if want to console.log what the api got
        setLockerInfo(sortedLockerInfo);
      } catch (err) {
        console.log(err);
        setError((err as Error).message);
      }
    };

    fetchLockerInfo();
  }, []);

  return (
    <>
    <h1 className="p-4 text-2xl font-bold text-gray-800">Locker Info</h1>
    <div className="max-w-screen-lg mx-auto flex flex-wrap gap-4 px-5">
      {error && <p className="text-red-500 col-span-2">{error}</p>}
      {lockerInfo.length > 0 ? (
        lockerInfo.map((locker, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 col-span-1 transition-all duration-500 hover:shadow-xl hover:scale-110"
          >
            {/* <h2 className="text-lg font-bold mb-2 text-gray-800 flex items-center">
              <LocationOnOutlinedIcon className="mr-2 text-green-500" />
              {locker.StationName}
            </h2> */}
            <div className="flex items-center mb-2 text-gray-600">
              <InfoOutlinedIcon className="mr-2 text-orange-500" />
              Description: {locker.LockerDescription}
            </div>
            <div className="flex items-center mb-2 text-gray-600">
              <ViewInArIcon className="mr-2 text-blue-500" />
              Size: {locker.Size}
            </div>
            <div className="flex items-center mb-2 text-gray-600">
              <PaymentOutlinedIcon className="mr-2 text-purple-500" />
              Payment: {locker.payment}
            </div>
            <div className="flex items-center mb-2 text-gray-600">
              <LuggageIcon className="mr-2 text-green-500" />
              Total: {locker.Total}
            </div>
            <div className="flex items-center text-gray-600">
              <CheckCircleIcon className="mr-2 text-green-500" />
              Quantity Available: {locker.QuantityAvailable}
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-2 text-gray-600">Loading...</p>
      )}
    </div>
  </>
  );
}

export default NextTrain;
