"use client"
// pages/index.tsx
import { useEffect, useState } from 'react';

interface TrainInfo {
  CountDown: string;
  DestinationName: string;
  NowDateTime: string;
  StationName: string;
  TrainNumber: string;
}

function NextTrain(){
  const [trackInfo, setTrackInfo] = useState<TrainInfo[]>([]);
  const [error, setError] = useState<string>("");

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
    <div>
      <h1>Track Info</h1>
      {error && <p>Error: {error}</p>}
      {trackInfo.length > 0 ? (
          trackInfo.map((train, index) => (
            <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <p><strong>CountDown:</strong> {train.CountDown}</p>
              <p><strong>DestinationName:</strong> {train.DestinationName}</p>
              <p><strong>NowDateTime:</strong> {train.NowDateTime}</p>
              <p><strong>StationName:</strong> {train.StationName}</p>
              <p><strong>TrainNumber:</strong> {train.TrainNumber}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
    </div>
  );
};

export default NextTrain;
