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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FacilitiesFilters from "./FacilitiesFilters";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import LoadingComponent from "../core/LoadingComponent";

const FacilitiesList = () => {
  const router = useRouter();
  const [facilitiesData, setFacilitiesData] = useState([]);
  const pathname = usePathname();
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [totalSumValues, setTotalSumValues] = useState<(string | number)[]>([]);
  const [completeData, setCompleteData] = useState([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

  //get the list of Facilities
  const getFacilitiesList = async ({ fromDate, toDate }: any) => {
    setLoading(true)
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }
      let searchValue = params.get("search");
      if (searchValue) {
        queryParams["search"] = searchValue;
      }
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const { search, ...updatedQueyParams } = queryParams;

      const response = await facilitiesAPI(updatedQueyParams);
      if (response?.status == 200 || response.status == 201) {
        setFacilitiesData(response?.data)
        setCompleteData(response?.data);
        onUpdateData({ queryData: queryParams }, response?.data);
        const totalCases = response?.data.reduce(
          (sum: any, item: any) => sum + +item.total_cases,
          0
        );
        const billedAmoumnt = response?.data.reduce(
          (sum: any, item: any) => sum + +item.generated_amount,
          0
        );
        const paidRevenueSum = response?.data.reduce(
          (sum: any, item: any) => sum + +item.paid_amount,
          0
        );
        const pendingAmoumnt = response?.data.reduce(
          (sum: any, item: any) => sum + +item.pending_amount,
          0
        );

        const result = [
          "Total",
          null,
          totalCases,
          billedAmoumnt,
          paidRevenueSum,
          pendingAmoumnt,
        ];
        setTotalSumValues(result);

      }
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false)
    }
  };


  const goToSingleRepPage = (Id: string) => {

    let queryString = '';
    const queryParams: any = {}
    if (params.get('from_date')) {
      queryParams['from_date'] = params.get('from_date')
    }
    if (params.get('to_date')) {
      queryParams['to_date'] = params.get('to_date')
    }
    if (Object.keys(queryParams)?.length) {
      queryString = prepareURLEncodedParams('', queryParams)
    }

    router.push(
      `/facilities/${1}${queryString}`
    );

  }

  const columnDef = [
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
      accessorFn: (row: any) => row.sales_rep,
      id: "sales_rep",
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
          accessorFn: (row: any) => row.generated_amount,
          id: "generated_amount",
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
            <Button
              className="actionButton"
              onClick={() => goToSingleRepPage(info.row.original._id)}

            >
              View
            </Button>
          </span>
        );
      },
    },
  ]


  const onUpdateData = (
    {
      search = params.get("search") as string,
      queryData,
    }: Partial<{
      search: string;
      queryData?: any;
    }>,
    testData?: any[]
  ) => {
    let queryParams: any = {};

    if (queryData) {
      queryParams = { ...queryData };
    } else {
      if (search) {
        queryParams["search"] = search;
      }
      if (params.get("from_date")) {
        queryParams["from_date"] = params.get("from_date");
      }
      if (params.get("to_date")) {
        queryParams["to_date"] = params.get("to_date");
      }
    }

    let data: any = [...completeData];
    if (!completeData?.length) {
      if (testData?.length) {
        data = [...testData];
      } else return;
    }

    if (search) {
      data = data.filter((item: any) =>
        item.facility_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase()?.trim())
      );
    }
    router.push(`${prepareURLEncodedParams(pathname, queryParams)}`);

    setFacilitiesData(data);

    const totalCases = data.reduce(
      (sum: any, item: any) => sum + +item.total_cases,
      0
    );
    const targeted_amount = data.reduce(
      (sum: any, item: any) => sum + +item.expected_amount,
      0
    );

    const billedAmoumnt = data.reduce(
      (sum: any, item: any) => sum + +item.generated_amount,
      0
    );
    const paidRevenueSum = data.reduce(
      (sum: any, item: any) => sum + +item.paid_amount,
      0
    );
    const pendingAmoumnt = data.reduce(
      (sum: any, item: any) => sum + +item.pending_amount,
      0
    );

    const result = [
      "Total",
      null,
      totalCases,
      billedAmoumnt,
      paidRevenueSum,
      pendingAmoumnt,
    ];

    setTotalSumValues(result);
  };

  useEffect(() => {
    getFacilitiesList({ fromDate: searchParams?.from_date, toDate: searchParams?.to_date });
    if (searchParams?.from_date) {
      setDateFilterDefaultValue([new Date(searchParams?.from_date), new Date(searchParams?.to_date)])
    }
  }, []);


  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div >
      <FacilitiesFilters
        onUpdateData={onUpdateData}
        getFacilitiesList={getFacilitiesList}
        dateFilterDefaultValue={dateFilterDefaultValue}
        setDateFilterDefaultValue={setDateFilterDefaultValue}
      />
      <MultipleColumnsTable
        data={facilitiesData}
        columns={columnDef}
        loading={loading}
        totalSumValues={totalSumValues}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default FacilitiesList;
