import Template4Content from "@/app/design/template-4/component/template-4";

type Props = {
  searchParams: Promise<{ preview?: string }>;
};

export default async function Template4Page({ searchParams }: Props) {
  // Preview parametresi eklendi (template-4'te config yok ama tutarlılık için)
  const params = await searchParams;
  const isPreview = params.preview === 'true';
  
  return (
    <>
      <Template4Content/>
    </>
  );
}