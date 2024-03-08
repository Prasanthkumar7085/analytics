import { setAllFacilities } from "@/Redux/Modules/marketers";
import MultipleColumnsTable from "@/components/core/Table/MultitpleColumn/MultipleColumnsTable";
import TanStackTableComponent from "@/components/core/Table/SingleColumn/SingleColumnTable";
import { mapFacilityNameWithId } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { getAllFacilitiesAPI } from "@/services/authAPIs";
import { getFacilitiesBySalesRepId } from "@/services/salesRepsAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Facilities = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const facilities = useSelector((state: any) => state?.users.facilities);

  const getFacilitiesFromLabsquire = async () => {
    try {
      const facilitiesData = await getAllFacilitiesAPI();
      if (facilitiesData?.status == 201 || facilitiesData?.status == 200) {
        dispatch(setAllFacilities(facilitiesData?.data));
      }
      const response = await getFacilitiesBySalesRepId({ id: id as string });
    } catch (err) {
      console.error(err);
    }
  };
  const getSalesRepFacilities = async () => {
    try {
      const response = await getFacilitiesBySalesRepId({ id: id as string });
      if (response?.status == 200 || response.status == 201) {
        let mappedData = response?.combinedArray?.map(
          (item: { hospital: string }) => {
            return {
              ...item,
              facility_name: mapFacilityNameWithId(item?.hospital),
            };
          }
        );

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
    ],
    []
  );
  useEffect(() => {
    if (!facilities?.length) {
      getFacilitiesFromLabsquire();
    }
    getSalesRepFacilities();
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

export default Facilities;
