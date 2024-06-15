"use client"

import { useState } from "react";
import PatientDetails from "./PatientDetails";
import PatientResultTable from "./PatientResultTable";

const PatientResults = () => {

    const [patientOpen, setPatientOpen] = useState(false);
    const [patientDetails, setPatientDetails] = useState<any>();

    // Function to group results by category
    function transformData(data: any[]) {
        const result: any = {};

        data.forEach((entry: { date: any; results: any[]; }) => {
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

    // Transform the patientResultsData to group results by category
    const initialPatientResultsData =
    {

        "patient_name": "blood reports",
        "patient_id": "MJ3oXOui",
        "final_results": [
            {
                "date": "2024-05-09 05:29:01",
                "results": [
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "699",
                        "result_name": "Calcium",
                        "reference_range": "8.6-10.0"
                    },
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "427",
                        "result_name": "BUN",
                        "reference_range": "6.00-20.00"
                    },
                    {
                        "units": "g/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "413",
                        "result_name": "Albumin",
                        "reference_range": "3.5-5.20"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "683",
                        "result_name": "Alk Phos",
                        "reference_range": "35-104"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "685",
                        "result_name": "ALT",
                        "reference_range": "0-33"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "587",
                        "result_name": "AST",
                        "reference_range": "0-32"
                    },
                    {
                        "units": "mmol/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "991",
                        "result_name": "Chloride",
                        "reference_range": "98-107"
                    },
                    {
                        "units": "mmol/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "763",
                        "result_name": "CO2",
                        "reference_range": "22-29"
                    },
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "668",
                        "result_name": "Glucose",
                        "reference_range": "74-109"
                    },
                    {
                        "units": "mmol/L",
                        "result": 5,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "990",
                        "result_name": "Potassium",
                        "reference_range": "3.5-5.1"
                    },
                    {
                        "units": "mmol/L",
                        "result": 120,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "989",
                        "result_name": "Sodium",
                        "reference_range": "136-145"
                    },
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "296",
                        "result_name": "Total Bilirubin",
                        "reference_range": "0.00-1.20"
                    },
                    {
                        "units": "g/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "679",
                        "result_name": "Total Protein",
                        "reference_range": "6.4-8.3"
                    },
                    {
                        "units": "",
                        "result": "-",
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "008",
                        "result_name": "Globulin",
                        "reference_range": ""
                    },
                    {
                        "units": "",
                        "result": "-",
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "008",
                        "result_name": "BUN/Creatinine Ratio",
                        "reference_range": ""
                    },
                    {
                        "units": "",
                        "result": "-",
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "008",
                        "result_name": "eGFR",
                        "reference_range": ""
                    },
                    {
                        "units": "mg/dL",
                        "result": "-",
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "013",
                        "result_name": "Creatinine",
                        "reference_range": "0.67-1.17"
                    },
                    {
                        "units": "",
                        "result": "-",
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "008",
                        "result_name": "Anion Gap",
                        "reference_range": ""
                    }
                ]
            },
            {
                "date": "2024-05-10 05:29:01",
                "results": [
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "699",
                        "result_name": "Calcium",
                        "reference_range": "8.6-10.0"
                    },
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "427",
                        "result_name": "BUN",
                        "reference_range": "6.00-20.00"
                    },
                    {
                        "units": "g/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "413",
                        "result_name": "Albumin",
                        "reference_range": "3.5-5.20"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Cardlic",
                        "test_code": "683",
                        "result_name": "Alk Phos",
                        "reference_range": "35-104"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "685",
                        "result_name": "ALT",
                        "reference_range": "0-33"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "587",
                        "result_name": "AST",
                        "reference_range": "0-32"
                    },
                    {
                        "units": "mmol/L",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "991",
                        "result_name": "Chloride",
                        "reference_range": "98-107"
                    }
                ]
            },
            {
                "date": "2024-05-12 05:29:01",
                "results": [
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "699",
                        "result_name": "Calcium",
                        "reference_range": "8.6-10.0"
                    },
                    {
                        "units": "mg/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "427",
                        "result_name": "BUN",
                        "reference_range": "6.00-20.00"
                    },
                    {
                        "units": "g/dL",
                        "result": 0,
                        "category": "Comprehensive Metabolic Panel",
                        "test_code": "413",
                        "result_name": "Albumin",
                        "reference_range": "3.5-5.20"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Cardlic",
                        "test_code": "683",
                        "result_name": "Alk Phos",
                        "reference_range": "35-104"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Cardlic",
                        "test_code": "685",
                        "result_name": "ALT",
                        "reference_range": "0-33"
                    },
                    {
                        "units": "U/L",
                        "result": 0,
                        "category": "Cardlic",
                        "test_code": "587",
                        "result_name": "AST",
                        "reference_range": "0-32"
                    },
                    {
                        "units": "mmol/L",
                        "result": 0,
                        "category": "Cardlic",
                        "test_code": "991",
                        "result_name": "Chloride",
                        "reference_range": "98-107"
                    }
                ]
            }
        ]
    }

    // Group results by category for each final_results entry
    const groupedPatientResultsData =
        transformData(initialPatientResultsData.final_results)

    const [patientResultsData, setPatientResultsData] = useState<any>(groupedPatientResultsData);


    return (
        <div>
            {patientOpen == false ? (
                <PatientDetails setPatientOpen={setPatientOpen} patientOpen={patientOpen} setPatientDetails={setPatientDetails} />
            ) : (
                <PatientResultTable setPatientOpen={setPatientOpen} patientOpen={patientOpen} patientDetails={patientDetails} patientResultsData={patientResultsData} />
            )}
        </div>
    )
}
export default PatientResults;
