import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import EquipmentsTable from "@/components/Tables/EquipmentTable";



import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


export const metadata: Metadata = {
  title: "Print IT",
  description:
    "Printing made easy",
};

const Equipment = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
       
        <EquipmentsTable />
      
      </div>
    </DefaultLayout>
  );
};

export default Equipment;