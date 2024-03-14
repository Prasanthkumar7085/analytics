import { getAllInsurancePayorsBySalesRepIdAPI } from "@/services/salesRepsAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import { AreaGraph } from "../core/AreaGraph";
import formatMoney from "@/lib/Pipes/moneyFormat";
import GraphDialog from "../core/GraphDialog";

const InsurancePayors = () => {
  const { id } = useParams();
  const [insuranceData, setInsuranceData] = useState([]);
  const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);
  const [graphDialogOpen, setGraphDialogOpen] = useState<boolean>(false);
  const [selectedGrpahData, setSelectedGraphData] = useState<any>({});

  const getAllInsrancePayors = async () => {
    try {
      const response = await getAllInsurancePayorsBySalesRepIdAPI({
        id: id as string,
      });
      if (response?.status == 200 || response?.status == 201) {
        setInsuranceData(response?.data);

        let totalAmount = 0;
        let totalPaid = 0;
        let totalPending = 0;

        response?.data?.forEach((entry: any) => {
          totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
          totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
          totalPending += entry.pending_amount ? +entry.pending_amount : 0;
        });

        const result = ["Total", totalAmount, totalPaid, totalPending, ""];

        setTortalInsurancePayors(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = useMemo(
    () => [
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
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row.generated_amount,
        id: "generated_amount",
        header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
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
        header: () => <span style={{ whiteSpace: "nowrap" }}>PAID</span>,
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
        header: () => <span style={{ whiteSpace: "nowrap" }}>PENDING</span>,
        footer: (props: any) => props.column.id,
        width: "70px",
        maxWidth: "100px",
        minWidth: "70px",
        cell: ({ getValue }: any) => {
          return <span>{formatMoney(getValue())}</span>;
        },
      },
      {
        accessorFn: (row: any) => row,
        id: "graph",
        header: () => <span style={{ whiteSpace: "nowrap" }}>GRAPH</span>,
        footer: (props: any) => props.column.id,
        width: "100px",
        maxWidth: "100px",
        minWidth: "100px",
        cell: (info: any) => {

          const dataPoints = Object.entries(info.row.original)
            .filter(([key]) => key !== 'caseType')
            .map(([month, value]) => [month, value]);
          return (
            <div onClick={() => {
              // setGraphDialogOpen(true);
              // setSelectedGraphData(info.row.original);
            }}>
              <AreaGraph getValue={info.getValue} />
            </div>
          )
        },
      },
    ],
    []
  );

  useEffect(() => {
    getAllInsrancePayors();
  }, []);
  return (
    <div>
      <SingleColumnTable
        data={insuranceData}
        columns={columns}
        totalSumValues={totalInsurancePayors}
        loading={false}
      />
      <GraphDialog
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphData={selectedGrpahData}

      />
    </div>
  );
};

// "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
export default InsurancePayors;
