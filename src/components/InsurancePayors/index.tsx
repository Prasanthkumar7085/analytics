import { getAllInsurancePayorsBySalesRepIdAPI } from "@/services/salesRepsAPIs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import TanStackTableComponent from "../core/Table/Table";
import Highcharts from "highcharts";

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
          return <AreaGraphForInsurancePayors getValue={getValue} />;
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
      <TanStackTableComponent
        data={insuranceData}
        columns={columns}
        totalSumValues={totalInsurancePayors}
        loading={false}
        getData={() => {}}
      />
    </div>
  );
};

// "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
export default InsurancePayors;

const AreaGraphForInsurancePayors = ({ getValue }: any) => {
  const chartRef = useRef(null);
  const trendsData = {
    "January 2024": {
      revenue: 35,
    },
    "February 2024": {
      revenue: 26,
    },
    "March 2024": {
      revenue: 0,
    },
    "April 2024": {
      revenue: 0,
    },
    "May 2024": {
      revenue: 0,
    },
    "June 2024": {
      revenue: 0,
    },
    "July 2024": {
      revenue: 0,
    },
    "August 2024": {
      revenue: 0,
    },
    "September 2024": {
      revenue: 0,
    },
    "October 2024": {
      revenue: 0,
    },
    "November 2024": {
      revenue: 0,
    },
    "December 2024": {
      revenue: 0,
    },
  };

  useEffect(() => {
    if (chartRef && chartRef.current) {
      // Custom entrance animation for the chart
      Highcharts.chart(chartRef.current, {
        chart: {
          height: 50,
          width: 100,
          type: "area",
          animation: {
            duration: 1000, // Set the animation duration
            easing: "easeOutBounce", // Set the easing function for a smoother animation
          },
        },

        title: {
          text: null, // Remove title
        },
        xAxis: {
          labels: {
            enabled: false, // Disable xAxis labels
          },
          title: {
            text: null, // Remove xAxis title
          },
          visible: false, // Hide xAxis
        },
        yAxis: {
          labels: {
            enabled: false, // Disable yAxis labels
          },
          title: {
            text: null, // Remove yAxis title
          },
          visible: false, // Hide yAxis
        },
        legend: {
          enabled: false, // Hide legend
        },
        credits: {
          enabled: false, // Hide credits
        },
        plotOptions: {
          series: {
            animation: {
              enabled: false, // Disable animation
            },
          },
          marker: {
            enabled: false, // Disable markers
          },
          tooltip: {
            enabled: false, // Disable tooltip
          },
        },

        series: [
          {
            name: null,
            data: Object.values(trendsData).map((item: any) => item.revenue),
            animation: {
              opacity: 1, // Set opacity animation for smoother entrance
            },
          },
        ],
      } as any);
    }
  }, [trendsData]);

  return <div ref={chartRef}></div>;
};
