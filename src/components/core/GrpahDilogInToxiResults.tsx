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
  console.log(graphData, "fsdaodsodsodos");
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
      min: Math.max(0, +graphData?.lower_limit * 0.8),
      max: Math.max(+graphData?.upper_limit, +graphData?.cutoff) * 1.2,
      plotLines: [
        {
          value: +graphData?.lower_limit,
          color: "red",
          dashStyle: "line",
          width: 2,
          label: {
            text: `Lower Limit (${graphData?.lower_limit} ng/mL)`,
          },
        },
        {
          value: +graphData?.cutoff,
          color: "green",
          dashStyle: "shortdash",
          width: 2,
          label: {
            text: `Normal (${graphData?.cutoff} ng/mL)`,
          },
        },
        {
          value: +graphData?.upper_limit,
          color: "red",
          dashStyle: "line",
          width: 2,
          label: {
            text: `Upper Limit (${graphData?.upper_limit} ng/mL)`,
          },
        },
      ],
    },
    tooltip: {
      formatter: function (
        this: Highcharts.TooltipFormatterContextObject | any
      ): string {
        return (
          this.point.category +
          "<b>" +
          " :" +
          Highcharts.numberFormat(this.point.y, 0, ".", ", ") +
          "</b>"
        );
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
