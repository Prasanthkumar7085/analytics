"use client"
import { useEffect, useState } from "react";
import { getAllPatientDetailsAPI } from "@/services/patientResults/getAllPatientResultsAPIs";
import LoadingComponent from "../core/LoadingComponent";
import PatientDetails from "./PatientDetails";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addSerial } from "@/lib/Pipes/addSerial";

const PatientResults = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [getDetails, setGetDetails] = useState<any[]>([]);
    const [firstName, setFirstName] = useState<any>("");
    const [lastName, setLastName] = useState<any>("");
    const [dateOfBirth, setDateOfBirth] = useState<any>("");

    const getPatientDetails = async ({
        first_name = params.get("first_name"),
        last_name = params.get("last_name"),
        date_of_birth = params.get("date_of_birth"),
    }: any) => {
        setLoading(true);
        let queryParams: any = {
            first_name: first_name,
            last_name: last_name,
            date_of_birth: date_of_birth,
        };
        if (first_name) {
            queryParams["first_name"] = first_name;
        }
        if (last_name) {
            queryParams["last_name"] = last_name;
        }
        if (date_of_birth) {
            queryParams["date_of_birth"] = date_of_birth;
        }
        let queryString = prepareURLEncodedParams("", queryParams);

        router.push(`${pathname}${queryString}`);
        try {

            const response = await getAllPatientDetailsAPI(queryParams);
            if (response.status == 200 || response.status == 201) {
                const modifieData = addSerial(response?.data, 1, response?.data?.length);
                setGetDetails(modifieData)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (params.get("first_name") || params.get("last_name") || params.get("date_of_birth")) {
            getPatientDetails({});
            setFirstName(params.get("first_name"));
            setLastName(params.get("last_name"));
            setDateOfBirth(params.get("date_of_birth"));
        }
    }, [])

    return (
        <div>
            <PatientDetails
                getPatientDetails={getPatientDetails}
                getDetails={getDetails}
                setFirstName={setFirstName}
                firstName={firstName}
                setLastName={setLastName}
                lastName={lastName}
                setDateOfBirth={setDateOfBirth}
                dateOfBirth={dateOfBirth}
            />
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default PatientResults;
