import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { screen, design, gallery } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      <OverviewCard
        label="Ekran Sayısı"
        data={{
          ...screen,
          value: compactFormat(screen.value),
          growthRate: 0
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Tasarım Sayısı"
        data={{
          ...design,
          value: "$" + compactFormat(design.value),
          growthRate: 0
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Galeri"
        data={{
          ...gallery,
          value: "$" + compactFormat(gallery.value),
          growthRate: 0
        }}
        Icon={icons.Gallery}
      />
    </div>
  );
}
