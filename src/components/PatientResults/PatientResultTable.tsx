import datePipe from "@/lib/Pipes/datePipe";
import { Autocomplete, Button, TextField } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import LineGraphForPatientResult from "../core/LineGraph/LineGraphForPatientResult";
import LineGraphForResults from "../core/LineGraph/LineGraphForResults";

const PatientResultTable = ({
    setPatientOpen,
    patientOpen,
    patientDetails,
    patientResultsData,
    patientsData,
    patientNames,
    getPatientResults
}: any) => {
    const [dateGroup, setDateGroup] = useState<any>()
    const [graphDialogOpen, setGraphDialogOpen] = useState(false);
    const [patientSingleRowData, setPatientSingleRowData] = useState({})
    const [rowResultsdata, setRowResultsData] = useState<number[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const sortedPatientNames = [...patientNames].sort((a, b) => a.localeCompare(b));

    const groupByDate = (data: any) => {
        const groupedData: any = {};
        for (const key in data) {
            data[key].forEach((result: any) => {
                const date = result.date;
                if (!groupedData[date]) {
                    groupedData[date] = [];
                }
                groupedData[date].push({ key, result });
            });
        }
        return groupedData;
    };

    useEffect(() => {
        if (patientResultsData) {
            const groupedData = groupByDate(patientResultsData);
            setDateGroup(groupedData);
        }
    }, [patientResultsData]);

    const handleGraphClick = (testIndex: number, title: string) => {
        const resultsArray = patientResultsData[title].map((result: any) => {
            return parseFloat(result.results[testIndex]?.result);
        }).filter((value: any) => !isNaN(value));
        setRowResultsData(resultsArray);
        setGraphDialogOpen(true);
    };

    const getGraphValuesData = (patientResultsData: any, title: string, testIndex: number) => {
        return patientResultsData[title].map((result: any) => {
            const value = parseFloat(result.results[testIndex]?.result);
            return !isNaN(value) ? value : null;
        }).filter((value: any) => value !== null);
    };

    return (
        <>
            <div style={{ marginTop: "30px", display: 'flex', gap: "1rem" }}>
                <Button
                    variant='outlined'
                    onClick={() => {
                        setPatientOpen(false);
                    }}
                    style={{ color: "white" }}
                >
                    Back
                </Button>
                <div style={{ display: 'flex', gap: "1rem", color: "white" }}>
                    <Image
                        alt=""
                        src="/card.svg"
                        height={20}
                        width={20}
                    />
                    <div style={{ gap: "1rem" }}>
                        <label>Patient ID</label>
                        <p>{patientDetails?.patient_id}</p>
                    </div>
                    <Image
                        alt=""
                        src="/vector-patient.svg"
                        height={20}
                        width={20}
                    />
                    <div>
                        <label>First Name</label>
                        <p>{patientDetails?.first_name}</p>
                    </div>
                    <Image
                        alt=""
                        src="/vector-patient.svg"
                        height={20}
                        width={20}
                    />
                    <div>
                        <label>Last Name</label>
                        <p>{patientDetails?.last_name}</p>
                    </div>
                    <Image
                        alt=""
                        src="/Group.svg"
                        height={20}
                        width={20}
                    />
                    <div>
                        <label>Gender</label>
                        <p>{patientDetails?.gender}</p>
                    </div>
                    <Image
                        alt=""
                        src="/calendar.svg"
                        height={20}
                        width={20}
                    />
                    <div>
                        <label>Date of Birth</label>
                        <p>{datePipe(patientDetails?.date_of_birth, "MM-DD-YYYY")}</p>
                    </div>

                </div>

            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px", gap: "1rem" }}>
                <Autocomplete
                    options={sortedPatientNames}
                    value={selectedPatient}
                    onChange={(event, newValue) => {
                        setSelectedPatient(newValue)
                        getPatientResults({
                            result_name: newValue,
                            patient_id: patientDetails?.patient_id
                        })
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Select Result Code" variant="outlined" />}
                    style={{ width: 300 }}
                />
                <Button
                    variant='contained'
                    style={{ color: "white", backgroundColor: "blue" }}
                >
                    Export
                </Button>
            </div>

            {Object.keys(patientResultsData).map((title, index) => (
                <div key={index} style={{ marginTop: "30px" }}>
                    <h2>{title}</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f0f0f0" }}>
                                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Result Code</th>
                                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Ref Range & Units</th>
                                {patientResultsData[title].map((result: any, resultIndex: any) => (
                                    <th key={resultIndex} style={{ padding: "10px", border: "1px solid #ccc" }}>
                                        {datePipe(result?.date, "MM-DD-YYYY")}
                                    </th>
                                ))}
                                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientResultsData[title][0].results.map((test: any, testIndex: any) => (
                                <tr key={testIndex}>
                                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>{test.result_name}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>{test.reference_range}</td>
                                    {patientResultsData[title].map((result: any, resultIndex: any) => (
                                        <td key={resultIndex} style={{ padding: "10px", border: "1px solid #ccc" }}>
                                            {result.results[testIndex]?.result}
                                        </td>
                                    ))}
                                    <td style={{ padding: "10px", border: "1px solid #ccc", display: "flex", justifyContent: "center" }}>
                                        {/* {patientResultsData[title].some((result: any) => result.results[testIndex]?.result === "-") ? (
                                            <p>-</p>
                                        ) : ( */}
                                        <div
                                            onClick={() => {
                                                handleGraphClick(testIndex, title);
                                                setPatientSingleRowData(test);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <LineGraphForResults
                                                patientsData={patientsData}
                                                graphValuesData={getGraphValuesData(patientResultsData, title, testIndex)}
                                            />
                                        </div>
                                        {/* )} */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <LineGraphForPatientResult
                graphDialogOpen={graphDialogOpen}
                setGraphDialogOpen={setGraphDialogOpen}
                graphValuesData={rowResultsdata}
                data={patientSingleRowData}
                graphColor="blue"
                tabValue="Patient Result"
                patientsData={patientsData}
            />
        </>
    );
}

export default PatientResultTable;
