import { Button, Card } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const PatientResultTable = ({ setPatientOpen, patientOpen, patientDetails, patientResultsData }: any) => {
    console.log(patientResultsData, "patient");
    const [dateGroup, setDateGroup] = useState<any>()
    console.log(dateGroup, "dateGroup");


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
                        <p>{patientDetails?.date_of_birth}</p>
                    </div>
                </div>

            </div>

            {Object.keys(patientResultsData).map((title, index) => (
                <div key={index}>
                    <h2>{title}</h2>
                    <table>
                        <thead>
                            <tr>

                                <th>Result Code</th>
                                <th>Ref Range & Units</th>{" "}
                                {patientResultsData[title].map((result: any, resultIndex: any) => (
                                    <th key={resultIndex}>{result?.date}</th>
                                ))}{" "}
                            </tr>
                        </thead>
                        <tbody>
                            {" "}
                            {patientResultsData[title][0].results.map(
                                (test: any, testIndex: any) => (
                                    <tr key={testIndex}>
                                        <td>{test.result_name}</td>
                                        <td>{test.reference_range}</td>{" "}
                                        {patientResultsData[title].map(
                                            (result: any, resultIndex: any) => (
                                                <td key={resultIndex}>
                                                    {result.results[testIndex]?.result}
                                                </td>
                                            )
                                        )}{" "}
                                    </tr>
                                )
                            )}{" "}
                        </tbody>
                    </table>
                </div>
            ))}
        </>

    );
}
export default PatientResultTable;