import MultipleColumnsTable from "@/components/core/Table/MultitpleColumn/MultipleColumnsTable";
import { addSerial } from "@/lib/Pipes/addSerial";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getRevenueDetailsOfFacilitiesBySalesRepIdAPI, getVolumeDetailsOfFacilitiesBySalesRepIdAPI } from "@/services/salesRepsAPIs";
import { Backdrop } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Facilities = ({ searchParams, tabValue }: any) => {
  const dispatch = useDispatch();
  const params = useSearchParams();
  const router = useRouter()
  const { id } = useParams();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [totalSumFacilityValues, setTotalSumFacilityValues] = useState<any>([]);
  const [loading, setLoading] = useState(true)


  //query preparation method
  const queryPreparations = async (fromDate: any, toDate: any) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    try {
      if (tabValue == "Revenue") {
        await getRevenueDetailsSalesRepFacilities(queryParams)
      }
      else {
        await getVolumeDetailsSalesRepFacilities(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  //get the volume stats for facilities 
  const getVolumeDetailsSalesRepFacilities = async (queryParams: any) => {
    try {
      setLoading(true)
      const response = await getVolumeDetailsOfFacilitiesBySalesRepIdAPI({ id: id as string, queryParams });
      if (response?.status == 200 || response.status == 201) {
        let totalCases = 0;
        let completedCases = 0;
        let pendingCases = 0;

        response?.data?.forEach((entry: any) => {
          totalCases += entry.total_cases ? +entry.total_cases : 0;
          completedCases += entry.completed_cases ? +entry.completed_cases : 0;
          pendingCases += entry.pending_cases ? +entry.pending_cases : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalCases, dolorSymbol: false },
          { value: completedCases, dolorSymbol: false },
          { value: pendingCases, dolorSymbol: false },
        ];
        setTotalSumFacilityValues(result);
        const modifieData = addSerial(response?.data, 1, response?.data?.length);
        setFacilitiesData(modifieData);
      }
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false)
    }
  };

  //get the revenue stats for facilities 
  const getRevenueDetailsSalesRepFacilities = async (queryParams: any) => {
    try {
      setLoading(true)
      const response = await getRevenueDetailsOfFacilitiesBySalesRepIdAPI({ id: id as string, queryParams });
      if (response?.status == 200 || response.status == 201) {
        let totalCases = 0;
        let totalAmount = 0;
        let totalPaid = 0;
        let totalPending = 0;

        response?.data?.forEach((entry: any) => {
          totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
          totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
          totalPending += entry.pending_amount ? +entry.pending_amount : 0;
        });

        const result = [
          { value: "Total", dolorSymbol: false },
          { value: null, dolorSymbol: false },
          { value: totalAmount, dolorSymbol: true },
          { value: totalPaid, dolorSymbol: true },
          { value: totalPending, dolorSymbol: true },
        ];
        setTotalSumFacilityValues(result);
        const modifieData = addSerial(response?.data, 1, response?.data?.length);
        setFacilitiesData(modifieData);
      }
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false)
    }
  };


  //go to single facility page after clicking the name of the facility in table
  const goToSingleFacilityPage = (Id: string) => {
    let queryString = "";
    const queryParams: any = {};
    if (params.get("from_date")) {
      queryParams["from_date"] = params.get("from_date");
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date");
    }
    if (Object.keys(queryParams)?.length) {
      queryString = prepareURLEncodedParams("", queryParams);
    }

    router.push(`/facilities/${Id}${queryString}`);
  };


  //coloumns for the revenue table
  const RevenuecolumnDef = [
    {
      accessorFn: (row: any) => row.serial,
      enableSorting: false,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
      cell: ({ row, table }: any) =>
        (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) + 1,

    },
    {
      accessorFn: (row: any) => row.facility_name,
      id: "facility_name",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }} >FACILITY NAME</span>
      ),
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span style={{ cursor: "pointer" }} onClick={() => {
          goToSingleFacilityPage(info.row.original.facility_id)
        }}>{info.getValue()}</span>;
      },
    },


    {
      accessorFn: (row: any) => row.generated_amount,
      id: "generated_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      sortDescFirst: false,
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
      sortDescFirst: false,
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
      sortDescFirst: false,
      cell: ({ getValue }: any) => {
        return <span>{formatMoney(getValue())}</span>;
      },
    },

  ]

  //coloumns for the volume table

  const VolumecolumnDef = [
    {
      accessorFn: (row: any) => row.serial,
      enableSorting: false,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
      cell: ({ row, table }: any) =>
        (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) + 1,

    },
    {
      accessorFn: (row: any) => row.facility_name,
      id: "facility_name",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }} >FACILITY NAME</span>
      ),
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span style={{ cursor: "pointer" }} onClick={() => {
          goToSingleFacilityPage(info.row.original.facility_id)
        }}>{info.getValue()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.total_cases,
      id: "total_cases",
      header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
      footer: (props: any) => props.column.id,
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      sortDescFirst: false,
      cell: ({ getValue }: any) => {
        return <span>{getValue()?.toLocaleString()}</span>;
      },
    },

    {
      accessorFn: (row: any) => row.completed_cases,
      id: "completed_cases",
      header: () => <span style={{ whiteSpace: "nowrap" }}>FINALISED</span>,
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      sortDescFirst: false,
      cell: ({ getValue }: any) => {
        return <span>{getValue()?.toLocaleString()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.pending_cases,
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>PENDING</span>
      ),
      id: "pending_cases",
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      sortDescFirst: false,
      cell: ({ getValue }: any) => {
        return <span>{getValue()?.toLocaleString()}</span>;
      },
    },
  ]

  useEffect(() => {
    queryPreparations(searchParams?.from_date, searchParams?.to_date);
  }, [searchParams, tabValue]);


  return (
    <div style={{ position: "relative" }}>
      <MultipleColumnsTable
        data={facilitiesData}
        columns={tabValue == "Revenue" ? RevenuecolumnDef : VolumecolumnDef}
        loading={loading}
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
          <object
            type="image/svg+xml"
            data={"/core/loading.svg"}
            width={150}
            height={150}
          />
        </Backdrop>
      ) : (
        ""
      )}
    </div>
  );
};

export default Facilities;
