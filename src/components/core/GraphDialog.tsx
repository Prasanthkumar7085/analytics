import { Dialog, IconButton } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import CloseIcon from '@mui/icons-material/Close';

const GraphDialog = ({ graphDialogOpen, setGraphDialogOpen, graphData, graphValuesData, graphColor }: any) => {




    const options = {

        title: {
            text: graphData?.case_type_name,
            align: 'left'
        },

        xAxis: {
            title: {
                text: 'Months'
            },
            categories: Object?.values(graphValuesData)?.length ? Object?.keys(graphValuesData).map((item: any) => item) : [],

        },
        plotOptions: {
            area: {
                color: graphColor,
            },
        },
        yAxis: {
            title: {
                text: 'Number of Cases'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: graphData.case_type_name,
            data: Object?.values(graphValuesData)?.length ? Object.values(graphValuesData).map((item: any) => +item) : [],
            type: 'area'
        }]
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
                    maxWidth: "90% !important",
                    maxHeight: "600px",
                },
                "& .MuiTypography-root": {
                    color: "#fff",
                },
            }}
        >
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <IconButton onClick={() => {
                    setGraphDialogOpen(false)

                }}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div>
                <HighchartsReact highcharts={Highcharts} options={options} />;
            </div>
        </Dialog >
    )
}
export default GraphDialog;