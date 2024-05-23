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
    <div>
      <h1>MRT Station Information</h1>
      {mrtWholeInfo.map((info, index) => (
        <div 
          key={index} 
          style={{ border: '1px solid black', margin: '10px', padding: '10px', cursor: 'pointer' }} 
          onClick={() => handleClick(info.mrtStationDisplayId)}
        >
          <h2>{info.mrtStationName}</h2>
          <p>Index: {index}</p>
          <p>Line: {info.mrtLineNames.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default Stations;
