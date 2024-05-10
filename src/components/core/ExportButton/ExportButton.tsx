import { Button } from "@mui/material";

const ExportButton = ({
  onClick,
  disabled
}: any) => {

  return (
    <div>
      <Button variant="outlined" className="exportButton" onClick={onClick} disabled={disabled}>
        Export
        <img src="/log-out.svg" alt="export button" />
      </Button>
    </div>
  );
}
export default ExportButton;