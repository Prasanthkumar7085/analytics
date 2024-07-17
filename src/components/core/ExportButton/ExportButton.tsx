import { Button } from "@mui/material";
import Image from "next/image";
const ExportButton = ({
  onClick,
  disabled
}: any) => {

  return (
    <div>
      <button className="exportButton uppercase bg-blue-800 text-white rounded-md px-2 py-2 flex items-center" onClick={onClick} disabled={disabled}>
        Export
        <Image alt="export button" className="w-5 ml-2" src="/log-out.svg" height={20} width={20} />
      </button>

    </div>
  );
}
export default ExportButton;