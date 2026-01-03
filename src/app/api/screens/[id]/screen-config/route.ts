// import { getScreenConfig, getScreenConfigByAndroid } from "@/services/screenServices";
// import { NextResponse } from "next/server";
//
// export async function GET(req: Request, {params} : {params: Promise<{id:string}>}) {
//   try {
//     const {id} = await params;
//
//     const data = await getScreenConfigByAndroid(id);
//
//     if (!data) {
//       return NextResponse.json({
//         message: "Ekran ayarları bulunamadı"
//       }, {status: 404})
//     }
//
//     return NextResponse.json({
//       data,
//     }, {status: 200});
//
//   } catch (error: any) {
//     return NextResponse.json({
//       message: "Ekran ayarları getiriliemedi"
//     }, {status: 500})
//   }
// }