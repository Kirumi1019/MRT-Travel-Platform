"use client";
// import { useParams } from 'next/navigation'; // use for getting url params
// pages/index.tsx
import { useEffect, useState } from "react";

// import component and animation
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

interface Youbike {
  sna: string;
  total: number;
  available_rent_bikes: number;
  available_return_bikes: number;
  act: string;
}

type MRTName = {
  mrtName: string;
};

function Youbike({ mrtName }: MRTName) {
  const [youbikeInfo, setYoubikeInfo] = useState<Youbike[]>([]);
  const [error, setError] = useState<string>("");

  // useParams can get the containing the current route's dynamic parameters.
  // const params = useParams<{mrtId: string}>();

  // With no dependency, this will only render once
  useEffect(() => {
    const fetchYoubikeInfo = async () => {
      try {
        const newName = mrtName.indexOf('/') !== -1 ?
         mrtName.substring(0,mrtName.indexOf('/')) : mrtName;

        const response = await fetch(`/api/youbikeInfo/${newName}`, {
          method: "GET",
        });
        // console.log('fetch api response');
        // console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const dataList = await response.json();
        setYoubikeInfo(dataList.youbike);
        // console.log(dataList.youbike);
        // console.log(youbikeInfo);
      } catch (err) {
        console.log(err);
        setError((err as Error).message);
      }
    };

    fetchYoubikeInfo();
  }, []);

  return (
    <>
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Youbike Info</h1>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Station Name</TableCell>
              <TableCell>Total Bikes</TableCell>
              <TableCell>Available Rent Bikes</TableCell>
              <TableCell>Available Return Bikes</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {youbikeInfo.length > 0 ? (
              youbikeInfo.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.sna}</TableCell>
                  <TableCell>{data.total}</TableCell>
                  <TableCell>
                    {data.available_rent_bikes !== 0 ? 
                    (<CheckCircleIcon className="mr-2 text-green-500" />) 
                        :
                    (<CloseIcon className="mr-2 text-red-500"/>)
                    }
                    {data.available_rent_bikes}
                  </TableCell>
                  <TableCell>{data.available_return_bikes !== 0 ? 
                      (<CheckCircleIcon className="mr-2 text-green-500" />) 
                          :
                      (<CloseIcon className="mr-2 text-red-500"/>)
                      }
                      {data.available_return_bikes}
                  </TableCell>
                  <TableCell>{data.act === '1' ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))
            ): (
              <div className="flex justify-center items-center col-span-2">
                <CircularProgress size={12}/>
                <p className="ml-2 text-gray-600 animate-pulse">Loading...</p>
              </div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  </>
  );
}

export default Youbike;
