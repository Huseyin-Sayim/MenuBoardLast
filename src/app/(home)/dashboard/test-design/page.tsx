"use client";
import React, { useState, useRef, useEffect } from 'react';

interface OverlayData {
  text: string;
  xPercent: number;
  yPercent: number;
  fontSizePercent: number; // Fontu videonun genişliğine oranlayacağız
  color: string;
}

export default function VideoEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<OverlayData>({
    text: "Örnek Yazı",
    xPercent: 10,
    yPercent: 10,
    fontSizePercent: 5,
    color: "#ffffff"
  });

  const handleDrag = (e: React.DragEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();


    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    setData(prev => ({ ...prev, xPercent: x, yPercent: y }));
  };

  const saveToBackend = async () => {
    const res = await fetch('/api/process-video', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert("Video işleniyor: " + result.jobId);
  };

  return (
    <div className="p-8 space-y-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-black inline-block"
        style={{ width: '100%', maxWidth: '1280px', aspectRatio: '16/9' }}
      >
        <video src="/https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" className="w-full h-full pointer-events-none" />

        {/* Sürüklenebilir Alan */}
        <div
          draggable
          onDragEnd={handleDrag}
          style={{
            position: 'absolute',
            left: `${data.xPercent}%`,
            top: `${data.yPercent}%`,
            fontSize: `${data.fontSizePercent}vw`,
            color: data.color,
            cursor: 'move',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 50
          }}
        >
          {data.text}
        </div>
      </div>

      {/* Kontrol Paneli */}
      <div className="flex gap-4 bg-gray-100 p-4 rounded">
        <input type="text" value={data.text} onChange={e => setData({...data, text: e.target.value})} className="border p-2" />
        <input type="color" value={data.color} onChange={e => setData({...data, color: e.target.value})} />
        <input type="range" min="1" max="20" value={data.fontSizePercent} onChange={e => setData({...data, fontSizePercent: Number(e.target.value)})} />
        <button onClick={saveToBackend} className="bg-blue-600 text-white px-4 py-2 rounded">Videoyu İşle</button>
      </div>
    </div>
  );
}