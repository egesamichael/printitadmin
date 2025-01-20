import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import CategoriesPage from "@/components/Tables/EquipmentCategoriesTable";



import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Products from "@/components/Tables/ProductsTable";


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
       
        <Products />
      
      </div>
    </DefaultLayout>
  );
};

export default Equipment;
