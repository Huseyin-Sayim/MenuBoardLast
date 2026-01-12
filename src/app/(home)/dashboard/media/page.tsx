import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { MediaGallery } from "./_components/media-gallery";
import { cookies } from "next/headers";
import { getMedia } from "@/services/mediaServices";

export default async function MediaPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  if (!userCookie) {
    return <div>Kullanıcı oturumu bulunamadı.</div>;
  }
  const user = JSON.parse(userCookie) as { id: string };
  const id = user.id;

  const rawData = await getMedia(id)

  const formattedData = rawData.map((item : any) => {
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
  return (
    <>
      <Breadcrumb pageName="" />
      
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <MediaGallery initialData={formattedData} />
      </div>
    </>
  );
}


