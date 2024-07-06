import { gotoSingleFacilityPage } from "@/lib/helpers/navigations";

export const singleCasetypeColumns = (searchParams: any, router: any) => {
  return [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      enableSorting: false,
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
      cell: (info: any) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          {info.row.original.serial}
        </span>
      ),
    },

    {
      accessorFn: (row: any) => row.facility_name,
      id: "facility_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>FACILITY NAME</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              gotoSingleFacilityPage(
                info.row.original.facility_id,
                searchParams,
                router
              );
            }}
          >
            {info.row.original.facility_name}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.sales_rep_name,
      id: "sales_rep_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>MARKETER</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              gotoSingleFacilityPage(
                info.row.original.facility_id,
                searchParams,
                router
              );
            }}
          >
            {info.row.original.sales_rep_name}
          </span>
        );
      },
    },
  ];
};
