// "use client"

// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
// import useArticles from "@/hooks/useArticles";

// type ArticleInfo = {
//     articleTitle: string,
//     articleContent: string,
//     mrtdisplayId: string,
//     mrtName: string,
// }

// type ArticleProps = {
//     articles: ArticleInfo[]
// }

// interface Station {
//     displayId: string;
//     mrtName: string;
//   }

//   interface MrtLine {
//     displayId: string;
//     lineName: string;
//   }

//   interface StationLinePair {
//     mrtStationId: string;
//     lineId: string;
//     mrtDisplayId: string;
//   }


// function Modify({articles}: ArticleProps){

//     const { updateArticles, loading } = useArticles();
//     const [articleContent, setArticleContent] = useState("");
//     const [articleTitle, setArticleTitle] = useState("");
//     const [mrtStations, setMrtStations] = useState<Station[]>([]);
//     const [selectedStations, setSelectedStations] = useState<string[]>([]);
//     const [mrtLineList, setMrtLineList] = useState<MrtLine[]>([]);
//     const [stationLinePairList, setStationLinePairList] = useState<
//       StationLinePair[]
//     >([]);
  
    

//     const handleSubmit = async () => {
//         try {
//           const body = await updateArticles({
//             articleId: ,
//             authorId: userId,
//             articleContent: articleContent,
//             articleTitle: articleTitle,
//             mrtDisplayIds: selectedStations,
//           });
//         } catch (e) {
//           console.error(e);
//         }
//       };
    
//       const mapStationDisplayIdToStationName = (
//         stationList: Station[],
//         displayId: string
//       ) => {
//         const name = stationList.filter((list) => list.displayId === displayId);
//         return name[0].mrtName;
//       };
    
//       const mapStationToLine = (PairList: StationLinePair[], lineId: string) => {
//         const resList = PairList.filter((list) => list.lineId === lineId);
//         return (
//           <>
//             {resList.map((item) => (
//               <AccordionContent
//                 key={item.mrtDisplayId}
//                 className="m-4 w-1/3 flex items-center"
//               >
//                 <label className="w-1/2 h-full" htmlFor={item.mrtDisplayId}>
//                   {item.mrtStationId}{" "}
//                   {mapStationDisplayIdToStationName(mrtStations, item.mrtDisplayId)}
//                 </label>
//                 <Input
//                   type="checkbox"
//                   id={item.mrtDisplayId}
//                   value={item.mrtDisplayId}
//                   className="max-h-full w-1/2"
//                   onChange={(e) => {
//                     if (!selectedStations.includes(item.mrtDisplayId)) {
//                       setSelectedStations((list) => [...list, e.target.value]);
//                     } else
//                       setSelectedStations((list) =>
//                         list.filter(
//                           (stationDisplayId) =>
//                             stationDisplayId != item.mrtDisplayId
//                         )
//                       );
//                   }}
//                   checked={selectedStations.includes(item.mrtDisplayId)}
//                 ></Input>
//               </AccordionContent>
//             ))}
//           </>
//         );
//       };

//     return (
//         <>
//         <form onSubmit={handleSubmit}>
//         <h1 className="m-4">Title</h1>
//         <Input
//           name="title"
//           value={articleTitle}
//           onChange={(e) => {
//             setArticleTitle(e.target.value);
//           }}
//           className="m-4 w-1/2"
//           placeholder="Article Title"
//         ></Input>

//         <h1 className="m-4">Content</h1>
//         <textarea
//           name="content"
//           value={articleContent}
//           onChange={(e) => setArticleContent(e.target.value)}
//           rows={10}
//           className="m-4 block p-2.5 w-1/2  text-sm text-gray-900 bg-gray-50 
//                         rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
//                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
//                         dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           placeholder="Article Content (Drag the bottome-right corner to expand)"
//         ></textarea>

//         <h1 className="m-4">Station</h1>
//         <Accordion type="single" collapsible className="w-1/2 m-4">
//           {mrtLineList.map((item) => (
//             <AccordionItem key={item.displayId} value={item.lineName}>
//               <AccordionTrigger>{item.lineName}</AccordionTrigger>
//               {mapStationToLine(stationLinePairList, item.displayId)}
//             </AccordionItem>
//           ))}
//         </Accordion>
//         <Button disabled={loading} className="m-4">
//           Share
//         </Button>
//       </form>
//         </>
//     )
// }
// export default Modify