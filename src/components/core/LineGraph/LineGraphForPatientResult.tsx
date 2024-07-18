import datePipe from "@/lib/Pipes/datePipe";
import { momentWithTimezone } from "@/lib/Pipes/timeFormat";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineGraphForPatientResult = ({
    graphDialogOpen,
    setGraphDialogOpen,
    graphValuesData,
    data,
    graphColor,
    tabValue,
    patientsData
}: any) => {
    const filterData = graphValuesData?.filter((item: any) => item?.result !== "-");
    const formattedDates = filterData?.map((item: any) => momentWithTimezone(item?.date));

    const options = {
        title: {
            text: data?.result_name,
            align: "left",
        },

        xAxis: {
            title: {
                text: "Months",
            },
            categories: formattedDates,
            type: 'datetime',
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
                name: "Results",
                data: filterData?.length
                    ? filterData?.map((item: any) => item.result)
                    : [],
                type: "line",
                zIndex: 9999,
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
                    maxWidth: "75% !important",
                    maxHeight: "520px",
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
export default LineGraphForPatientResult;
