"use client";
import { Autocomplete, Button, Menu, MenuItem, TextField } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { exportPatientResultsTable } from "@/lib/helpers/exportsHelpers";
import datePipe from "@/lib/Pipes/datePipe";
import { getAllPatientNamesAPI, getAllPatientResultsAPI, getSinglePatientResultAPI } from "@/services/patientResults/getAllPatientResultsAPIs";
import LineGraphForPatientResult from "../core/LineGraph/LineGraphForPatientResult";
import LoadingComponent from "../core/LoadingComponent";
import PatientResultsExport from "./PatientResultsExport";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const downloadAsPdf = async () => {
    const downloadRefElement = <PatientResultsExport
      patientResultsData={patientResultsData}
      handleGraphClick={handleGraphClick}
      setPatientSingleRowData={setPatientSingleRowData}
      patientsData={patientsData}
      getGraphValuesData={getGraphValuesData}
    />

    const htmlString = ReactDOMServer.renderToString(downloadRefElement);

    print(htmlString);
  };

  const print = (htmlString: string) => {
    const printWindow: any = window.open("", "blank");

    if (!printWindow) {
      console.error("Failed to open the window.");
      return;
    }

    if (!printWindow.document) {
      console.error("The document property of the window is undefined.");
      return;
    }

    try {
      printWindow.document.write(htmlString);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus(); // necessary for IE >= 10*/
        printWindow.print();
        printWindow.close();
      }, 100);
    } catch (error) {
      console.error("An error occurred while writing to the document:", error);
    }
  };


  return (
    <div style={{ paddingTop: "10px" }}>
      <div className="subNavBar">
        <Button
          className="bacKBtn"
          variant="outlined"
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
        <div className="SubNavPointsBlock">
          <div className="eachBlocks">
            <Image alt="" src="/card.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Patient ID</label>
              <p className="value">{patientDetails?.patient_id ? patientDetails?.patient_id : "--"}</p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">First Name</label>
              <p className="value"> {patientDetails?.first_name ? patientDetails?.first_name : "--"}</p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Last Name</label>
              <p className="value">{patientDetails?.last_name ? patientDetails?.last_name : "--"}</p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/Group.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Gender</label>
              <p className="value">{patientDetails?.gender ? patientDetails?.gender : "--"}</p>
            </div>
          </div>
          <div className="eachBlocks b-right">
            <Image alt="" src="/calendar.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Date of Birth</label>
              <p className="value">
                {datePipe(patientDetails?.date_of_birth ? patientDetails?.date_of_birth : "--", "MM-DD-YYYY")}
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
        {patientsData?.length ? (
          <Button
            className="bacKBtn"
            variant="contained"
            onClick={handleMenuClick}
          >
            Export
          </Button>
        ) : (
          ""
        )}
        <Menu
          id="export-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); downloadAsPdf(); }}>Export as PDF</MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            exportPatientResultsTable(
              patientResultsData
            );
          }}>Export as Excel</MenuItem>
        </Menu>
      </div>
      <>
        <PatientResultsExport
          patientResultsData={patientResultsData}
          handleGraphClick={handleGraphClick}
          setPatientSingleRowData={setPatientSingleRowData}
          patientsData={patientsData}
          getGraphValuesData={getGraphValuesData}
        />
      </>
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
