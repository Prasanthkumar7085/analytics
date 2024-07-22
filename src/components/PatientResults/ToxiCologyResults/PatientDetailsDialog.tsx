import LoadingComponent from "@/components/core/LoadingComponent";
import { addSerial } from "@/lib/Pipes/addSerial";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getAllToxocologyPatientDetailsAPI } from "@/services/patientResults/getAllPatientResultsAPIs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PatientDetails from "../PatientDetails";
import { Button, Dialog, TextField } from "@mui/material";
import datePipe from "@/lib/Pipes/datePipe";
import Image from "next/image";
import { DatePicker } from "rsuite";
import SingleColumnTable from "@/components/core/Table/SingleColumn/SingleColumnTable";
import { ToxiPatientDetailsColumns } from "./ToxiPatientDetailsColumns";

const ToxiCologyPatientDetailsDialog = ({
  patientsDetailsDialog,
  setPatientsDetailsDialog,
}: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [dateOfBirth, setDateOfBirth] = useState<any>("");
  let dateFormat = datePipe(dateOfBirth, "YYYY-MM-DD");
  const [loading, setLoading] = useState(false);
  const [getDetails, setGetDetails] = useState<any[]>([]);
  const [firstName, setFirstName] = useState<any>("");
  const [lastName, setLastName] = useState<any>("");

  const getPatientDetails = async ({
    first_name,
    last_name,
    date_of_birth,
  }: any) => {
    setLoading(true);
    let queryParams: any = {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
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

    try {
      const response = await getAllToxocologyPatientDetailsAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        const modifieData = addSerial(
          response?.data,
          1,
          response?.data?.length
        );
        setGetDetails(modifieData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDateOfBirth = (date: any) => {
    setDateOfBirth(date);
  };

  return (
    <Dialog
      className="toxipatientResultDialog"
      open={patientsDetailsDialog}
      fullWidth
    >
      <div className="patientResultstsDashboard">
        <section id="patientDetails">
          <div className="subNavBar">
            <div className="SubNavPointsBlock">
              <div className="eachBlocks">
                <Image
                  alt=""
                  src="/vector-patient.svg"
                  height={20}
                  width={20}
                />
                <div className="namesData patientLabel">
                  <label className="label">First Name</label>
                  <TextField
                    className="inputTextField"
                    id="outlined-size-small"
                    placeholder="First Name"
                    size="small"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="eachBlocks">
                <Image
                  alt=""
                  src="/vector-patient.svg"
                  height={20}
                  width={20}
                />
                <div className="namesData patientLabel">
                  <label className="label">Last Name</label>
                  <TextField
                    className="inputTextField"
                    id="outlined-size-small"
                    placeholder="Last Name"
                    size="small"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="eachBlocks b-right">
                <Image alt="" src="/calendar.svg" height={20} width={20} />
                <div className="namesData patientLabel">
                  <label className="label">Date of Birth</label>
                  <DatePicker
                    placeholder="Select Date of Birth"
                    format="MM/dd/yyyy"
                    value={dateOfBirth ? new Date(dateOfBirth) : null}
                    onChange={(newValue) => {
                      onChangeDateOfBirth(newValue);
                    }}
                  />
                </div>
              </div>
              <Button
                className={
                  !(firstName || lastName || dateOfBirth)
                    ? "btnWithDisabled"
                    : "bacKBtn"
                }
                variant="outlined"
                disabled={!(firstName || lastName || dateOfBirth)}
                onClick={() => {
                  getPatientDetails({
                    first_name: firstName,
                    last_name: lastName,
                    date_of_birth: dateFormat,
                  });
                }}
              >
                Get Details
              </Button>
              <Button onClick={() => setPatientsDetailsDialog(false)}>
                Close
              </Button>
            </div>
          </div>
          <div className="eachDataCard">
            <div className="cardHeader">
              <h3>
                <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
                Patient Details
              </h3>
            </div>
            <div className="cardBody">
              {getDetails?.length ? (
                <SingleColumnTable
                  data={getDetails}
                  columns={ToxiPatientDetailsColumns({
                    router,
                    setPatientsDetailsDialog,
                  })}
                  loading={false}
                />
              ) : !loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Image
                    src="/Search Image.svg"
                    alt=""
                    height={210}
                    width={410}
                  />
                  <h3 className="no-data-text">No Data</h3>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      </div>
      <LoadingComponent loading={loading} />
    </Dialog>
  );
};
export default ToxiCologyPatientDetailsDialog;
