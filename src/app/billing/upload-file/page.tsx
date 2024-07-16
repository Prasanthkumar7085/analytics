"use client";
import UploadDataWithFile from "@/components/BillingAnalytics/UploadFile";
import { Suspense } from "react";

const UploadDataPage = () => {
  return (
    <Suspense>
      <div>
        <UploadDataWithFile />
      </div>
    </Suspense>
  );
};
export default UploadDataPage;
