"use client";
import Image from "next/image";
import { useEffect } from 'react';
function NotFoundPage() {
  useEffect(() => {
    document.body.classList.add('navbar-type-two', 'gray-bg');

    // Clean up by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove('navbar-type-two', 'gray-bg');
    };
  }, []);
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="h-[90vh]">
      <Image alt="404" src="/404.svg" height={450} width={450} />
    </div>
  );
}

export default NotFoundPage;
