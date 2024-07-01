"use client"
import { useState } from "react";
import { getAllPatientDetailsAPI } from "@/services/patientResults/getAllPatientResultsAPIs";
import LoadingComponent from "../core/LoadingComponent";
import PatientDetails from "./PatientDetails";

const PatientResults = () => {

    const [loading, setLoading] = useState(false);
    const [getDetails, setGetDetails] = useState<any[]>([]);

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

    return (
        <div>
            <PatientDetails
                getPatientDetails={getPatientDetails}
                getDetails={getDetails}
            />
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default PatientResults;
