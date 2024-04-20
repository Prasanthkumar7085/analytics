import { addSerial } from "@/lib/Pipes/addSerial";
import { customSortByMonth } from "@/lib/Pipes/sortAndGetData";
import { caseTypesData } from "@/lib/constants";
import {
  checkNumbersOrnot,
  formatDateToMonthName,
  getUniqueMonths,
} from "@/lib/helpers/apiHelpers";
import {
  getSalesRepTargetsAPI,
  updateTargetsAPI,
} from "@/services/salesTargetsAPIs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "sonner";
import LoadingComponent from "../core/LoadingComponent";
import MultipleColumnsTableForTargets from "../core/Table/MultitpleColumn/MultipleColumnTableForTargets";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import SalesRepsTargetsFilters from "./SalesRepsTargetsFilters";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { IconButton, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
const SalesCaseTypeWiseTargets = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [allTargetsData, setAllTargetsData] = useState<any>([]);
  const [completeData, setCompleteData] = useState([]);
  const [defaultYearValue, setDefaultYearValue] = useState<any>();
  const [headerMonths, setHeaderMonths] = useState<any>([]);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [totalSumValues, setTotalSumValues] = useState<any>([]);
  const [selectedValues, setSelectedValues] = useState<any>({});
  const [editOrNot, setEditOrNot] = useState<boolean>(false);
  const [editbleValue, setEditbleValue] = useState<any>();

  //query preparation method
  const queryPreparations = async ({
    month,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
  }: any) => {
    let queryParams: any = { month: "04-2024" };
    if (month) {
      queryParams["month"] = month;
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

    try {
      await getAllSalesRepCaseTypeWiseTargets(queryParams);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get total sum of the every month
  const getTotalSumsOfMonths = (data: any) => {
    const result: any = [
      [
        { value: "Total", dolorSymbol: false },
        { value: null, dolorSymbol: false },
      ],
    ];
    // Calculate totals
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sept",
      "oct",
      "nov",
      "dec",
    ];
    months.forEach((month) => {
      const volumeTotal = data.reduce(
        (acc: any, item: any) => acc + item[month][0],
        0
      );
      const facilitiesTotal = data.reduce(
        (acc: any, item: any) => acc + item[month][1],
        0
      );

      let makeVolumeObj = { value: volumeTotal, dolorSymbol: false };
      let makeFacilitiesObj = { value: facilitiesTotal, dolorSymbol: false };
      result.push([makeVolumeObj, makeFacilitiesObj]);
    });
    setTotalSumValues(result.flat());
  };

  //group the given data into monthwise salesrep data
  const groupedTargetsData = (data: any) => {
    const groupedData = data.reduce((acc: any, obj: any) => {
      const salesRepName = obj.sales_rep_name;
      const salesRepId = obj.sales_rep_id;
      const id = obj.id;
      const month = obj.month;

      if (!acc[salesRepId]) {
        acc[salesRepId] = {
          sales_rep_name: salesRepName,
          sales_rep_id: salesRepId,
          id: id,
          monthwiseData: {},
        };
      }
      acc[salesRepId].monthwiseData[month] = {
        ...obj,
      };

      return acc;
    }, {});
    return Object.values(groupedData);
  };

  //get all sales reps data event
  const getAllSalesRepCaseTypeWiseTargets = async (queryParams: any) => {
    setLoading(true);
    try {
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);

      const response = await getSalesRepTargetsAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonths(response?.data);
        setHeaderMonths(uniqueMonths);

        let groupData: any = groupedTargetsData(response?.data);
        setCompleteData(groupData);

        if (queryParams.search) {
          groupData = groupData.filter((item: any) =>
            item.sales_rep_name
              ?.toLowerCase()
              ?.includes(queryParams.search?.toLowerCase()?.trim())
          );
        }
        let modifieData = addSerial(groupData, 1, groupData?.length);
        if (queryParams.order_by) {
          const string = queryParams.order_by.split("-");
          const datePart = string[0] + "-" + string[1];
          const remainingPart = string[2];
          modifieData = customSortByMonth(
            modifieData,
            datePart,
            remainingPart,
            queryParams.order_type
          );
        }
        setAllTargetsData(modifieData);
      } else {
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //update cell value or targets values
  const updateTargets = async (month: string, id: any) => {
    setLoading(true);
    try {
      let body = editbleValue;

      const response = await updateTargetsAPI(body, id);
      if (response.status == 200 || response.status == 201) {
        toast.success(response.message);
        setSelectedValues({});
        setEditbleValue({});
        await queryPreparations({
          month: searchParams?.month,
          searchValue: searchParams?.search,
        });
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //when double click on the cell we handle the editble or not (cell)
  const handleEditClick = (month: string, salesID: any, infoData: any) => {
    setSelectedValues({
      selectedMonth: month,
      selectedSalesRepID: salesID,
    });
    setEditbleValue({
      covid: +infoData.row.original.monthwiseData[month]["covid"],
      covid_flu: +infoData.row.original.monthwiseData[month]["covid_flu"],
      clinical: +infoData.row.original.monthwiseData[month]["clinical"],
      gastro: +infoData.row.original.monthwiseData[month]["gastro"],
      nail: +infoData.row.original.monthwiseData[month]["nail"],
      pgx: +infoData.row.original.monthwiseData[month]["pgx"],
      rpp: +infoData.row.original.monthwiseData[month]["rpp"] || 0,
      tox: +infoData.row.original.monthwiseData[month]["tox"],
      ua: +infoData.row.original.monthwiseData[month]["ua"] || 0,
      uti: +infoData.row.original.monthwiseData[month]["uti"],
      wound: +infoData.row.original.monthwiseData[month]["wound"],
      card: +infoData.row.original.monthwiseData[month]["card"],
      cgx: +infoData.row.original.monthwiseData[month]["cgx"],
      diabetes: +infoData.row.original.monthwiseData[month]["diabetes"],
      pad: +infoData.row.original.monthwiseData[month]["pad"],
      pul: +infoData.row.original.monthwiseData[month]["pul"],
    });
  };

  const checkEditOrNot = (month: string, salesID: any) => {
    if (
      month == selectedValues.selectedMonth &&
      salesID == selectedValues.selectedSalesRepID
    ) {
      return true;
    } else {
      return false;
    }
  };

  //coloumns for the sales rep targets table
  const columnDef = [
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
      accessorFn: (row: any) => row.sales_rep_name,
      id: "sales_rep_name",
      header: () => <span style={{ whiteSpace: "nowrap" }}>MARKETER NAME</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
      maxWidth: "220px",
      minWidth: "220px",
      cell: (info: any) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => goToSingleRepPage(info.row.original.sales_rep_id)}
          >
            {info.row.original.sales_rep_name}
          </span>
        );
      },
    },
  ];

  //prepare additional coloumns
  let additionalColumns: any = headerMonths?.map((item: any) => ({
    accessorFn: (row: any) => row.monthwiseData[item],
    header: (props: any) => (
      <div style={{ textAlign: "center", margin: "auto" }}>
        <span style={{ whiteSpace: "nowrap" }}>
          {formatDateToMonthName(props.column.id)}
        </span>{" "}
      </div>
    ),
    id: item,
    width: "800px",
    columns: [
      ...caseTypesData?.map((casetype: any, caseIndex: number) => ({
        accessorFn: (row: any) => row.monthwiseData[item][casetype.value],
        header: () => (
          <span style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {casetype.title}
          </span>
        ),
        id: `${item}-${casetype.value}`,
        width: "300px",
        maxWidth: "300px",
        minWidth: "300px",
        cell: (info: any) => (
          <div>
            {checkEditOrNot(item, info.row.original.sales_rep_id) ? (
              <TextField
                autoFocus
                key={info.row.original.sales_rep_id}
                sx={{
                  "& .MuiInputBase-root": {
                    padding: "2.5px !Important",
                    fontSize: "clamp(12px, 0.72vw, 14px) !important",
                    height: 30,
                  },
                  "& .MuiInputBase-input": {
                    padding: "0",
                  },
                }}
                value={editbleValue[casetype.value]}
                onChange={(e) => {
                  setEditbleValue((prev: any) => ({
                    ...prev,
                    [casetype.value]: +e.target.value,
                  }));
                }}
                onInput={checkNumbersOrnot}
              />
            ) : (
              info.row.original.monthwiseData[item][
                casetype.value
              ]?.toLocaleString()
            )}
          </div>
        ),
      })),
      {
        header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIONS</span>,
        accessorFn: (row: any) => row.actions,
        id: `${item}-{}`,
        width: "200px",
        cell: (info: any) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
                gap: "0.5rem",
              }}
            >
              {Object.keys(selectedValues)?.length &&
              checkEditOrNot(item, info.row.original.sales_rep_id) ? (
                <div>
                  <IconButton
                    sx={{ padding: "0" }}
                    disabled={editbleValue ? false : true}
                    onClick={() => {
                      updateTargets(item, info.row.original?.id);
                    }}
                  >
                    <SaveIcon color="success" />
                  </IconButton>
                  <IconButton
                    onClick={() => setSelectedValues({})}
                    sx={{ padding: "0" }}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </div>
              ) : (
                <p
                  onClick={() => {
                    console.log(info.row.original.id, "'ee");

                    handleEditClick(item, info.row.original.sales_rep_id, info);
                  }}
                >
                  {" "}
                  <BorderColorIcon fontSize={"small"} />
                  Edit
                </p>
              )}
            </div>
          );
        },
      },
    ],
  }));

  const addAddtionalColoumns = [...columnDef, ...additionalColumns];

  //go to single sales rep page
  const goToSingleRepPage = (repId: string) => {
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

    router.push(`/sales-representatives/${repId}${queryString}`);
  };

  const onUpdateData = ({
    search = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type as "asc" | "desc",
  }: Partial<{
    search: string;
    orderBy: string;
    orderType: "asc" | "desc";
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
    if (params.get("year")) {
      queryParams["year"] = params.get("year");
    }
    if (params.get("to_date")) {
      queryParams["to_date"] = params.get("to_date");
    }

    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let data = [...completeData];

    if (orderBy && orderType) {
      if (orderBy) {
        const string = queryParams.order_by.split("-");
        const datePart = string[0] + "-" + string[1];
        const remainingPart = string[2];
        data = customSortByMonth(
          data,
          datePart,
          remainingPart,
          queryParams.order_type
        );
      }
      if (search) {
        data = data.filter((item: any) =>
          item.sales_rep_name
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()?.trim())
        );
      }
    } else {
      data = [...completeData];
      if (search) {
        data = data.filter((item: any) =>
          item.sales_rep_name
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()?.trim())
        );
      }
    }
    const modifieData = addSerial(data, 1, data?.length);
    setAllTargetsData(modifieData);
  };

  useEffect(() => {
    queryPreparations({
      month: searchParams?.month,
      searchValue: searchParams?.search,
    });
    if (searchParams?.month) {
      setDefaultYearValue({ month: searchParams.month });
    }
  }, []);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div className="s-no-column" id="salesTarget">
      <div>
        <SalesRepsTargetsFilters
          onUpdateData={onUpdateData}
          queryPreparations={queryPreparations}
          dateFilterDefaultValue={defaultYearValue}
          setDateFilterDefaultValue={setDefaultYearValue}
          searchParams={searchParams}
        />
        <MultipleColumnsTableForTargets
          data={allTargetsData}
          columns={addAddtionalColoumns}
          loading={loading}
          searchParams={searchParams}
          getData={onUpdateData}
          totalSumValues={totalSumValues}
        />
        <LoadingComponent loading={loading} />
      </div>
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default SalesCaseTypeWiseTargets;
