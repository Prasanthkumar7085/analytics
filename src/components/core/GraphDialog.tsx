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
      text: graphData?.case_type_name
        ? graphData?.case_type_name.toUpperCase() + " " + tabValue.toUpperCase()
        : "TOTAL" + " " + tabValue.toUpperCase(),
      align: "left",
    },

    xAxis: {
      title: {
        text: "Months",
      },
      categories: Object?.values(graphValuesData)?.length
        ? Object?.keys(graphValuesData).map((item: any) =>
          formatMonthYear(item)
        )
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
        let pointColor = this.point.color;

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
            "Total Target: <b>" +
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
        name: "Total Target",
        data: Object?.values(graphValuesData)?.length
          ? Object.values(graphValuesData).map((item: any) => item[1])
          : [],
        type: "line",
        zIndex: 9999,
      },
      {
        name: "Total cases",
        data: Object?.values(graphValuesData)?.length
          ? Object.values(graphValuesData).map((item: any) => item[0])
          : [],
        type: "column",
        color: graphColor,
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
