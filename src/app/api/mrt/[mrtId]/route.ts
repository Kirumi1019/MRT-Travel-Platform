import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { mrtStationIDTable, mrtStationLineTable, mrtStationTable } from "@/db/schema";
import { eq } from "drizzle-orm";

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

// Getting MRT display_ID using url params 
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      mrtId: string;
    };
  }
) {
  try {
    const mrtStationInfo = await db.select({
      mrtStationDisplayId: mrtStationTable.displayId,
      mrtStationName: mrtStationTable.mrtName,
      mrtLineName: mrtStationLineTable.lineName,
    }).from(mrtStationTable)
      .innerJoin(mrtStationIDTable, eq(mrtStationTable.displayId, mrtStationIDTable.mrtDisplayId))
      .innerJoin(mrtStationLineTable, eq(mrtStationIDTable.lineId, mrtStationLineTable.displayId))
      .where(eq(mrtStationTable.displayId, params.mrtId));

    if (mrtStationInfo.length === 0) {
      return NextResponse.json({ error: "No station found with the given ID." }, { status: 500 });
    }

    // Merge the line names into a single entry
    // reduce can iterate the array and accumulate
    // can be view as for loop
    const mergedInfo: GroupedStationsInfo = mrtStationInfo.reduce((acc: GroupedStationsInfo, current: MrtInfo) => {
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

    // console.log(mergedInfo);
    return NextResponse.json(mergedInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
