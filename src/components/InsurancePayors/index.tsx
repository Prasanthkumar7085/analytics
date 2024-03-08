import { getAllInsurancePayorsBySalesRepIdAPI } from "@/services/salesRepsAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import SingleColumnTable from "../core/Table/SingleColumn/SingleColumnTable";
import { AreaGraph } from "../core/AreaGraph";

const InsurancePayors = () => {
  const { id } = useParams();
  const [insuranceData, setInsuranceData] = useState([]);
  const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);

  const getAllInsrancePayors = async () => {
    try {
      const response = await getAllInsurancePayorsBySalesRepIdAPI({
        id: id as string,
      });
      if (response?.status == 200 || response?.status == 201) {
        setInsuranceData(response?.data);
        console.log(response, "asdfasdf");

        let totalAmount = 0;
        let totalPaid = 0;
        let totalPending = 0;

        response?.data?.forEach((entry: any) => {
          totalAmount += entry.total_amount ? +entry.total_amount : 0;
          totalPaid += entry.total_paid ? +entry.total_paid : 0;
          totalPending += entry.total_pending ? +entry.total_pending : 0;
        });

        const result = ["Total", totalAmount, totalPaid, totalPending, ""];
        console.log(result, "asdfasdf");

        setTortalInsurancePayors(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row: any) => row.name,
        id: "name",
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
        accessorFn: (row: any) => row.total_amount,
        id: "total_amount",
        header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
        footer: (props: any) => props.column.id,
        width: "100px",
        maxWidth: "100px",
        minWidth: "100px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row.total_paid,
        id: "total_paid",
        header: () => <span style={{ whiteSpace: "nowrap" }}>PAID</span>,
        footer: (props: any) => props.column.id,
        width: "100px",
        maxWidth: "100px",
        minWidth: "100px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
        },
      },
      {
        accessorFn: (row: any) => row.total_pending,
        id: "total_pending",
        header: () => <span style={{ whiteSpace: "nowrap" }}>PENDING</span>,
        footer: (props: any) => props.column.id,
        width: "100px",
        maxWidth: "100px",
        minWidth: "100px",
        cell: ({ getValue }: any) => {
          return <span>{getValue()}</span>;
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
        cell: ({ getValue }: any) => {
          return <AreaGraph getValue={getValue} />;
        },
      },
    ],
    []
  );

  useEffect(() => {
    getAllInsrancePayors();
  }, []);
  return (
    <div style={{ overflow: "auto" }}>
      <SingleColumnTable
        data={insuranceData}
        columns={columns}
        totalSumValues={totalInsurancePayors}
        loading={false}
      />
    </div>
  );
};

// "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
export default InsurancePayors;
