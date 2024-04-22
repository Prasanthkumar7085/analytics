import { Dialog, IconButton } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CloseIcon from "@mui/icons-material/Close";
import {
  formatDateToMonthName,
  formatMonthYear,
} from "@/lib/helpers/apiHelpers";
import { truncate } from "fs";

const GraphDialog = ({
  graphDialogOpen,
  setGraphDialogOpen,
  graphData,
  graphValuesData,
  graphColor,
  tabValue,
}: any) => {
  const options = {
    title: {
      text: graphData?.case_type
        ? graphData?.case_type.toUpperCase() + " " + tabValue.toUpperCase()
        : "TOTAL" + " " + tabValue.toUpperCase(),
      align: "left",
    },

    xAxis: {
      title: {
        text: "Months",
      },
      categories: graphValuesData?.length
        ? graphValuesData.map((item: any) => formatDateToMonthName(item.month))
        : [],
    },
    plotOptions: {
      series: {
        animation: false,
        marker: {
          enabled: true,
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

      area: {
        color: graphColor ? graphColor : "",
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, graphColor ? graphColor : ""],
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
      plotOptions: {
        series: {
          clip: true,
        },
      },
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      formatter: function (
        this: Highcharts.TooltipFormatterContextObject | any
      ): string {
        let month = this.point.category;
        let totalCases =
          this.series.chart.series[1].data[this.point.index].y.toLocaleString();
        let totalTargets =
          this.series.chart.series[0].data[this.point.index].y.toLocaleString();

        if (tabValue == "Revenue")
          return (
            this.point.category +
            "<b>" +
            " : $" +
            Highcharts.numberFormat(this.point.y, 2, ".", ", ") +
            "</b>"
          );
        else
          return (
            month +
            "<br>" +
            "Total Cases: <b>" +
            totalCases +
            "</b><br>" +
            "Total Targets: <b>" +
            totalTargets +
            "</b>"
          );
      },
    },
    yAxis: {
      title: {
        text: tabValue,
      },
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        name: "Total Targets",
        data: graphValuesData?.length
          ? graphValuesData.map((item: any) =>
              item.target_cases ? +item.target_cases : 0
            )
          : [],
        type: "area",
      },
      {
        name: "Total cases",
        data: graphValuesData?.length
          ? graphValuesData.map((item: any) =>
              item.total_cases ? +item.total_cases : 0
            )
          : [],
        type: "line",
        color: "#000000",
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
