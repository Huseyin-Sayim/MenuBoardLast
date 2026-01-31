"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Template13 from "./component/template-13";

function Template13Content() {
    const searchParams = useSearchParams();
    const configId = searchParams.get("configId");

    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (configId) {
            const fetchConfig = async () => {
                try {
                    const response = await fetch(`/api/templates/template-13/config?configId=${configId}`);
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
    const menuItems = config?.menuItems;
    const extraItems = config?.extraItems;
    const extraTitle = config?.extraTitle || "EKSTRALAR";
    const sideImage = config?.sideImage;

    return (
        <div className="w-[1920px] h-[1080px] overflow-hidden">
            <Template13
                menuItems={menuItems}
                extraItems={extraItems}
                extraTitle={extraTitle}
                sideImage={sideImage}
            />
        </div>
    );
}

export default function Template13Page() {
    return (
        <Suspense fallback={<div className="w-[1920px] h-[1080px] flex items-center justify-center bg-black text-white">Yükleniyor...</div>}>
            <Template13Content />
        </Suspense>
    );
}
