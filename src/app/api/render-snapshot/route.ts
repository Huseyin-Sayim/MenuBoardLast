import { NextResponse } from 'next/server';
import { renderTemplateSnapshot } from '@/services/renderService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, width = 1920, height = 1080, baseUrl } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL parametresi gereklidir' },
        { status: 400 }
      );
    }

    console.log('Render snapshot request:', { url, width, height });

    const snapshotUrl = await renderTemplateSnapshot(url, width, height, baseUrl);

    return NextResponse.json({
      success: true,
      snapshotUrl,
      message: 'Snapshot başarıyla oluşturuldu',
    });
  } catch (error: any) {
    console.error('Render snapshot API error:', error);
    return NextResponse.json(
      {
        error: 'Snapshot oluşturulamadı',
        message: error.message,
      },
      { status: 500 }
    );
  }
}


