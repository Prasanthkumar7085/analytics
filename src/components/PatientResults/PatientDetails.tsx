"use client";
import { Button, TextField } from "@mui/material";
import Container from "@mui/material/Container";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import datePipe from "@/lib/Pipes/datePipe";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";

const PatientDetails = ({
  getDetails,
  getPatientDetails,
  setFirstName,
  firstName,
  setLastName,
  lastName,
  setDateOfBirth,
  dateOfBirth
}: any) => {
  const router = useRouter();
  const params = useSearchParams();

  const onChangeDateOfBirth = (date: any) => {
    setDateOfBirth(date);
  };

  let dateFormat = datePipe(dateOfBirth, "YYYY-MM-DD");

  const patientcolumns = [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      enableSorting: false,
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      cell: ({ row, table }: any) =>
        (table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
        1,
    },
    {
      accessorFn: (row: any) => row.patient_id,
      id: "patient_id",
      header: () => <span>PATIENT ID</span>,
      cell: (info: any) => {
        return <span>{info.getValue() ? info.getValue() : "--"}</span>;
      },
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.first_name,
      id: "first_name",
      sortDescFirst: false,
      cell: (info: any) => <span>{info.getValue() ? info.getValue() : "--"}</span>,
      header: () => <span>FIRST NAME</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.last_name,
      sortDescFirst: false,
      id: "last_name",
      cell: (info: any) => <span>{info.getValue() ? info.getValue() : "--"}</span>,
      header: () => <span>LAST NAME</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.date_of_birth,
      sortDescFirst: false,
      id: "date_of_birth",
      cell: (info: any) => (
        <span>{datePipe(info.getValue() ? info.getValue() : "--", "MM-DD-YYYY")}</span>
      ),
      header: () => <span>DATE OF BIRTH</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row,
      sortDescFirst: false,
      id: "actions",
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
      <div className="subNavBar">
        <div className="SubNavPointsBlock">
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
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
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
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
      </div>
      <h4>Patient Details</h4>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {getDetails?.length ? (
          <Container maxWidth="xl">
            <SingleColumnTable
              data={getDetails}
              columns={patientcolumns}
              loading={false}
            />
          </Container>

        ) : (
          <div style={{ display: "flex", alignItems: 'center', justifyContent: "center", flexDirection: "column" }}>
            <Image
              src="/Search Image.svg"
              alt=""
              height={210}
              width={510}
            />
            <h3>No Data</h3>
          </div>
        )}
      </div>
    </div>
  );
};
export default PatientDetails;
