import { Container } from "@mui/material";
import Image from "next/image";
import datePipe from "@/lib/Pipes/datePipe";

const PatientResultsExport = ({
    patientResultsData,
    handleGraphClick,
    setPatientSingleRowData,
    patientsData,
    getGraphValuesData
}: any) => {

    return (
        <div>
            {Object.keys(patientResultsData).length
                ?
                Object.keys(patientResultsData).map((title, index) => (
                    <Container maxWidth="xl" key={index}>
                        <div
                            className="eachPatientResultTable"
                            key={index}
                            style={{ marginTop: "30px" }}
                        >
                            <h2 className="tableHeading">{title}</h2>
                            <div className="allPatientResultTable">
                                <div className="tableContainer">
                                    <table >
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: "150px" }}>Result Code</th>
                                                <th style={{ minWidth: "150px" }}>Ref Range & Units</th>
                                                {patientResultsData[title]?.map(
                                                    (result: any, resultIndex: any) => (
                                                        <th style={{ minWidth: "100px" }} key={resultIndex}>
                                                            {datePipe(result?.date, "MM-DD-YYYY")}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patientResultsData[title][0].results.map(
                                                (test: any, testIndex: any) => (
                                                    <tr key={testIndex}>
                                                        <td>{test.result_name}</td>
                                                        <td>{test.reference_range}</td>
                                                        {patientResultsData[title].map(
                                                            (result: any, resultIndex: any) => (
                                                                <td key={resultIndex}>
                                                                    {result.results?.find((ite: any) => ite.result_name == test.result_name)?.result}
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Container>
                )
                )
                :
                <div style={{ display: "flex", alignItems: 'center', justifyContent: "center", flexDirection: "column" }}>
                    <Image
                        src="/Search Image.svg"
                        alt=""
                        height={200}
                        width={510}
                    />
                    <h3>No Data</h3>
                </div>
            }
        </div>
    );
}
export default PatientResultsExport;