import Template2Content from "./component/template-2";
import { menuItems } from "../template-data";

export default function Template2Page() {
  return (
    <>
      <div style={{ height: '100vh' }} className="w-full rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <Template2Content menuItems={menuItems} />
      </div>
    </>
  );
}



