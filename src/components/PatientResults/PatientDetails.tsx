"use client";
import { Button, Card, TextField } from "@mui/material";
import { useState } from "react";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import datePipe from "@/lib/Pipes/datePipe";
import Container from "@mui/material/Container";


const PatientDetails = ({
  setPatientOpen,
  patientOpen,
  setPatientDetails,
  getDetails,
  getPatientDetails,
  getPatientResults,
  getPatientNames,
}: any) => {
  const [firstName, setFirstName] = useState<any>("");
  const [lastName, setLastName] = useState<any>("");
  const [dateOfBirth, setDateOfBirth] = useState<any>("");

  const onChangeDateOfBirth = (date: any) => {
    setDateOfBirth(date);
  };

  let dateFormat = datePipe(dateOfBirth, "YYYY-MM-DD");

  const Revenuecolumns = [
    {
      accessorFn: (row: any) => row.patient_id,
      id: "patient_id",
      header: () => <span>PATIENT ID</span>,
      cell: (info: any) => {
        return <span>{info.getValue()}</span>;
      },
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.first_name,
      id: "first_name",
      sortDescFirst: false,
      cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => <span>FIRST NAME</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.last_name,
      sortDescFirst: false,
      id: "last_name",
      cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => <span>LAST NAME</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.date_of_birth,
      sortDescFirst: false,
      id: "date_of_birth",
      cell: (info: any) => (
        <span>{datePipe(info.getValue(), "MM-DD-YYYY")}</span>
      ),
      header: () => <span>DATE OF BIRTH</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row,
      sortDescFirst: false,
      id: "action",
      cell: (info: any) => (
        <span>
          <Button
            variant="outlined"
            onClick={() => {
              setPatientOpen(true);
              setPatientDetails(info?.row?.original);
              getPatientResults({
                patient_id: info?.row?.original?.patient_id,
              });
              getPatientNames({
                patient_id: info?.row?.original?.patient_id,
              });
            }}
          >
            View
          </Button>
        </span>
      ),
      header: () => <span>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];

  return (
    <div>
      <div className="navBarFiltersBlock">
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
        <DatePicker
          placeholder="Select Date of Birth"
          value={dateOfBirth ? new Date(dateOfBirth) : null}
          onChange={(newValue) => {
            onChangeDateOfBirth(newValue);
          }}
        />
        <Button
          className="bacKBtn"
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
      </div>

      {getDetails?.length ? (
        <Container maxWidth="xl">
          <SingleColumnTable
            data={getDetails}
            columns={Revenuecolumns}
            loading={false}
          />
        </Container>

      ) : (
        ""
      )}
    </div>
  );
};
export default PatientDetails;
