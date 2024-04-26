import { Button } from "@mui/material";

const ExportButton = ({
    onClick
}: any) => {

    return (
      <div>
        <Button variant="outlined" className="exportButton" onClick={onClick}>
          Export
          <img src="/log-out.svg" alt="export button" />
        </Button>
      </div>
    );
}
export default ExportButton;