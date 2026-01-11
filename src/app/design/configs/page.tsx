import { cookies } from "next/headers";
import { getAllUserTemplateConfigs } from "@/services/templateServices";
import Link from "next/link";

export default async function AllConfigsPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  
  if (!userCookie) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white">
          Config'lerim
        </h1>
        <p className="text-dark-4 dark:text-dark-6">
          Giriş yapmanız gerekiyor.
        </p>
      </div>
    );
  }

  try {
    const user = JSON.parse(userCookie) as { id: string };
    const configs = await getAllUserTemplateConfigs(user.id);

    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white">
          Config'lerim
        </h1>
        
        {configs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-4 dark:text-dark-6">
              Henüz config bulunmamaktadır.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {configs.map((config) => {
              if (!config.Template) return null;
              
              const configDate = new Date(config.createdAt);
              const formattedDate = configDate.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              // Template path'inden component'i al (örn: /design/template-1 -> template-1)
              const templatePath = config.Template.path;
              const templateComponent = config.Template.component || templatePath.replace('/design/', '');
              
              return (
                <Link
                  key={config.id}
                  href={`${templatePath}?configId=${config.id}`}
                  className="block overflow-hidden rounded-lg border border-stroke bg-white shadow-sm transition-all hover:shadow-lg dark:border-stroke-dark dark:bg-gray-dark"
                >
                  {/* Önizleme */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-2 dark:bg-dark-2">
                    <iframe
                      src={`${templatePath}?configId=${config.id}`}
                      className="absolute inset-0 border-0"
                      style={{
                        transform: `scale(${Math.min(640 / 1920, 360 / 1080)})`,
                        transformOrigin: "top left",
                        width: "1920px",
                        height: "1080px",
                      }}
                      title={`${config.Template.name} Config ${config.id} Önizleme`}
                      scrolling="no"
                    />
                  </div>

                  {/* Bilgi */}
                  <div className="border-t border-stroke p-4 dark:border-stroke-dark">
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                      {config.Template.name}
                    </h3>
                    <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
                      Config ID: {config.id.slice(-8)}
                    </p>
                    <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
                      Oluşturulma: {formattedDate}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Config listesi getirilirken hata:', error);
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white">
          Config'lerim
        </h1>
        <p className="text-dark-4 dark:text-dark-6">
          Config'ler getirilirken bir hata oluştu.
        </p>
      </div>
    );
  }
}

