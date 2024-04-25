import { addSerial } from "@/lib/Pipes/addSerial";
import { customSortByMonth } from "@/lib/Pipes/sortAndGetData";
import { caseTypesData } from "@/lib/constants";
import React from "react";
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
  const [editbleValue, setEditbleValue] = useState<any>({});
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [updatedRowTotal, setUpdatedRowTotal] = useState<any>(0);
  const [coloumSums, setColoumnsSums] = useState({});
  const [facilityUpdatedValue, setFacilityUpdatedValue] = useState<any>(0);

  //query preparation method
  const queryPreparations = async ({
    month,
    searchValue = searchParams?.search,
    orderBy = searchParams?.order_by,
    orderType = searchParams?.order_type,
  }: any) => {
    let queryParams: any = { month: "05-2024" };
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

  //group the given data into monthwise salesrep data
  const groupedTargetsData = (data: any) => {
    const groupedData = data.reduce((acc: any, obj: any) => {
      const salesRepId = obj.sales_rep_id;
      const month = obj.month;

      if (!acc[salesRepId]) {
        acc[salesRepId] = {
          sales_rep_name: obj.sales_rep_name,
          sales_rep_id: salesRepId,
          id: obj.id,
          new_facilities: obj.new_facilities,
          created_at: obj.created_at,
          updated_at: obj.updated_at,
          total: obj.total,
          start_date: obj.start_date,
          end_date: obj.end_date,
          month: obj.month,
          monthwiseData: {},
          rowTotal: 0, // Initialize row-wise total sum
        };
      }

      // Filter out fields already present in the main object
      const filteredObj = Object.keys(obj)
        .filter((key) => !(key in acc[salesRepId]))
        .reduce((acc: any, key) => {
          acc[key] = obj[key];
          return acc;
        }, {});

      acc[salesRepId].monthwiseData[month] = {
        ...filteredObj,
      };

      // Calculate row-wise total sum
      let rowTotal = 0;
      for (const entry of Object.values(acc[salesRepId].monthwiseData[month])) {
        if (typeof entry === "number") {
          rowTotal += entry;
        }
      }
      acc[salesRepId].rowTotal += rowTotal;

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  //calculate total sum of the casetypewise targets
  const getTotalSumOfAllCaseTypesTargets = (data: any) => {
    const total = Object?.values(data).reduce((acc: any, value: any) => {
      if (value === data.new_facilities) {
        return acc;
      }
      return acc + +value;
    }, 0);
    setUpdatedRowTotal(total);
  };

  useEffect(() => {
    getTotalSumOfAllCaseTypesTargets(editbleValue);
  }, [editbleValue]);
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
          modifieData = customSortByMonth(
            modifieData,
            queryParams.order_type,
            queryParams.order_by
          );
        }
        setAllTargetsData(modifieData);
        getColoumnWiseTotalCount(modifieData);
      } else {
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //get the coloumn wise sum count
  const getColoumnWiseTotalCount = (modifieData: any) => {
    const caseTypeTotals: { [key: string]: number } = {};
    modifieData.forEach((obj: any) => {
      Object.values(obj.monthwiseData).forEach((monthData: any) => {
        Object.entries(monthData).forEach(([caseType, value]: any) => {
          caseTypeTotals[caseType] = (caseTypeTotals[caseType] || 0) + value;
        });
      });
    });
    setColoumnsSums(caseTypeTotals);
    let newFacilitiesTotal = 0;
    let rowTotalSum = 0;
    modifieData.forEach((obj: any) => {
      newFacilitiesTotal += obj.new_facilities;
      rowTotalSum += obj.rowTotal;
    });

    const totalSums = [newFacilitiesTotal, rowTotalSum];
    setTotalSumValues(totalSums);
  };

  //update cell value or targets values
  const updateTargets = async (month: string, id: any) => {
    setLoading(true);
    try {
      let body = { ...editbleValue, new_facilities: facilityUpdatedValue };

      const response = await updateTargetsAPI(body, id);
      if (response.status == 200 || response.status == 201) {
        toast.success(response.message);
        setSelectedValues({});
        setEditbleValue({});
        await queryPreparations({
          month: searchParams?.month,
          searchValue: searchParams?.search,
        });
        setUpdatedRowTotal(null);
        setFocusedIndex(0);
        setFacilityUpdatedValue(0);
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
    setFacilityUpdatedValue(+infoData.row.original.new_facilities);
    setUpdatedRowTotal(+infoData.row.original.rowTotal);
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
                autoFocus={focusedIndex === caseIndex}
                key={caseIndex}
                sx={{
                  "& .MuiInputBase-root": {
                    padding: "2.5px !Important",
                    fontSize: "clamp(12px, 0.72vw, 14px) !important",
                    height: 30,
                  },
                }}
                value={editbleValue[casetype.value]}
                onChange={(e) => {
                  setEditbleValue((prev: any) => ({
                    ...prev,
                    [casetype.value]: +e.target.value,
                  }));
                  setFocusedIndex(caseIndex);
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
        header: () => (
          <span style={{ whiteSpace: "nowrap" }}>NEW FACILITIES</span>
        ),
        accessorFn: (row: any) => row.original.new_facilities,
        id: `new_facilities`,
        width: "200px",
        cell: (info: any) => {
          return (
            <div>
              {checkEditOrNot(item, info.row.original.sales_rep_id) ? (
                <TextField
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "2.5px !Important",
                      fontSize: "clamp(12px, 0.72vw, 14px) !important",
                      height: 30,
                    },
                  }}
                  autoFocus={focusedIndex === 17}
                  key={17}
                  value={facilityUpdatedValue}
                  onChange={(e) => {
                    setFacilityUpdatedValue(+e.target.value);
                    setFocusedIndex(17);
                  }}
                  onInput={checkNumbersOrnot}
                />
              ) : (
                info.row.original.new_facilities?.toLocaleString()
              )}
            </div>
          );
        },
      },
      {
        header: () => <span style={{ whiteSpace: "nowrap" }}>TOTAL</span>,
        accessorFn: (row: any) => row.original.total,
        id: `rowTotal`,
        width: "200px",
        cell: (info: any) => {
          return (
            <div>
              {" "}
              {checkEditOrNot(item, info.row.original.sales_rep_id)
                ? updatedRowTotal?.toLocaleString()
                : info.row.original.rowTotal?.toLocaleString()}
            </div>
          );
        },
      },

      {
        header: () => <span style={{ whiteSpace: "nowrap" }}>ACTIONS</span>,
        accessorFn: (row: any) => row.original.monthwiseData[item],
        id: `actions`,
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
                    onClick={() => {
                      setSelectedValues({});
                      setUpdatedRowTotal(null);
                      setFocusedIndex(0);
                      setFacilityUpdatedValue(0);
                    }}
                    sx={{ padding: "0" }}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </div>
              ) : (
                <p
                  onClick={() => {
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
    if (params.get("month")) {
      queryParams["month"] = params.get("month");
    }

    router.push(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let data = [...completeData];

    if (orderBy && orderType) {
      if (orderBy) {
        data = customSortByMonth(
          data,
          queryParams.order_type,
          queryParams.order_by
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
          totalSumValues={coloumSums}
          anotherSumValues={totalSumValues}
        />
        <LoadingComponent loading={loading} />
      </div>
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default SalesCaseTypeWiseTargets;
