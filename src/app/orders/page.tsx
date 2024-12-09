import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import TableThree from "@/components/Tables/TableThree";



import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


export const metadata: Metadata = {
  title: "Print IT",
  description:
    "Printing made easy",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Orders" />

      <div className="flex flex-col gap-10">
       
        <TableThree />
      
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
