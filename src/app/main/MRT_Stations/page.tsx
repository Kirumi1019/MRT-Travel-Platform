import { db } from "@/db";
import { mrtStationIDTable, mrtStationLineTable, mrtStationTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stations from "./Stations";

type MrtInfo = {
  mrtStationDisplayId: string,
  mrtStationName: string, 
  mrtLineName: string,
}

type GroupedMrtInfo = {
  mrtStationDisplayId: string,
  mrtStationName: string, 
  mrtLineNames: string[],
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
  }).from(mrtStationTable)
    .innerJoin(mrtStationIDTable, eq(mrtStationTable.displayId, mrtStationIDTable.mrtDisplayId))
    .innerJoin(mrtStationLineTable, eq(mrtStationIDTable.lineId, mrtStationLineTable.displayId));

// Group the data by mrtStationDisplayId and combine line names
const groupedInfo: GroupedStationsInfo = mrtWholeInfo.reduce((acc: GroupedStationsInfo, current: MrtInfo) => {
  const { mrtStationDisplayId, mrtStationName, mrtLineName } = current;
  if (!acc[mrtStationDisplayId]) {
    acc[mrtStationDisplayId] = {
      mrtStationDisplayId,
      mrtStationName,
      mrtLineNames: [mrtLineName],
    };
  } else {
    acc[mrtStationDisplayId].mrtLineNames.push(mrtLineName);
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