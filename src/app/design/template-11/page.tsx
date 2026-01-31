"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Template11 from "./component/template-11";

function Template11Content() {
    const searchParams = useSearchParams();
    const configId = searchParams.get("configId");

    // Placeholder for future dynamic data loading
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (configId) {
            setLoading(false); // No api yet
        } else {
            setLoading(false);
        }
    }, [configId]);

    return (
        <div className="w-full min-h-screen overflow-hidden flex items-center justify-center bg-black">
            <div className="w-full max-w-[1080px] max-h-[1920px] mx-auto" style={{ aspectRatio: '9/16' }}>
                <Template11 />
            </div>
        </div>
    );
}

export default function Template11Page() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center bg-black text-white">Yükleniyor...</div>}>
            <Template11Content />
        </Suspense>
    );
}
