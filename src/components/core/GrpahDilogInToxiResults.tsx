import {
  capitalizeAndRemoveUnderscore,
  formatMonthYear,
} from "@/lib/helpers/apiHelpers";
import { momentWithTimezone } from "@/lib/Pipes/timeFormat";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const GraphDialogForToxiResults = ({
  graphDialogOpen,
  setGraphDialogOpen,
  graphData,
  dates,
}: any) => {
  const getGraphValuesData = (data: any) => {
    const resultArrayWithDates = Object.entries(data.results).map(
      ([date, entry]: any) => [date, entry.result]
    );
    return resultArrayWithDates;
  };

  const options = {
    title: {
      text: capitalizeAndRemoveUnderscore(graphData?.category),
    },
    yAxis: {
      title: {
        text: `Reference Range ${graphData?.units}`,
      },
    },
    xAxis: {
      categories: dates?.map((item: any) => momentWithTimezone(item)),
    },
    series: [
      {
        name: capitalizeAndRemoveUnderscore(graphData?.category),
        data: getGraphValuesData(graphData),
        marker: {
          symbol: "triangle",
        },
      },
    ],
    legend: {
      enabled: true,
    },
  };

  return (
    <Dialog
      open={graphDialogOpen}
      fullWidth
      sx={{
        background: "#0000008f",
        zIndex: 1000,
        "& .MuiPaper-root": {
          margin: "0 !important",
          width: "100%",
          height: "calc(100% - 10px)",
          maxWidth: "80% !important",
          maxHeight: "600px",
        },
        "& .MuiTypography-root": {
          color: "#fff",
        },
      }}
    >
      <div className="dialogCloseButton">
        <IconButton
          onClick={() => {
            setGraphDialogOpen(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="hightChartsGraph">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Dialog>
  );
};
export default GraphDialogForToxiResults;
