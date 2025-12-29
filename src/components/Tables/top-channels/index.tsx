import { TableWrapper } from "./table-wrapper";
import { getScreen } from "@/services/screenServices";
import { cookies } from "next/headers";
import { getMedia } from "@/services/mediaServices";

export async function TopChannels({ 
  className,
  showActions = true 
}: { 
  className?: string;
  showActions?: boolean;
}) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  if (!userCookie) {
    return <div>Kullanıcı oturumu bulunamadı.</div>;
  }
  const user = JSON.parse(userCookie) as { id: string };
  const id = user.id;

  const data = await getScreen(id);
  const media = await getMedia(id);
  const formattedData = media.map((item) => {
    const isVideo = ["mp4", "webm", "ogg", "mov"].includes(
      item.extension.toLowerCase().replace(".", "")
    );

    return {
      id: item.id,
      name: item.name,
      type: (isVideo ? "video" : "image") as "video" | "image",
      url: item.url,
      uploadedAt: item.createdAt.toLocaleDateString("tr-TR"),
      duration: 0,
    };
  });

  return <TableWrapper data={data} className={className} initialMedia={formattedData} showActions={showActions} />;
}
