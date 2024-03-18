import { Dialog, IconButton } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CloseIcon from "@mui/icons-material/Close";

const GraphDialog = ({
  graphDialogOpen,
  setGraphDialogOpen,
  graphData,
  graphValuesData,
  graphColor,
}: any) => {
  const options = {
    title: {
      text: graphData?.case_type_name,
      align: "left",
    },

    xAxis: {
      title: {
        text: "Months",
      },
      categories: Object?.values(graphValuesData)?.length
        ? Object?.keys(graphValuesData).map((item: any) => item)
        : [],
    },

    plotOptions: {
      series: {
        animation: false,
        marker: {
          enabled: true,
        },
        tooltip: {
          enabled: false,
        },
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      marker: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      area: {
        color: graphColor,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, graphColor],
            [1, Highcharts.color("white").setOpacity(0).get("rgba")],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    yAxis: {
      title: {
        text: "Number of Cases",
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: graphData.case_type_name,
        data: Object?.values(graphValuesData)?.length
          ? Object.values(graphValuesData).map((item: any) => +item)
          : [],
        type: "area",
      },
    ],
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
export default GraphDialog;
