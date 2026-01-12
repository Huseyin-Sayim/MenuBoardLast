"use client";

import Template3Content from "./component/template-3";

type Props = {
  searchParams: Promise<{ preview?: string }>;
};

export default async function Template3Page({ searchParams }: Props) {
  const params = await searchParams;
  const isPreview = params.preview === 'true';
  
  return (
    <>
      <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <Template3Content />
      </div>
    </>
  );
}


