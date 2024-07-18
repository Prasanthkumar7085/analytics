import LoadingComponent from "@/components/core/LoadingComponent";
import datePipe from "@/lib/Pipes/datePipe";
import { getSinglePatientResultAPI } from "@/services/patientResults/getAllPatientResultsAPIs";
import { Button, Container } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ToxiCologyResultsTable from "./ResultsTable";

const ToxiCologyResults = () => {
  const { id } = useParams();
  const router = useRouter();
  const [patientDetails, setPatientDetails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [toxicologyResults, setToxiCologyResults] = useState<any>({
    title: "ffdskdd",
  });

  const getSinglePatientResult = async () => {
    setLoading(true);
    try {
      const response = await getSinglePatientResultAPI(id);
      if (response.status == 200 || response.status == 201) {
        setPatientDetails(response?.data);
        // getPatientResults({
        //   patient_id: response?.data?.patient_id,
        // });
        // getPatientNames({
        //   patient_id: response?.data?.patient_id,
        // });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSinglePatientResult();
  }, []);

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
              <p className="value">
                {patientDetails?.patient_id ? patientDetails?.patient_id : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">First Name</label>
              <p className="value">
                {" "}
                {patientDetails?.first_name ? patientDetails?.first_name : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Last Name</label>
              <p className="value">
                {patientDetails?.last_name ? patientDetails?.last_name : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/Group.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Gender</label>
              <p className="value">
                {patientDetails?.gender ? patientDetails?.gender : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks b-right">
            <Image alt="" src="/calendar.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Date of Birth</label>
              <p className="value">
                {datePipe(
                  patientDetails?.date_of_birth
                    ? patientDetails?.date_of_birth
                    : "--",
                  "MM-DD-YYYY"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="navActionsBlock">
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
          <MenuItem
            onClick={() => {
              handleMenuClose();
              downloadAsPdf();
            }}
          >
            Export as PDF
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              exportPatientResultsTable(patientResultsData);
            }}
          >
            Export as Excel
          </MenuItem>
        </Menu>
      </div> */}
      {Object.keys(toxicologyResults).length ? (
        Object.keys(toxicologyResults).map((title, index) => (
          <Container maxWidth="xl" key={index}>
            <div
              className="eachPatientResultTable"
              key={index}
              style={{ marginTop: "30px" }}
            >
              <h2 className="tableHeading">{"Tale Title"}</h2>
              <div className="allPatientResultTable">
                <div className="tableContainer">
                  <ToxiCologyResultsTable />
                </div>
              </div>
            </div>
          </Container>
        ))
      ) : !loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Image src="/Search Image.svg" alt="" height={200} width={510} />
          <h3>No Data</h3>
        </div>
      ) : (
        ""
      )}
      {/* <LineGraphForPatientResult
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphValuesData={rowResultsdata}
        data={patientSingleRowData}
        graphColor="blue"
        tabValue="Patient Result"
        patientsData={patientsData}
      /> */}
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ToxiCologyResults;
