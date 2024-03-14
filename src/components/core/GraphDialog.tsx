import { Dialog, IconButton } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import CloseIcon from '@mui/icons-material/Close';

const GraphDialog = ({ graphDialogOpen, setGraphDialogOpen, graphData, dataPoints }: any) => {




    const options = {

        title: {
            text: graphData?.caseType,
            align: 'left'
        },

        xAxis: {
            title: {
                text: 'Months'
            }
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
            name: graphData.caseType,
            data: dataPoints,
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
            <div >
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