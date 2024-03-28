import { getAllInsurancePayorsBySalesRepIdAPI } from "@/services/salesRepsAPIs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import GraphDialog from "../core/GraphDialog";
import { Backdrop, CircularProgress } from "@mui/material";
import { addSerial } from "@/lib/Pipes/addSerial";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";

const InsurancePayors = ({ searchParams, apiurl }: any) => {
  const { id } = useParams();
  const [insuranceData, setInsuranceData] = useState([]);
  const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});
  const [loading, setLoading] = useState(true)
  const params = useSearchParams();
  const router = useRouter()
  const getAllInsrancePayors = async (fromDate: any, toDate: any) => {
    setLoading(true)
    try {

      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await getAllInsurancePayorsBySalesRepIdAPI({
        apiurl,
        id: id as string, queryParams
      });
      if (response?.status == 200 || response?.status == 201) {
        const modifieData = addSerial(response?.data, 1, response?.data?.length);
        setInsuranceData(modifieData);

        let totalAmount = 0;
        let totalPaid = 0;
        let totalPending = 0;

        response?.data?.forEach((entry: any) => {
          totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
          totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
          totalPending += entry.pending_amount ? +entry.pending_amount : 0;
        });

        const result = [{ value: "Total", dolorSymbol: false }, { value: null, dolorSymbol: false }, { value: totalAmount, dolorSymbol: true }, { value: totalPaid, dolorSymbol: true }, { value: totalPending, dolorSymbol: true }];

        setTortalInsurancePayors(result);
      }
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false)
    }
  };

  const goToSingleInsurancePage = (Id: string) => {
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

    router.push(`/insurances/${Id}${queryString}`);
  };

  const columns = [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.insurance_name,
      id: "insurance_name",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>INSURANCE NAME</span>
      ),
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return <span style={{ cursor: "pointer" }} onClick={() => {
          goToSingleInsurancePage(info.row.original.insurance_id)
        }}>{info.getValue()}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.generated_amount,
      id: "generated_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>BILLED</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return <span>{formatMoney(getValue())}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.paid_amount,
      id: "paid_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>RECEIVED</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return <span>{formatMoney(getValue())}</span>;
      },
    },
    {
      accessorFn: (row: any) => row.pending_amount,
      id: "pending_amount",
      header: () => <span style={{ whiteSpace: "nowrap" }}>ARREARS</span>,
      footer: (props: any) => props.column.id,
      width: "70px",
      maxWidth: "100px",
      minWidth: "70px",
      cell: ({ getValue }: any) => {
        return <span>{formatMoney(getValue())}</span>;
      },
    },
    // {
    //   accessorFn: (row: any) => row,
    //   id: "graph",
    //   header: () => <span style={{ whiteSpace: "nowrap" }}>GRAPH</span>,
    //   footer: (props: any) => props.column.id,
    //   width: "100px",
    //   maxWidth: "100px",
    //   minWidth: "100px",
    //   cell: (info: any) => {

    //     const dataPoints = Object.entries(info.row.original)
    //       .filter(([key]) => key !== 'caseType')
    //       .map(([month, value]) => [month, value]);
    //     return (
    //       <div onClick={() => {
    //         // setGraphDialogOpen(true);
    //         // setSelectedGraphData(info.row.original);
    //       }}>
    //         <AreaGraph getValue={info.getValue} />
    //       </div>
    //     )
    //   },
    // },
  ]

  useEffect(() => {
    getAllInsrancePayors(searchParams?.from_date, searchParams?.to_date);
  }, [searchParams]);

  return (
    <div style={{ position: "relative" }}>
      <SingleColumnTable
        data={insuranceData}
        columns={columns}
        totalSumValues={totalInsurancePayors}
        loading={loading}
      />
      {/* <GraphDialog
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}

      /> */}


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

// "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
export default InsurancePayors;
