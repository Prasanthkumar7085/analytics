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
  tabValue
}: any) => {

  function formatMonthYear(monthYear: string) {
    let month = monthYear.substring(0, 3); // Extract the first 3 characters (abbreviation of month)
    let year = monthYear.substring(monthYear.length - 2); // Extract the last 4 characters (year)
    return month + " '" + year; // Concatenate month abbreviation and year
  }


  const options = {
    title: {
      text: graphData?.case_type_name ? graphData?.case_type_name + " " + tabValue.toUpperCase() : "TOTAL" + " " + tabValue.toUpperCase(),
      align: "left",
    },

    xAxis: {
      title: {
        text: "Months",
      },
      categories: Object?.values(graphValuesData)?.length
        ? Object?.keys(graphValuesData).map((item: any) => formatMonthYear(item))
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
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject | any): string {
        if (tabValue == "Revenue")
          return this.point.category + '<b>' + ' : $' + Highcharts.numberFormat(this.point.y, 2, '.', ', ') + '</b>';
        else
          return this.point.category + ' : ' + '<b>' + Highcharts.numberFormat(this.point.y, 0, '.', ', ') + '</b>';
      }
    },
    yAxis: {
      title: {
        text: tabValue,
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
