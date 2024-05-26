import { db } from "@/db";
import { articleMRTTable, articleTable, mrtStationTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Modify from "./Modify";

// Get url dynamic parameter
// "params" is fixed, cannot use other variable !!!!
type URLParams = {
    params: {
        userId: string,
        articleId: string;
    };
}

async function Myarticles({
    params: {articleId, userId},
}: URLParams)
{
  const [articles] = await db.select({
    articleTitle: articleTable.articleTitle,
    articleContent: articleTable.articleContent,
    mrtdisplayId: mrtStationTable.displayId,
    mrtName: mrtStationTable.mrtName,
  })
    .from(articleTable)
    .where(and(eq(articleTable.authorId,userId),eq(articleTable.displayId, articleId)))
    .innerJoin(articleMRTTable, eq(articleTable.displayId, articleMRTTable.articleId))
    .innerJoin(mrtStationTable, eq(mrtStationTable.displayId, articleMRTTable.mrtDisplayId))
    .execute();
    
    return (
        <>
            <div>{userId}</div>
            <div>{articleId}</div>
            <div>{articles.articleTitle}</div>
            {/* <Modify articles={articles}/> */}
        </>
    )
}
export default Myarticles