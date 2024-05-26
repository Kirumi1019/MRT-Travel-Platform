import { db } from "@/db";
import { articleMRTTable, articleTable, mrtStationTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import ShowArticles from "./Showarticles";

// Get url dynamic parameter
// "params" is fixed, cannot use other variable !!!!
type URLParams = {
    params: {
        userId: string;
    };
}

async function Myarticles({
    params: {userId},
}: URLParams)
{
  const articles = await db.select({
    articleTitle: articleTable.articleTitle,
    articleContent: articleTable.articleContent,
    articleId: articleTable.displayId,
    mrtdisplayId: mrtStationTable.displayId,
    mrtName: mrtStationTable.mrtName,
  })
    .from(articleTable)
    .where(eq(articleTable.authorId,userId))
    .innerJoin(articleMRTTable, eq(articleTable.displayId, articleMRTTable.articleId))
    .innerJoin(mrtStationTable, eq(mrtStationTable.displayId, articleMRTTable.mrtDisplayId))
    .execute();
    
    return (
        <>
            <ShowArticles articles={articles} userId={userId}/>
        </>
    )
}
export default Myarticles