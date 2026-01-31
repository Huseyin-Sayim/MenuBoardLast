"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Template12 from "./component/template-12";
import { template12MenuItems } from "../template-data";

export default function Template12Page() {
    const searchParams = useSearchParams();
    const configId = searchParams.get("configId");

    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (configId) {
            const fetchConfig = async () => {
                try {
                    const response = await fetch(`/api/templates/template-12/config?configId=${configId}`);
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
    const menuItems = config?.menuItems || template12MenuItems;
    const headerTitle = config?.headerTitle || "TAVUK MENÜLERİ";
    const footerNote = config?.footerNote || "FİYATLARIMIZ KDV DAHİLDİR.";

    return (
        <div className="w-[1920px] h-[1080px] overflow-hidden">
            <Template12
                menuItems={menuItems}
                headerTitle={headerTitle}
                footerNote={footerNote}
            />
        </div>
    );
}
