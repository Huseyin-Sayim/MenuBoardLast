"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";

const IPSettingsPage = () => {
    const [ipAddress, setIpAddress] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedIp = localStorage.getItem("device_ip_settings");
            if (storedIp) setIpAddress(storedIp);
        }
    }, []);

    const handleSave = async () => {
        try {
            const response = await fetch('/api/settings/ip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ip: ipAddress }),
            });

            if (response.ok) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem("device_ip_settings", ipAddress);
                }
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                const errorData = await response.json();
                console.error("Hata:", errorData.message);
                setSaved(false);
            }
        } catch (error) {
            console.error("IP kaydetme hatası:", error);
            setSaved(false);
        }
    };

    return (
        <>
            <Breadcrumb pageName="IP Ayarları" />

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        IP Ayarları
                    </h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            IP Adresi
                        </label>
                        <input
                            type="text"
                            placeholder="Örn: 192.168.1.100"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 transition"
                    >
                        {saved ? "Kaydedildi!" : "Kaydet"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default IPSettingsPage;
