import { db } from "@/db";
import { mrtStationIDTable, mrtStationLineTable, mrtStationTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Create_Article from "./create_article";


// station, linename, 代號
type Props = {
  params: {
    userId: string;
  };
};

async function Create_Article_Page({ params: { userId }  }: Props) {
  const mrtWholeInfo = await db.select({
    mrtStationDisplayId: mrtStationTable.displayId,
    mrtStationName: mrtStationTable.mrtName,
    mrtLineName: mrtStationLineTable.lineName,
    stationId: mrtStationIDTable.mrtStationId,
    lineDislpayId: mrtStationIDTable.lineId,
  }).from(mrtStationTable)
    .innerJoin(mrtStationIDTable, eq(mrtStationTable.displayId, mrtStationIDTable.mrtDisplayId))
    .innerJoin(mrtStationLineTable, eq(mrtStationIDTable.lineId, mrtStationLineTable.displayId))

  const mrtLineList = await db.select().from(mrtStationLineTable);
  return (
    <>
      <Create_Article userId={userId} mrtWholeInfo={mrtWholeInfo}
      mrtLineList={mrtLineList}/>
    </>
  );
}
export default Create_Article_Page;
