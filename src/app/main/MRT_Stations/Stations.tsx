"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useMRTLine from '@/hooks/useMrtLine';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// Define the type for the mrtWholeInfo props
type StationInfo = {
  mrtStationDisplayId: string;
  mrtStationName: string;
  mrtLineNames: string[];
  stationId: string[];
};

type StationsProps = {
  mrtWholeInfo: StationInfo[];
}

type Line = {
  displayId: string,
  lineName: string,
}

function countAlphabetFrequency(stationIds: string[]): { [key: string]: number } {
  const frequencyMap: { [key: string]: number } = {};
  // console.log(stationIds);
  stationIds.forEach(stationId => {
    const alphabet = stationId[1].search(/[A-Za-z]/) ? stationId.slice(0, 2) : stationId.slice(0, 1) ;
    console.log(stationId[1].search(/[A-Za-z]/));
    if (frequencyMap[alphabet]) {
      frequencyMap[alphabet]++;
    } else {
      frequencyMap[alphabet] = 1;
    }
  });
  return frequencyMap;
}

function sortByMostFrequentAlphabet(a: StationInfo, b: StationInfo): number {
  const aFrequencyMap = countAlphabetFrequency(a.stationId);
  const bFrequencyMap = countAlphabetFrequency(b.stationId);

  const aFrequencies = Object.values(aFrequencyMap).sort((a, b) => b - a);
  const bFrequencies = Object.values(bFrequencyMap).sort((a, b) => b - a);

  const aMostFrequentAlphabet = Object.keys(aFrequencyMap).find(
    key => aFrequencyMap[key] === aFrequencies[0]
  );
  const bMostFrequentAlphabet = Object.keys(bFrequencyMap).find(
    key => bFrequencyMap[key] === bFrequencies[0]
  );

  // If the most frequent alphabets are different, sort based on the alphabet
  if (aMostFrequentAlphabet! < bMostFrequentAlphabet!) {
    return -1;
  } else if (aMostFrequentAlphabet! > bMostFrequentAlphabet!) {
    return 1;
  } else {
    // If the most frequent alphabets are the same, sort based on the number after the alphabet
    const aMostFrequentNumbers = a.stationId
      .filter(stationId => stationId.startsWith(aMostFrequentAlphabet!))
      .map(stationId => parseInt(stationId.slice(2), 10))
      .sort((a, b) => a - b);

    const bMostFrequentNumbers = b.stationId
      .filter(stationId => stationId.startsWith(bMostFrequentAlphabet!))
      .map(stationId => parseInt(stationId.slice(2), 10))
      .sort((a, b) => a - b);

    // Compare the first elements of the sorted number arrays
    return aMostFrequentNumbers[0] - bMostFrequentNumbers[0];
  }
}

function Stations({mrtWholeInfo}: StationsProps){
  const router = useRouter();
  const { getMrtLineList, loading } = useMRTLine();
  const [mrtLine, setMrtLine] = useState<Line[]>([]);
  const [selectedLine, setSelectedLine] = useState<string>('All');

  // Use useRef to store the getMrtLineList function
  const getMrtLineListRef = useRef(getMrtLineList);
  useEffect(() => {
    const fetchMRTLineList = async () => {
        try {
          const res = await getMrtLineListRef.current();
          const info = await res.json();

          setMrtLine(info.LineList)
          setSelectedLine('All');
        } catch (e) {
          console.error(e);
        }
    }

    fetchMRTLineList();
  }, []);

  const handleClick = async (mrtStationDisplayId: string) => {
    // Redirect to a new page, you can adjust the URL as needed
    router.push(`./MRT_Stations/${mrtStationDisplayId}`);
  };

  const handleLineChange = (event: React.MouseEvent<HTMLElement>, newLine: string) => {
    setSelectedLine(newLine);
  };

  // filter the stations so that it matches with selectedLine
  const filteredStations = selectedLine === 'All'
    ? mrtWholeInfo
    : mrtWholeInfo.filter(station => station.mrtLineNames.includes(selectedLine));
  // console.log(filteredStations)
  const sortedFilterStations = filteredStations.sort(sortByMostFrequentAlphabet);
  console.log(sortedFilterStations);

  return (
    <div className="w-auto p-6 flex flex-col items-center gap-8 px-8">
      <h1 className="text-4xl font-bold mb-1 text-center text-gray-800 w-full">MRT Stations</h1>

      <ToggleButtonGroup value={selectedLine} exclusive onChange={handleLineChange} aria-label="MRT Line" 
      className="mb-1 flex flex-wrap bg-gradient-to-r from-emerald-100 via-teal-200 to-sky-400 gap-0 justify-center">
        {!loading ? (
          <ToggleButton
            value="All"
            aria-label="All"
            className={`text-lg px-10 py-2 font-bold transition-colors duration-400 rounded-md ${
              selectedLine === "All" ? "border-indigo-600 border-4" : ""
            }`}
          >
            全部捷運站
          </ToggleButton>
        ) : null}
        {mrtLine.map((line, index) => (
          <ToggleButton
            key={line.displayId}
            value={line.lineName}
            aria-label={line.lineName}
            className={`text-lg px-10 py-2 font-bold transition-colors duration-300 rounded-md ${
              selectedLine === line.lineName ? "border-indigo-600 border-4" : ""
            } `}
          >
            {line.lineName}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {!loading ? (<div className="w-full flex flex-wrap justify-between gap-8">
        {filteredStations.map((info, index) => (
          <div
            key={index}
            className="w-1/3 flex-none border-2 border-transparent bg-gradient-to-r from-blue-300 to-teal-200 rounded-lg p-4 mb-4 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:border-violet-800 shadow-lg"
            onClick={() => handleClick(info.mrtStationDisplayId)}
          >
            <h2 className="text-2xl font-semibold text-gray-800">{info.mrtStationName}</h2>
            <p className="text-lg text-gray-700">Line: {info.mrtLineNames.join(', ')}</p>
            <p>{info.stationId.join(', ')}</p>
          </div>
        ))}
      </div>) : null}
    </div>
  );
}

export default Stations;
