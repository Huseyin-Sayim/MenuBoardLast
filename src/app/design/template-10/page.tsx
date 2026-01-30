"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Template10 from "./component/template-10";
import { template10MenuItems, template10FeaturedProducts } from "../template-data";

export default function Template10Page() {
    const searchParams = useSearchParams();
    const configId = searchParams.get("configId");

    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (configId) {
            const fetchConfig = async () => {
                try {
                    const response = await fetch(`/api/templates/template-10/config?configId=${configId}`);
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
    const menuItems = config?.menuItems || template10MenuItems;
    const featuredProducts = config?.featuredProducts || template10FeaturedProducts;
    const heroTitle = config?.heroTitle || {
        line1: "Kıng",
        line2: "Deals",
        valueLine: "Valu Menu"
    };

    return (
        <div className="w-[1920px] h-[1080px] overflow-hidden bg-black">
            <Template10
                menuItems={menuItems}
                featuredProducts={featuredProducts}
                heroTitle={heroTitle}
            />
        </div>
    );
}
