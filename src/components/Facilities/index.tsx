import { useEffect, useMemo, useState } from "react";
import TanStackTableComponent from "../core/Table/SingleColumn/SingleColumnTable";
import { useSelector } from "react-redux";
import { facilitiesAPI } from "@/services/facilitiesAPIs";
import {
  mapFacilityNameWithId,
  mapSalesRepNameWithId,
} from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { Button } from "@mui/material";
import MultipleColumnsTable from "../core/Table/MultitpleColumn/MultipleColumnsTable";
import { useRouter } from "next/navigation";

const FacilitiesList = () => {

  const router = useRouter();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const facilities = useSelector((state: any) => state?.users.facilities);

  //get the list of Facilities
  const getFacilitiesList = async () => {
    try {
      const response = await facilitiesAPI();
      if (response?.status == 200 || response.status == 201) {
        let mappedData = response?.combinedData?.map((item: any) => {
          return {
            ...item,
            facility_name: mapFacilityNameWithId(item?.hospital),
            marketer_name: mapSalesRepNameWithId(item?.marketer_id),
          };
        });

        setFacilitiesData(mappedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columnDef = useMemo(
    () => [
      {
        accessorFn: (row: any) => row.facility_name,
        id: "facility_name",
        header: () => (
          <span style={{ whiteSpace: "nowrap" }}>FACILITY NAME</span>
        ),
        footer: (props: any) => props.column.id,
        width: "220px",
        maxWidth: "220px",
        minWidth: "220px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row.marketer_name,
        id: "marketer_name",
        header: () => <span style={{ whiteSpace: "nowrap" }}>SALES REP</span>,
        footer: (props: any) => props.column.id,
        width: "220px",
        maxWidth: "220px",
        minWidth: "220px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row.total_cases,
        id: "total_cases",
        header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL CASES</span>,
        footer: (props: any) => props.column.id,
        width: "200px",
        maxWidth: "200px",
        minWidth: "200px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row._id,
        header: () => <span style={{ whiteSpace: "nowrap" }}>REVENUE</span>,
        id: "revenue",
        width: "800px",
        columns: [
          {
            accessorFn: (row: any) => row.total_amount,
            id: "total_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
            },
          },
          {
            accessorFn: (row: any) => row.paid_amount,
            header: () => (
              <span style={{ whiteSpace: "nowrap" }}>RECEIVED</span>
            ),
            id: "paid_amount",
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
            },
          },
          {
            accessorFn: (row: any) => row.pending_amount,
            header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
            id: "pending_amount",
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            Cell: ({ getValue }: any) => {
              return <span>{getValue()}</span>;
            },
          },
        ],
      },
      {
        accessorFn: (row: any) => row.actions,
        id: "Actions",
        header: () => <span style={{ whiteSpace: "nowrap" }}>Actions</span>,
        footer: (props: any) => props.column.id,
        width: "200px",
        maxWidth: "200px",
        minWidth: "200px",
        cell: (info: any) => {
          return (
            <span>
              <Button onClick={() => router.push(`/facilities/${info.row.original.hospital}`)}>View</Button>
            </span>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    getFacilitiesList();
  }, []);
  return (
    <div>
      <MultipleColumnsTable
        data={facilitiesData}
        columns={columnDef}
        loading={false}
      />
    </div>
  );
};
export default FacilitiesList;