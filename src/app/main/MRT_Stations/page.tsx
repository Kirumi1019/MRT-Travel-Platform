import { db } from "@/db";
import { mrtStationIDTable, mrtStationLineTable, mrtStationTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stations from "./Stations";

type MrtInfo = {
  mrtStationDisplayId: string,
  mrtStationName: string, 
  mrtLineName: string,
  stationId: string,
}

type GroupedMrtInfo = {
  mrtStationDisplayId: string,
  mrtStationName: string, 
  mrtLineNames: string[],
  stationId: string[],
}

type GroupedStationsInfo = {
  [key: string]: GroupedMrtInfo,
};

// Fetch mrtWholeInfo data
async function fetchMrtWholeInfo() {
  const mrtWholeInfo = await db.select({
    mrtStationDisplayId: mrtStationTable.displayId,
    mrtStationName: mrtStationTable.mrtName,
    mrtLineName: mrtStationLineTable.lineName,
    stationId: mrtStationIDTable.mrtStationId,
  }).from(mrtStationTable)
    .innerJoin(mrtStationIDTable, eq(mrtStationTable.displayId, mrtStationIDTable.mrtDisplayId))
    .innerJoin(mrtStationLineTable, eq(mrtStationIDTable.lineId, mrtStationLineTable.displayId))
    .orderBy(mrtStationIDTable.mrtStationId)
    

// Group the data by mrtStationDisplayId and combine line names
const groupedInfo: GroupedStationsInfo = mrtWholeInfo.reduce((acc: GroupedStationsInfo, current: MrtInfo) => {
  const { mrtStationDisplayId, mrtStationName, mrtLineName, stationId } = current;
  if (!acc[mrtStationDisplayId]) {
    acc[mrtStationDisplayId] = {
      mrtStationDisplayId,
      mrtStationName,
      stationId: [stationId],
      mrtLineNames: [mrtLineName],
    };
  } else {
    acc[mrtStationDisplayId].mrtLineNames.push(mrtLineName);
    acc[mrtStationDisplayId].stationId.push(stationId);
  }
  return acc;
}, {}); // setting acc initial value as an empty object

// Convert the object back to an array
  return Object.values(groupedInfo);

}
async function ShowStations() {

  const mrtWholeInfo = await fetchMrtWholeInfo();
  
    return(
        <>
          <Stations mrtWholeInfo={mrtWholeInfo}/>
        </>
    )
}

export default ShowStations;