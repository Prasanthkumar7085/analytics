import {
  capitalizeAndRemoveUnderscore,
  formatMonthYear,
} from "@/lib/helpers/apiHelpers";
import { momentWithTimezone } from "@/lib/Pipes/timeFormat";
import { CommentsDisabledOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton } from "@mui/material";
import dayjs from "dayjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const GraphDialogForToxiResults = ({
  graphDialogOpen,
  setGraphDialogOpen,
  graphData,
  dates,
}: any) => {
  const getGraphValuesDataInnerTable = (data: any) => {
    let results = JSON.parse(JSON.stringify(data.results));
    const resultArrayWithDates = Object.entries(results).map(
      ([date, entry]: any) => {
        graphData.upper_limit = +graphData.upper_limit;
        graphData.cutoff = +graphData.cutoff;
        graphData.lower_limit = +graphData.lower_limit;

        let max = graphData.upper_limit;

        if (max >= entry.result && graphData.cutoff < entry.result) {
          let units = graphData.cutoff;
          let gap = max - graphData.cutoff;

          let singleUnit = gap / units;
          entry.result = entry.result / singleUnit + graphData.cutoff;
        } else if (max < entry.result) {
          entry.result =
            graphData.cutoff * 2 +
            (graphData.cutoff - graphData.lower_limit) / 2;
        }
        return [date, entry.result];
      }
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
      tickPositions: [
        0,
        +graphData?.lower_limit,
        +graphData?.cutoff,
        +graphData?.cutoff * 2 + (graphData?.cutoff - graphData?.lower_limit),
      ],
      plotLines: [
        {
          value: +graphData?.lower_limit,
          color: "red",
          dashStyle: "line",
          width: 2,
          label: {
            text: `Lower Limit (${graphData?.lower_limit} ${graphData?.units})`,
          },
        },
        {
          value: +graphData?.cutoff,
          color: "green",
          dashStyle: "shortdash",
          width: 2,
          label: {
            text: `Normal (${graphData?.cutoff} ${graphData?.units})`,
          },
        },
        {
          value: +graphData?.cutoff * 2,
          color: "red",
          dashStyle: "line",
          width: 2,
          label: {
            text: `Upper Limit (${graphData?.upper_limit} ${graphData?.units})`,
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
          graphData.results[dates[this.point.index]]?.result +
          " " +
          graphData?.units +
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
        data: getGraphValuesDataInnerTable(graphData),
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
      <div className="hightChartsGraph lineGraph">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Dialog>
  );
};
export default GraphDialogForToxiResults;
