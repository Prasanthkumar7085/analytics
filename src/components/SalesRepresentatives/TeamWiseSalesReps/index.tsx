import LoadingComponent from "@/components/core/LoadingComponent";
import TeamWiseSalesRepsTanStackTable from "@/components/core/Table/TeamWiseSalesRepsTanStack";
import { addSerial } from "@/lib/Pipes/addSerial";
import { sortAndGetData } from "@/lib/Pipes/sortAndGetData";
import {
  changeDateToUTC,
  formatTeamWiseSalesRepsData,
} from "@/lib/helpers/apiHelpers";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getTeamWiseSalesRepsAPI } from "@/services/salesRepsAPIs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SalesRepsFilters from "../SalesRepsFilters";

const TeamWiseSalesReps = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [totalSumValues, setTotalSumValues] = useState<any>([]);
  const [completeData, setCompleteData] = useState([]);
  const [teamWiseSalesRepsData, setTeamWiseSalesRepsData] = useState<any>([]);
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();

  //query preparation method
  const queryPreparations = async ({
    fromDate,
    toDate,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
    status = searchParams?.status,
    teamwise = searchParams?.status || true,
    general_sales_reps_exclude_count = searchParams?.general_sales_reps_exclude_count,
  }: any) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (searchValue) {
      queryParams["search"] = searchValue;
    }
    if (orderBy) {
      queryParams["order_by"] = orderBy;
    }
    if (orderType) {
      queryParams["order_type"] = orderType;
    }
    if (status) {
      queryParams["status"] = status;
    }
    if (teamwise) {
      queryParams["teamwise"] = teamwise;
    }
    if (general_sales_reps_exclude_count) {
      queryParams["general_sales_reps_exclude_count"] =
        general_sales_reps_exclude_count;
    }

    try {
      await getAllTeamWiseSalesReps(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllTeamWiseSalesReps = async (queryParams: any) => {
    setLoading(true);
    try {
      let { search, status, ...remaining } = queryParams;
      let queryString = prepareURLEncodedParams("", queryParams);
      router.push(`${pathname}${queryString}`);

      const response: any = await getTeamWiseSalesRepsAPI(remaining);
      if (response.status == 200 || response.status == 201) {
        let teamData = response?.data.filter(
          (item: any, index: any) => item.team?.length
        );
        let data = formatTeamWiseSalesRepsData(teamData);
        setCompleteData(data);

        if (queryParams.search) {
          data = filterByName(search, data);
        }
        if (queryParams.status) {
          data = data.filter(
            (item: any) => `${item.target_reached}` == `${queryParams.status}`
          );
        }
        data = sortAndGetData(
          data,
          queryParams.order_by,
          queryParams.order_type
        );
        const modifieData = addSerial(data, 1, data?.length);
        setTeamWiseSalesRepsData(modifieData);
        setFooterValuData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter based on salesrepname
  const filterByName = (name: string, data: any) => {
    const results: any = [];
    data.forEach((item: any) => {
      if (
        item.sales_rep_name
          .toLowerCase()
          .includes(name.toLowerCase()?.trim()) &&
        name.toLowerCase()?.trim()?.includes("team")
      ) {
        results.push(item);
      } else {
        const teamMember = item.team?.find((member: any) =>
          member.sales_rep_name
            .toLowerCase()
            .includes(name.toLowerCase()?.trim())
        );
        if (teamMember) {
          results.push({
            ...item,
            team: [teamMember],
          });
        }
      }
    });

    return results;
  };

  const onUpdateData = ({
    search = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type as "asc" | "desc",
    status = searchParams?.status,
    general_sales_reps_exclude_count = searchParams?.general_sales_reps_exclude_count,
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
    status: string;
    general_sales_reps_exclude_count: any;
  }>) => {
    let queryParams: any = {};
    if (search) {
      queryParams["search"] = search;
    }
    if (orderBy) {
      queryParams["order_by"] = orderBy;
    }
    if (orderType) {
      queryParams["order_type"] = orderType;
    }
    if (status) {
      queryParams["status"] = status;
    }
    if (params.get("from_date")) {
      queryParams["from_date"] = params.get("from_date");
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date");
    }
    if (general_sales_reps_exclude_count) {
      queryParams["general_sales_reps_exclude_count"] =
        general_sales_reps_exclude_count;
    }
    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let data = [...completeData];

    if (orderBy && orderType) {
      data = sortAndGetData(data, orderBy, orderType);

      if (search) {
        data = filterByName(search, data);
      }
      if (status) {
        data = data.filter(
          (item: any) => `${item.target_reached}` == `${status}`
        );
      }
    } else {
      data = [...completeData];
      if (search) {
        data = filterByName(search, data);
      }
      if (status) {
        data = data.filter(
          (item: any) => `${item.target_reached}` == `${status}`
        );
      }
    }
    const modifieData = addSerial(data, 1, data?.length);
    setTeamWiseSalesRepsData(modifieData);
    setFooterValuData(data);
  };

  const columnDef = [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      cell: (info: any) => {
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            {info.row.original.team?.length ? <ExpandMoreIcon /> : ""}
            <p>{info.row.original.serial}</p>
          </span>
        );
      },
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.sales_rep_name,
      id: "sales_rep_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span style={{ cursor: "pointer" }}>
            {info.row.original.sales_rep_name.toUpperCase()}
          </span>
        );
      },
    },
    {
      accessorFn: (row: any) => row.role_id,
      id: "role_id",
      header: () => <span style={{ whiteSpace: "nowrap" }}>USER TYPE</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span style={{ cursor: "pointer" }}>
            {info.row.original.role_id == 1
              ? "Territory Manager"
              : info.row.original.role_id == 2
              ? "Regional Director"
              : "Sales Director"}
          </span>
        );
      },
    },

    {
      accessorFn: (row: any) => row.revenue,
      header: () => <span style={{ whiteSpace: "nowrap" }}>FACILITIES</span>,
      id: "facilities",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.total_facilities,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
          id: "total_facilities",
          width: "300px",
          maxWidth: "300px",
          minWidth: "300px",
          cell: (info: any) => {
            return (
              <span>
                {info.row.original.total_facilities?.toLocaleString() || 0}
              </span>
            );
          },
        },
        {
          accessorFn: (row: any) => row.active_facilities,
          header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIVE</span>,
          id: "active_facilities",
          width: "300px",
          maxWidth: "300px",
          minWidth: "300px",
          cell: (info: any) => {
            return (
              <span>
                {info.row.original.active_facilities?.toLocaleString() || 0}
              </span>
            );
          },
        },
      ],
    },
    {
      accessorFn: (row: any) => row.volume,
      header: () => <span style={{ whiteSpace: "nowrap" }}>VOLUME</span>,
      id: "volume",
      width: "800px",
      columns: [
        {
          accessorFn: (row: any) => row.total_targets,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TARGET</span>,
          id: "total_targets",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: (info: any) => {
            return (
              <span>
                {info.row.original.total_targets?.toLocaleString() || 0}
              </span>
            );
          },
        },
        {
          accessorFn: (row: any) => row.total_cases,
          header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
          id: "total_cases",
          width: "200px",
          maxWidth: "200px",
          minWidth: "200px",
          cell: (info: any) => {
            return (
              <span>
                {info.row.original.total_cases?.toLocaleString() || 0}
              </span>
            );
          },
        },
      ],
    },
    {
      accessorFn: (row: any) => row.target_reached,
      id: "target_reached",
      header: () => (
        <span style={{ whiteSpace: "nowrap" }}>TARGET REACHED</span>
      ),
      footer: (props: any) => props.column.id,
      width: "100px",
      maxWidth: "100px",
      minWidth: "100px",
      cell: (info: any) => {
        return (
          <span
            style={{ color: `${info.getValue()}` == "true" ? "green" : "red" }}
          >{`${info.getValue() ? "Yes" : "No"}`}</span>
        );
      },
    },
    {
      accessorFn: (row: any) => row?._id,
      id: "actions",
      header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      cell: (info: any) => {
        return <span style={{ marginLeft: "20px" }}>----</span>;
      },
    },
  ];

  // Function to sum all totals
  function calculateTotalSumOfFields(data: any, fieldName: any) {
    let totalAmount = 0;
    data.forEach((item: any) => {
      if (item.team) {
        item.team.forEach((member: any) => {
          totalAmount += member[fieldName] ? member[fieldName] : 0;
        });
      }
    });
    return totalAmount;
  }

  const setFooterValuData = (data: any[]) => {
    const totalFacilities = calculateTotalSumOfFields(data, "total_facilities");
    const activeFacilities = calculateTotalSumOfFields(
      data,
      "active_facilities"
    );
    const targetVolume = calculateTotalSumOfFields(data, "total_targets");
    const totalVolume = calculateTotalSumOfFields(data, "total_cases");

    const result: any = [
      { value: "Total", dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: totalFacilities, dolorSymbol: false },
      { value: activeFacilities, dolorSymbol: false },
      { value: targetVolume, dolorSymbol: false },
      { value: totalVolume, dolorSymbol: false },
      { value: null, dolorSymbol: false },
      { value: null, dolorSymbol: false },
    ];
    setTotalSumValues(result);
  };

  useEffect(() => {
    queryPreparations({
      fromDate: searchParams?.from_date,
      toDate: searchParams?.to_date,
      searchValue: searchParams?.search,
      general_sales_reps_exclude_count:
        searchParams?.general_sales_reps_exclude_count,
    });
    if (searchParams?.from_date) {
      setDateFilterDefaultValue(
        changeDateToUTC(searchParams?.from_date, searchParams?.to_date)
      );
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);
  return (
    <div className="s-no-column" id="salesRepsPage">
      <div>
        <SalesRepsFilters
          onUpdateData={onUpdateData}
          queryPreparations={queryPreparations}
          dateFilterDefaultValue={dateFilterDefaultValue}
          setDateFilterDefaultValue={setDateFilterDefaultValue}
          searchParams={searchParams}
          salesRepsData={teamWiseSalesRepsData}
          totalSumValues={totalSumValues}
        />
        <TeamWiseSalesRepsTanStackTable
          data={teamWiseSalesRepsData}
          columns={columnDef}
          loading={loading}
          totalSumValues={totalSumValues}
          searchParams={searchParams}
          getData={onUpdateData}
        />
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default TeamWiseSalesReps;
