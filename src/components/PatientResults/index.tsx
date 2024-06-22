"use client"

import { useEffect, useState } from "react";
import PatientDetails from "./PatientDetails";
import PatientResultTable from "./PatientResultTable";
import { getAllPatientDetailsAPI } from "@/services/patientResults/getAllPatientDetailsAPI";
import LoadingComponent from "../core/LoadingComponent";
import { getAllPatientResultsAPI } from "@/services/patientResults/getAllPatientResultsAPI";
import { getAllPatientNamesAPI } from "@/services/patientResults/getAllPatientNamesAPI";

const PatientResults = () => {

    const [patientOpen, setPatientOpen] = useState(false);
    const [patientDetails, setPatientDetails] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [getDetails, setGetDetails] = useState<any[]>([]);
    const [patientsData, setPatientsData] = useState<any>({});
    const [patientResultsData, setPatientResultsData] = useState<any[]>([]);
    const [patientNames, setPatientNames] = useState<any[]>([]);

    const getPatientDetails = async ({
        first_name,
        last_name,
        date_of_birth,
    }: any) => {
        setLoading(true);
        try {
            let queryParams: any = {
                first_name: first_name,
                last_name: last_name,
                date_of_birth: date_of_birth,
            };
            const response = await getAllPatientDetailsAPI(queryParams);
            if (response.status == 200 || response.status == 201) {
                setGetDetails(response?.data)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const getPatientResults = async ({ patient_id, result_name }: any) => {
        setLoading(true);
        try {
            let queryParams: any = {
                patient_id: patient_id,
                result_name: result_name
            };
            const response = await getAllPatientResultsAPI(queryParams);
            if (response.status == 200 || response.status == 201) {
                let groupedPatientResultsData =
                    transformData(response?.data[0]?.final_results)
                setPatientsData(groupedPatientResultsData);
                setPatientResultsData(response?.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const getPatientNames = async ({ patient_id }: any) => {
        setLoading(true);
        try {
            let queryParams: any = {
                patient_id: patient_id
            };
            const response = await getAllPatientNamesAPI(queryParams);
            if (response.status == 200 || response.status == 201) {
                setPatientNames(response?.data)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Function to group results by category
    function transformData(data: any[]) {
        const result: any = {};

        data?.forEach((entry: { date: any; results: any[]; }) => {
            const date = entry.date;
            entry.results.forEach((test: { category: any; }) => {
                const category = test.category;

                if (!result[category]) {
                    result[category] = [];
                }

                // Find the existing entry for this date in the category
                let dateEntry = result[category].find((e: { date: any; }) => e.date === date);

                // If no entry for this date, create a new one
                if (!dateEntry) {
                    dateEntry = {
                        date: date,
                        results: []
                    };
                    result[category].push(dateEntry);
                }

                // Add the test result to the date entry
                dateEntry.results.push(test);
            });
        });

        return result;
    }


    return (
        <div>
            {patientOpen == false ? (
                <PatientDetails
                    setPatientOpen={setPatientOpen}
                    patientOpen={patientOpen}
                    setPatientDetails={setPatientDetails}
                    getPatientDetails={getPatientDetails}
                    getDetails={getDetails}
                    getPatientResults={getPatientResults}
                    getPatientNames={getPatientNames}
                />
            ) : (
                <PatientResultTable
                    setPatientOpen={setPatientOpen}
                    patientOpen={patientOpen}
                    patientDetails={patientDetails}
                    patientResultsData={patientsData}
                    patientsData={patientResultsData}
                    patientNames={patientNames}
                    getPatientResults={getPatientResults}
                    setGetDetails={setGetDetails}
                />
            )}
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default PatientResults;
