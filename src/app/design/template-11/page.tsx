"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Template11 from "./component/template-11";

export default function Template11Page() {
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
