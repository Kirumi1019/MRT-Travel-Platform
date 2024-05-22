import { db } from "@/db";
import { mrtStationIDTable, mrtStationLineTable, mrtStationTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stations from "./Stations";


// Fetch mrtWholeInfo data
async function fetchMrtWholeInfo() {
  const mrtWholeInfo = await db.select({
    mrtStationDisplayId: mrtStationTable.displayId,
    mrtStationName: mrtStationTable.mrtName,
    mrtLineName: mrtStationLineTable.lineName,
  }).from(mrtStationTable)
    .innerJoin(mrtStationIDTable, eq(mrtStationTable.displayId, mrtStationIDTable.mrtDisplayId))
    .innerJoin(mrtStationLineTable, eq(mrtStationIDTable.lineId, mrtStationLineTable.displayId));

  return mrtWholeInfo;
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