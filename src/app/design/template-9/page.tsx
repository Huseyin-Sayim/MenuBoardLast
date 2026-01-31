"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Template9 from "./component/template-9";
import { template9MenuItems } from "../template-data";

function Template9Content() {
    const searchParams = useSearchParams();
    const configId = searchParams.get("configId");

    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (configId) {
            const fetchConfig = async () => {
                try {
                    const response = await fetch(`/api/templates/template-9/config?configId=${configId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.configData) {
                            setConfig(data.configData);
                        }
                    } else {
                        console.error("Config fetch failed");
                    }
                } catch (error) {
                    console.error("Error fetching config:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchConfig();
        } else {
            setLoading(false);
        }
    }, [configId]);


    // Config varsa onu kullan, yoksa default verileri kullan
    const menuItems = config?.menuItems || template9MenuItems;
    const backgroundImage = config?.backgroundImage || "/images/chalkboard_bg.png";
    const menuTitle = config?.menuTitle || "Menu";

    return (
        <div className="w-full min-h-screen overflow-hidden flex items-center justify-center bg-black">
            <div className="w-full max-w-[1080px] max-h-[1920px] mx-auto" style={{ aspectRatio: '9/16' }}>
                <Template9
                    menuItems={menuItems}
                    backgroundImage={backgroundImage}
                    menuTitle={menuTitle}
                />
            </div>
        </div>
    );
}

export default function Template9Page() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center bg-black text-white">Yükleniyor...</div>}>
            <Template9Content />
        </Suspense>
    );
}
