import AutoCompleteForSearch from "@/components/core/AutoCompleteForSearch";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import {
  consistantOrInconsistantsOptions,
  postiveOrnegativeOptions,
  prescribedOrNotOptions,
  toxiTestOptions,
} from "@/lib/constants/filterOptions";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ToxiResultsFilters = ({
  getPatientToxicologyResult,
  id,
  setDateFilterDefaultValue,
  dateFilterDefaultValue,
  toxicologyResults,
  setToxiCologyResults,
  searchParams,
  router,
  pathname,
  completeData,
  testAutoCompleteOptions,
}: any) => {
  const [posOrNegValue, setPosOrNegValue] = useState<any>();
  const [consistentOrnot, setConsistentOrnot] = useState<any>();
  const [prescribedOrNot, setPrescribedOrNot] = useState<any>();
  const [selectedTest, setSelectedTest] = useState<any>();

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      getPatientToxicologyResult({
        patient_id: id,
        test: searchParams?.test,
        fromDate: fromDate,
        toDate: toDate,
        consistent: searchParams?.consistent,
        prescribed: searchParams?.prescribed,
        positive: searchParams?.positive,
      });
      const fromDateUTC = dayjs(fromDate).toDate();
      const toDateUTC = dayjs(toDate).toDate();
      setDateFilterDefaultValue([fromDateUTC, toDateUTC]);
    } else {
      setDateFilterDefaultValue("", "");
      getPatientToxicologyResult({
        patient_id: id,
        test: searchParams?.test,
        fromDate: "",
        toDate: "",
        consistent: searchParams?.consistent,
        prescribed: searchParams?.prescribed,
        positive: searchParams?.positive,
      });
    }
  };
  const dataFilters = ({
    data,
    test,
    consistent,
    prescribed,
    positive,
  }: any) => {
    if (!data || !data.tableRows || !data.resultDates) {
      return { ...data };
    }
    const filteredData = {
      ...data,
      tableRows: data.tableRows.filter((categoryItem: any) => {
        const results = categoryItem.results || {};
        const filteredResults = {};
        const passesFilters = data.resultDates.some((date: any) => {
          const result = results[date];
          if (!result) return false;

          let passTest = true;
          if (test) {
            const searchTerm = test.toLowerCase().trim();
            passTest = categoryItem.category.toLowerCase().includes(searchTerm);
          }
          let passConsistent = true;
          if (consistent !== undefined) {
            passConsistent = result.consistent === consistent;
          }
          let passPositive = true;
          if (positive !== undefined) {
            passPositive = result.positive === positive;
          }

          let passPrescribed = true;
          if (prescribed !== undefined) {
            passPrescribed = result.prescribed === prescribed;
          }

          return passTest && passConsistent && passPrescribed && passPositive;
        });

        return passesFilters;
      }),
    };

    return filteredData;
  };

  const onUpdateData = ({
    test = searchParams?.test,
    consistent = searchParams?.consistent,
    prescribed = searchParams?.prescribed,
    positive = searchParams?.positive,
  }: Partial<{
    test: any;
    consistent: any;
    prescribed: any;
    positive: any;
  }>) => {
    const queryParams: any = {
      ...(searchParams?.from_date && {
        from_date: searchParams?.from_date,
      }),
      ...(searchParams?.to_date && { to_date: searchParams?.to_date }),
    };
    if (test) {
      queryParams["test"] = test;
    }
    if (consistent) {
      queryParams["consistent"] = consistent;
    }
    if (prescribed) {
      queryParams["prescribed"] = prescribed;
    }
    if (positive) {
      queryParams["positive"] = positive;
    }
    router.replace(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let data: any = { ...completeData };
    data = dataFilters({ data, test, consistent, prescribed, positive });
    setToxiCologyResults(data);
  };

  const autoFillValues = () => {
    let positiveValue = postiveOrnegativeOptions?.find(
      (item) => item?.value == searchParams?.positive
    );
    setPosOrNegValue(positiveValue);
    let consistValue = consistantOrInconsistantsOptions?.find(
      (item) => item?.value == searchParams?.consistent
    );
    setConsistentOrnot(consistValue);
    let prescribeValue = prescribedOrNotOptions?.find(
      (item) => item?.value == searchParams?.prescribed
    );
    setPrescribedOrNot(prescribeValue);
    let testValue = toxiTestOptions?.find(
      (item: any) => item?.value == searchParams?.test
    );
    setSelectedTest(testValue);
  };
  useEffect(() => {
    autoFillValues();
  }, [searchParams]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <AutoCompleteForSearch
        placeholder={"Select Tests"}
        selectedValue={selectedTest}
        setSelectedValue={setSelectedTest}
        autocompleteOptions={toxiTestOptions}
        label={"label"}
        onUpdateData={onUpdateData}
      />
      <AutoCompleteForSearch
        placeholder={"Select Positive Or Negative"}
        selectedValue={posOrNegValue}
        setSelectedValue={setPosOrNegValue}
        autocompleteOptions={postiveOrnegativeOptions}
        label={"label"}
        onUpdateData={onUpdateData}
      />
      <AutoCompleteForSearch
        placeholder={"Select Consistant Or Inconsistant"}
        selectedValue={consistentOrnot}
        setSelectedValue={setConsistentOrnot}
        autocompleteOptions={consistantOrInconsistantsOptions}
        label={"label"}
        onUpdateData={onUpdateData}
      />
      <AutoCompleteForSearch
        placeholder={"Select Prescribed Or Not"}
        selectedValue={prescribedOrNot}
        setSelectedValue={setPrescribedOrNot}
        autocompleteOptions={prescribedOrNotOptions}
        label={"label"}
        onUpdateData={onUpdateData}
      />
      <GlobalDateRangeFilter
        onChangeData={onChangeData}
        dateFilterDefaultValue={dateFilterDefaultValue}
      />
      <Button>Export</Button>
    </div>
  );
};
export default ToxiResultsFilters;
