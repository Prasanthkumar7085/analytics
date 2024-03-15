import { setAllFacilities } from "@/Redux/Modules/marketers";
import MultipleColumnsTable from "@/components/core/Table/MultitpleColumn/MultipleColumnsTable";
import TanStackTableComponent from "@/components/core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { mapFacilityNameWithId } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { getAllFacilitiesAPI } from "@/services/authAPIs";
import { getFacilitiesBySalesRepId } from "@/services/salesRepsAPIs";
import { Backdrop, CircularProgress } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Facilities = ({ searchParams }: any) => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const facilities = useSelector((state: any) => state?.users.facilities);
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [totalSumFacilityValues, setTotalSumFacilityValues] = useState<
    (string | number)[]
  >([]);
  const [loading, setLoading] = useState(true)


  const getSalesRepFacilities = async (fromDate: any, toDate: any) => {
    try {
      setLoading(true)
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await getFacilitiesBySalesRepId({ id: id as string, queryParams });
      if (response?.status == 200 || response.status == 201) {
        let totalCases = 0;
        let totalAmount = 0;
        let totalPaid = 0;
        let totalPending = 0;

        response?.data?.forEach((entry: any) => {
          totalCases += entry.total_cases ? +entry.total_cases : 0;
          totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
          totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
          totalPending += entry.pending_amount ? +entry.pending_amount : 0;
        });

        const result = [
          "Total",
          totalCases,
          totalAmount,
          totalPaid,
          totalPending,
          "",
        ];
        setTotalSumFacilityValues(result);



        setFacilitiesData(response?.data);
      }
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false)
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
            accessorFn: (row: any) => row.generated_amount,
            id: "generated_amount",
            header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            cell: ({ getValue }: any) => {
              return <span>{formatMoney(getValue())}</span>;
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
            cell: ({ getValue }: any) => {
              return <span>{formatMoney(getValue())}</span>;
            },
          },
          {
            accessorFn: (row: any) => row.pending_amount,
            header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
            id: "pending_amount",
            width: "200px",
            maxWidth: "200px",
            minWidth: "200px",
            cell: ({ getValue }: any) => {
              return <span>{formatMoney(getValue())}</span>;
            },
          },
        ],
      },
    ],
    []
  );
  useEffect(() => {
    getSalesRepFacilities(searchParams?.from_date, searchParams?.to_date);
  }, [searchParams]);
  return (
    <div style={{ position: "relative" }}>
      <MultipleColumnsTable
        data={facilitiesData}
        columns={columnDef}
        loading={false}
        totalSumValues={totalSumFacilityValues}
      />

      {loading ? (
        <Backdrop
          open={true}
          style={{
            zIndex: 999,
            color: "red",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(256,256,256,0.8)",
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ""
      )}
    </div>
  );
};

export default Facilities;
