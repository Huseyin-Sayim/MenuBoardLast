import { NextResponse } from "next/server";
import { getScreenConfig, updateScreenConfig } from "@/services/screenServices";


export  async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
  try {
    const {id:screenId} = await params;

    if (!screenId) {
      return NextResponse.json({
        message:'ScreenId eksik: '
      },{status:400})
    }

    const screenConfig = await getScreenConfig(screenId)

    return NextResponse.json({
      data:screenConfig
    },{status:200})

  } catch (err : any) {
    console.error('GET /api/screens/[id]/config - Error:', err);
    console.error('Error stack:', err.stack);
    return NextResponse.json({
      message:'Screen config getirilemedi: '+ err.message,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },{status:500})
  }
}

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  try {
    const {id:screenId} = await params;

    if (!screenId) {
      return NextResponse.json({
        message:'ScreenId eksik: '
      },{status:400})
    }

    const body = await req.json();
    const {configs} = body;

    console.log('PUT /api/screens/[id]/config - Request body:', JSON.stringify(body, null, 2));
    console.log('PUT /api/screens/[id]/config - Configs:', JSON.stringify(configs, null, 2));

    if (!configs || !Array.isArray(configs)) {
      return NextResponse.json({
        message:'Configs array eksik veya geçersiz'
      },{status:400})
    }

    console.log('PUT /api/screens/[id]/config - Calling updateScreenConfig with screenId:', screenId);
    const result = await updateScreenConfig(screenId, configs);
    console.log('PUT /api/screens/[id]/config - updateScreenConfig result:', result);

    return NextResponse.json({
      message:'Screen config başarıyla güncellendi',
      data:result
    },{status:200})

  } catch (err : any) {
    console.error('Screen config güncellenirken hata:', err);
    console.error('Hata stack:', err.stack);
    return NextResponse.json({
      message:'Screen config güncellenemedi: '+ err.message,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },{status:500})
  }
}