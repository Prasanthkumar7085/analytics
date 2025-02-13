"use client";
import UploadDataWithFile from "@/components/BillingAnalytics/UploadFile";
import { Suspense } from "react";
import { useEffect } from 'react';
const UploadDataPage = () => {
  useEffect(() => {
    document.body.classList.add('navbar-type-two');

    // Clean up by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove('navbar-type-two');
    };
  }, []);
  return (
    <Suspense>
      <div>
        <UploadDataWithFile />
      </div>
    </Suspense>
  );
};
export default UploadDataPage;
