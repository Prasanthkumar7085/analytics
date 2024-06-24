"use client"
import datePipe from "@/lib/Pipes/datePipe";
import { getAllPatientNamesAPI } from "@/services/patientResults/getAllPatientNamesAPI";
import { getAllPatientResultsAPI } from "@/services/patientResults/getAllPatientResultsAPI";
import { getSinglePatientResultAPI } from "@/services/patientResults/getSinglePatientResultAPI";
import { Autocomplete, Button, TextField } from "@mui/material";
import Container from "@mui/material/Container";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LineGraphForPatientResult from "../core/LineGraph/LineGraphForPatientResult";
import LineGraphForResults from "../core/LineGraph/LineGraphForResults";
import LoadingComponent from "../core/LoadingComponent";

const PatientResultTable = () => {
  const { id } = useParams();
  const router = useRouter();

  const [graphDialogOpen, setGraphDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState<any>();
  const [patientSingleRowData, setPatientSingleRowData] = useState({});
  const [rowResultsdata, setRowResultsData] = useState<number[]>([]);
  const [patientsData, setPatientsData] = useState<any>({});
  const [patientResultsData, setPatientResultsData] = useState<any>([]);
  const [patientNames, setPatientNames] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const sortedPatientNames = [...patientNames].sort((a, b) =>
    a.localeCompare(b)
  );

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
        setPatientsData(response?.data);
        setPatientResultsData(groupedPatientResultsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSinglePatientResult = async () => {
    setLoading(true);
    try {
      const response = await getSinglePatientResultAPI(id);
      if (response.status == 200 || response.status == 201) {
        setPatientDetails(response?.data);
        getPatientResults({
          patient_id: response?.data?.patient_id
        })
        getPatientNames({
          patient_id: response?.data?.patient_id
        });
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

  useEffect(() => {
    getSinglePatientResult();
  }, [])

  const handleGraphClick = (testIndex: number, title: string) => {
    const resultsArray = patientResultsData[title]
      .map((result: any) => {
        return parseFloat(result.results[testIndex]?.result);
      })
      .filter((value: any) => !isNaN(value));
    setRowResultsData(resultsArray);
    setGraphDialogOpen(true);
  };

  const getGraphValuesData = (
    patientResultsData: any,
    title: string,
    testIndex: number
  ) => {
    return patientResultsData[title]
      .map((result: any) => {
        const value = parseFloat(result.results[testIndex]?.result);
        return !isNaN(value) ? value : null;
      })
      .filter((value: any) => value !== null);
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
    <div style={{ paddingTop: "10px" }}>
      <div className="subNavBar">
        <Button
          className="bacKBtn"
          variant="outlined"
          onClick={() => {
            router.push("/patient-results");
          }}
        >
          Back
        </Button>
        <div className="SubNavPointsBlock">
          <div className="eachBlocks">
            <Image alt="" src="/card.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Patient ID</label>
              <p className="value">{patientDetails?.patient_id}</p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">First Name</label>
              <p className="value"> {patientDetails?.first_name}</p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Last Name</label>
              <p className="value">{patientDetails?.last_name}</p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/Group.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Gender</label>
              <p className="value">{patientDetails?.gender}</p>
            </div>
          </div>
          <div className="eachBlocks b-right">
            <Image alt="" src="/calendar.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Date of Birth</label>
              <p className="value">
                {datePipe(patientDetails?.date_of_birth, "MM-DD-YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="navActionsBlock">
        <Autocomplete
          className="defaultAutoComplete"
          options={sortedPatientNames}
          value={selectedPatient}
          onChange={(event, newValue) => {
            setSelectedPatient(newValue);
            getPatientResults({
              result_name: newValue,
              patient_id: patientDetails?.patient_id,
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Result Code"
              variant="outlined"
            />
          )}
          style={{ width: 300 }}
        />
        <Button className="bacKBtn" variant="contained">
          Export
        </Button>
      </div>

      {Object.keys(patientResultsData).map((title, index) => (
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
                      <th style={{ minWidth: "150px" }}>Trend</th>
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
                                {result.results[testIndex]?.result}
                              </td>
                            )
                          )}
                          <td>
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
                                graphValuesData={getGraphValuesData(
                                  patientResultsData,
                                  title,
                                  testIndex
                                )}
                              />
                            </div>
                            {/* )} */}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
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
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default PatientResultTable;
