"use client";
import datePipe from "@/lib/Pipes/datePipe";
import { Button, TextField } from "@mui/material";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import Image from "next/image";


const PatientDetails = ({
  getDetails,
  getPatientDetails,
}: any) => {
  const router = useRouter();

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
              router.push(`/patient-results/${info?.row?.original?._id}`);
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
      <div className="navBarFiltersBlock" style={{ display: "flex", justifyContent: "center" }}>
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
          disabled={!(firstName && lastName && dateOfBirth)}
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        {getDetails?.length ? (
          <Container maxWidth="xl">
            <SingleColumnTable
              data={getDetails}
              columns={Revenuecolumns}
              loading={false}
            />
          </Container>

        ) : (
          <Image
            style={{ display: "flex" }}
            src="/Search Image.svg"
            alt=""
            height={210}
            width={510}
          />
        )}
      </div>
    </div>
  );
};
export default PatientDetails;
