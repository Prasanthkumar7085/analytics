import datePipe from "@/lib/Pipes/datePipe";
import { Button } from "@mui/material";

export const ToxiPatientDetailsColumns = ({
  router,
  setPatientsDetailsDialog,
}: any) => {
  return [
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
      accessorFn: (row: any) => row.dob,
      sortDescFirst: false,
      id: "dob",
      cell: (info: any) => {
        return (
          <span>
            {info.getValue() ? datePipe(info.getValue(), "MM-DD-YYYY") : "--"}
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
          <Button className="viewBtn"
            variant="outlined"
            onClick={() => {
              setPatientsDetailsDialog(false);
              router.push(
                `/toxicology-results/${info?.row?.original?.patient_id}`
              );
            }}
          >
            View Details
          </Button>
        </span>
      ),
      header: () => <span>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];
};
