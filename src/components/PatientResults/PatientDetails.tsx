"use client";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
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
  dateOfBirth,
  loading,
}: any) => {
  const router = useRouter();
  const params = useSearchParams();

  const onChangeDateOfBirth = (date: any) => {
    setDateOfBirth(date);
  };
  const pathName = usePathname();
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
      cell: (info: any) => (
        <span>{info.getValue() ? info.getValue() : "--"}</span>
      ),
      header: () => <span>FIRST NAME</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.last_name,
      sortDescFirst: false,
      id: "last_name",
      cell: (info: any) => (
        <span>{info.getValue() ? info.getValue() : "--"}</span>
      ),
      header: () => <span>LAST NAME</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.date_of_birth,
      sortDescFirst: false,
      id: "date_of_birth",
      cell: (info: any) => {
        return (
          <span>
            {datePipe(info.getValue() ? info.getValue() : "--", "MM-DD-YYYY")}
          </span>
        );
      },
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

  useEffect(() => {
    document.body.classList.add("navbar-type-two", "gray-bg");

    // Clean up by removing the class when the component is unmounted
    return () => {
      document.body.classList.remove("navbar-type-two", "gray-bg");
    };
  }, []);

  return (
    <section id="patientDetails">
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
            className={
              !(firstName || lastName || dateOfBirth)
                ? "btnWithDisabled"
                : "bacKBtn"
            }
            // sx={{ cursor: !(firstName || lastName || dateOfBirth) ? "not-allowed" : "pointer" }}
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
              columns={patientcolumns}
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
              <Image src="/Search Image.svg" alt="" height={210} width={410} />
              <h3 className="no-data-text">No Data</h3>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
};
export default PatientDetails;
