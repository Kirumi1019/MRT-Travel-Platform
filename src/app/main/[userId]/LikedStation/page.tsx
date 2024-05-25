"use client";
import { UUID } from "crypto";
import { useEffect, useRef, useState } from "react";
import useLike from "@/hooks/useMrtLike";
import useStationLinePair from "@/hooks/useStationLinePair";
import useMRTLine from "@/hooks/useMrtLine";
import Link from "next/link";

type Props = {
  params: {
    userId: UUID;
  };
};

interface StationId {
  mrtDisplayId: UUID;
  mrtName: string;
}

interface LikedStationList {
  stations: {
    mrtDisplayId: UUID;
    mrtName: string;
  }[];
}

interface StationLinePair {
  mrtStationId: string;
  lineId: UUID;
  mrtDisplayId: UUID;
}

interface StationLinePairList {
  PairList: {
    mrtStationId: string;
    lineId: UUID;
    mrtDisplayId: UUID;
  }[];
}

interface Station {
  mrtDisplayId: UUID;
  mrtName: string;
  stationId: string[];
  lineDisplayId: UUID[];
}

interface MrtLine {
  displayId: UUID;
  lineName: string;
}

interface MrtLineList {
  LineList: {
    displayId: UUID;
    lineName: string;
  }[];
}

function LikedStation({ params: { userId } }: Props) {
  const initialised = useRef(false);
  const [loading, setLoading] = useState(false);
  const { getLikeMrt } = useLike();
  const { getStationLinePair } = useStationLinePair();
  const { getMrtLineList } = useMRTLine();
  const [stationIdList, setStationIdList] = useState<StationId[]>([]);
  const [stationLinePairList, setStationLinePairList] = useState<
    StationLinePair[]
  >([]);
  const [stationList, setStationList] = useState<Station[]>([]);
  const [mrtLineList, setMrtLineList] = useState<MrtLine[]>([]);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      setLoading(true);
      const fetchLikedStation = async () => {
        try {
          const body = await getLikeMrt({ userId });
          const fetchedData: LikedStationList = await body.json();
          //console.log(fetchedData);
          const stationList: StationId[] = fetchedData.stations.map((item) => ({
            mrtDisplayId: item.mrtDisplayId,
            mrtName: item.mrtName,
          }));
          setStationIdList(stationList);
        } catch (e) {
          console.error(e);
        }
      };

      const fetchStationLinePair = async () => {
        try {
          const body = await getStationLinePair();
          const fetchedData: StationLinePairList = await body.json();
          //console.log(fetchedData);
          const formattedStationLinePairList: StationLinePair[] =
            fetchedData.PairList.map((item) => ({
              mrtStationId: item.mrtStationId,
              lineId: item.lineId,
              mrtDisplayId: item.mrtDisplayId,
            }));
          setStationLinePairList(formattedStationLinePairList);
        } catch (e) {
          console.error(e);
        }
      };
      const fetchMRTLineList = async () => {
        try {
          const body = await getMrtLineList();
          const fetchedData: MrtLineList = await body.json();
          //console.log(fetchedData.LineList);
          const formattedMrtLineList: MrtLine[] = fetchedData.LineList.map(
            (item) => ({
              displayId: item.displayId,
              lineName: item.lineName,
            })
          );
          setMrtLineList(formattedMrtLineList);
        } catch (e) {
          console.error(e);
        }
      };

      fetchLikedStation();
      fetchStationLinePair();
      fetchMRTLineList();
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    stationIdList.map((item) => {
      var idList: string[] = [];
      var lineIdList: UUID[] = [];

      stationLinePairList.forEach((pair) => {
        if (pair.mrtDisplayId === item.mrtDisplayId) {
          idList.push(pair.mrtStationId);
          lineIdList.push(pair.lineId);
        }
      });
      setStationList((prevState) => {
        // 如果已存在相同的 mrtDisplayId，則不進行更新
        if (prevState.some((list) => list.mrtDisplayId === item.mrtDisplayId)) {
          return prevState;
        }

        // 否則將新的項目加入列表中
        return [
          ...prevState,
          {
            mrtDisplayId: item.mrtDisplayId,
            mrtName: item.mrtName,
            stationId: idList,
            lineDisplayId: lineIdList,
          },
        ];
      });
    });
  }, [stationIdList, stationLinePairList]);

  useEffect(() => {
    console.log(stationList);
  }, [stationList]);

  const showLineName = (displayId: UUID) => {
    const name = mrtLineList.filter((list) => list.displayId === displayId);
    return name[0].lineName;
  };

  return (
    <div className="w-auto p-6 flex flex-col items-center gap-8 px-8">
      {loading ? (
        <p>loading</p>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-1 text-center text-gray-800 w-full">
            My Stations
          </h1>
          <div className="m-4 w-full flex flex-wrap justify-evenly gap-8">
            {stationList.map((item) => (
              <Link
                key={item.mrtDisplayId}
                className="w-1/3 flex-none border-2 border-transparent bg-gradient-to-r from-blue-300 to-teal-200 rounded-lg p-4 mb-4 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:border-violet-800 shadow-lg"
                href={`/main/MRT_Stations/${item.mrtDisplayId}`}
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {item.mrtName}
                </h2>
                {item.stationId.length === 0 ? (
                  <div></div>
                ) : (
                  <p>{item.stationId.join(", ")}</p>
                )}
                {item.lineDisplayId.length === 0 ? (
                  <div></div>
                ) : (
                  <p className="text-lg text-gray-700">
                    Line:{" "}
                    {item.lineDisplayId.map((line) => showLineName(line) + " ")}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LikedStation;
