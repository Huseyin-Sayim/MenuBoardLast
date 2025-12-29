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
    return NextResponse.json({message:'Screen config getirilemedi: '+ err.message},{status:500})
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

    if (!configs || !Array.isArray(configs)) {
      return NextResponse.json({
        message:'Configs array eksik veya geçersiz'
      },{status:400})
    }

    const result = await updateScreenConfig(screenId, configs);

    return NextResponse.json({
      message:'Screen config başarıyla güncellendi',
      data:result
    },{status:200})

  } catch (err : any) {
    return NextResponse.json({message:'Screen config güncellenemedi: '+ err.message},{status:500})
  }
}