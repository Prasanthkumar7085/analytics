"use client"
import { Button, Card, TextField } from "@mui/material";
import { useState } from "react";
import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";

const PatientDetails = () => {

    const [getDetails, setGetDetails] = useState([
        {
            patient_id: "615234887",
            first_name: "bala",
            last_name: "vaka",
            date_of_birth: "12-2-1996"
        },
        {
            patient_id: "615234887",
            first_name: "bala",
            last_name: "vaka",
            date_of_birth: "12-2-1996"
        },
        {
            patient_id: "615234887",
            first_name: "bala",
            last_name: "vaka",
            date_of_birth: "12-2-1996"
        },
        {
            patient_id: "615234887",
            first_name: "bala",
            last_name: "vaka",
            date_of_birth: "12-2-1996"
        }
    ])

    const Revenuecolumns = [
        {
            accessorFn: (row: any) => row.patient_id,
            id: "patient_id",
            header: () => <span >PATIENT ID</span>,
            cell: (info: any) => {
                return (
                    <span>
                        {info.getValue()}
                    </span>
                );
            },
            footer: (props: any) => props.column.id,
            width: "150px",
        },
        {
            accessorFn: (row: any) => row.first_name,
            id: "first_name",
            sortDescFirst: false,
            cell: (info: any) => (
                <span>
                    {info.getValue()}
                </span>
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
                <span>
                    {info.getValue()}
                </span>
            ),
            header: () => <span>LAST NAME</span>,
            footer: (props: any) => props.column.id,
            width: "150px",
        },
        {
            accessorFn: (row: any) => row.date_of_birth,
            sortDescFirst: false,
            id: "date_of_birth",
            cell: (info: any) => (
                <span>
                    {info.getValue()}
                </span>
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
                        variant='outlined'
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
            <Card sx={{ marginTop: "30px", position: "relative" }}>
                <TextField
                    id="outlined-size-small"
                    placeholder="First Name"
                    size="small"
                    sx={{ padding: "0px 5px 0px 0px" }}
                />
                <TextField
                    id="outlined-size-small"
                    placeholder="Last Name"
                    size="small"
                    sx={{ padding: "0px 5px 0px 5px" }}
                />
                <TextField
                    id="outlined-size-small"
                    placeholder="Date of Birth"
                    size="small"
                    sx={{ padding: "0px 5px 0px 5px" }}
                />
                <Button
                    variant='outlined'
                    style={{ padding: "0px 0px 0px 5px" }}
                >
                    Get Details
                </Button>
            </Card>
            <SingleColumnTable
                data={getDetails}
                columns={Revenuecolumns}
                loading={false} />
        </div>
    );
}
export default PatientDetails;