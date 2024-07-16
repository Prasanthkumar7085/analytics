import { formatMonthYear } from "@/lib/helpers/apiHelpers";
import formatMoney from "@/lib/Pipes/moneyFormat";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const GraphDialogForBillingAndReveune = ({
  graphDialogOpen,
  setGraphDialogOpen,
  graphData,
  graphValuesData,
  graphColor,
  tabValue,
  label,
}: any) => {
  let billingSeries = [
    {
      name: "Cases",
      data: Object?.values(graphValuesData)?.length
        ? Object.values(graphValuesData).map((item: any) => item[0])
        : [],
      type: "line",
      color: "blue",
      zIndex: 9999,
    },
    {
      name: "Billed",
      data: Object?.values(graphValuesData)?.length
        ? Object.values(graphValuesData).map((item: any) => item[1])
        : [],
      type: "line",
      zIndex: 9999,
      color: "green",
    },
  ];

  let revenueSeries = [
    {
      name: "Target",
      data: Object?.values(graphValuesData)?.length
        ? Object.values(graphValuesData).map((item: any) => item[0])
        : [],
      type: "column",
      color: "blue",
    },
    {
      name: "Received",
      data: Object?.values(graphValuesData)?.length
        ? Object.values(graphValuesData).map((item: any) => item[1])
        : [],
      type: "column",
      zIndex: 9999,
      color: "green",
    },
  ];

  const options = {
    title: {
      text: graphData?.[label]
        ? graphData?.[label].toUpperCase() + " " + tabValue.toUpperCase()
        : "TOTAL" + " " + tabValue?.toUpperCase(),
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

        if (tabValue == "revenue")
          return (
            month +
            "<br>" +
            "Targets: <b>" +
            formatMoney(totalTargets) +
            "</b><br>" +
            "Received: <b>" +
            formatMoney(totalCases) +
            "</b>"
          );
        else
          return (
            month +
            "<br>" +
            "Cases: <b>" +
            totalTargets +
            "</b><br>" +
            "Billed: <b>" +
            formatMoney(totalCases) +
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
    series: tabValue == "billed" ? billingSeries : revenueSeries,
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
export default GraphDialogForBillingAndReveune;
