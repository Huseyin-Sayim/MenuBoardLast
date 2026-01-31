"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Template8 from "./component/template-8";
import { template8MenuItems, template8HotItems, template8ForYouItems, template8Aromas } from "../template-data";

function Template8Content() {
    const searchParams = useSearchParams();
    const configId = searchParams.get("configId");

    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (configId) {
            const fetchConfig = async () => {
                try {
                    // API endpointine configId gönderip veriyi alıyoruz
                    // Not: API'de user kontrolü olduğu için bu fetch işlemi public bir endpoint 
                    // veya farklı bir yöntem gerektirebilir. Ancak mevcut yapıda düzenleme sayfasında 
                    // kullanılan endpoint'i kullanıyoruz.
                    const response = await fetch(`/api/templates/template-8/config?configId=${configId}`);
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
    const menuItems = config?.menuItems || template8MenuItems;
    const hotItems = config?.hotItems || template8HotItems;
    const forYouItems = config?.forYouItems || template8ForYouItems;

    return (
        <div className="w-full h-screen overflow-hidden">
            <Template8
                menuItems={menuItems}
                hotItems={hotItems}
                forYouItems={forYouItems}
                aromaItems={template8Aromas}
            />
        </div>
    );
}

export default function Template8Page() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black text-white">Yükleniyor...</div>}>
            <Template8Content />
        </Suspense>
    );
}
