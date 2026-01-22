import { prisma } from "@/generated/prisma";
import { winterFavorites } from "../template-data";
import Template3Content from "./component/template-3";

type Props = {
    searchParams: Promise<{ configId?: string }>;
};

export default async function Template3Page({ searchParams }: Props) {
    const params = await searchParams;
    const configId = params.configId;

    // Default items
    let items = winterFavorites;

    // If configId is provided, fetch from database
    if (configId) {
        try {
            const config = await prisma.templateConfig.findUnique({
                where: { id: configId },
            });

            if (config && config.configData) {
                const configData = config.configData as any;

                // Check if config has data array
                if (configData.data && Array.isArray(configData.data) && configData.data.length > 0) {
                    items = configData.data.map((item: any, index: number) => ({
                        id: index + 1,
                        name: item.name || '',
                        price: item.price ? item.price.replace(/[^\d]/g, '') : '0',
                        img: item.image || "/images/toffeeNut.png",
                        category: 'Sıcak İçecek'
                    }));
                }
            }
        } catch (error) {
            console.error('Config fetch error:', error);
            // Use default items on error
        }
    }

    return <Template3Content items={items} />;
}
