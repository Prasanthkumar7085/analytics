import Image from "next/image";

function NotFoundPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Image alt="404" src="/404.svg" height={800} width={800} />
    </div>
  );
}

export default NotFoundPage;
