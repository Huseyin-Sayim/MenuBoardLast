import { createScreen } from "@/services/screenServices";
import { NextResponse } from "next/server";

export async function POST(req: Request){
  try {
    const {code} = await req.json();

    const newScreen = await createScreen(code);

    return NextResponse.json({
      newScreen
    }, {status: 201})

  } catch (error: any) {
    return NextResponse.json({
      message: error.message
    }, {status: 500})
  }
}