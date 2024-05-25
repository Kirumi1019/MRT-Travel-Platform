"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

// Define the type for the mrtWholeInfo props
type StationInfo = {
  mrtStationDisplayId: string;
  mrtStationName: string;
  mrtLineNames: string[];
};

type StationsProps = {
  mrtWholeInfo: StationInfo[];
}

function Stations({mrtWholeInfo}: StationsProps){
  const router = useRouter();

  const handleClick = async (mrtStationDisplayId: string) => {
    // Redirect to a new page, you can adjust the URL as needed
    router.push(`./MRT_Stations/${mrtStationDisplayId}`);
  };

  return (
    <div className="w-auto p-6 flex flex-wrap justify-between gap-8 px-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 w-full">MRT Stations</h1>
      {mrtWholeInfo.map((info, index) => (
        <div
          key={index}
          className="w-1/3 flex-none border-2 border-transparent bg-gradient-to-r from-blue-300 to-teal-200 rounded-lg p-4 mb-4 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:border-violet-800 shadow-lg"
          onClick={() => handleClick(info.mrtStationDisplayId)}
        >
          <h2 className="text-2xl font-semibold text-gray-800">{info.mrtStationName}</h2>
          <p className="text-lg text-gray-700">Line: {info.mrtLineNames.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default Stations;
