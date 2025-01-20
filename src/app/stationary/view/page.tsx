import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import StationaryPage from "@/components/Tables/Stationary";



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
       
        <StationaryPage />
      
      </div>
    </DefaultLayout>
  );
};

export default Equipment;
