import AutoCompleteForSearch from "@/components/core/AutoCompleteForSearch";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import {
  consistantOrInconsistantsOptions,
  postiveOrnegativeOptions,
  prescribedOrNotOptions,
} from "@/lib/constants/filterOptions";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import dayjs from "dayjs";
import { useState } from "react";

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
}: any) => {
  const [posOrNegValue, setPosOrNegValue] = useState<any>();
  const [consistentOrnot, setConsistentOrnot] = useState<any>();
  const [prescribedOrNot, setPrescribedOrNot] = useState<any>();
  const [selectedTest, setSelectedTest] = useState<any>();

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      getPatientToxicologyResult(id, fromDate, toDate);
      const fromDateUTC = dayjs(fromDate).toDate();
      const toDateUTC = dayjs(toDate).toDate();
      setDateFilterDefaultValue([fromDateUTC, toDateUTC]);
    } else {
      setDateFilterDefaultValue(["", ""]);
      getPatientToxicologyResult(id, fromDate, toDate);
    }
  };
  const dataFilters = ({ data, test, consistent, prescribed }: any) => {
    if (test) {
      const searchTerm = test.toLowerCase().trim();
      data = data.filter((item: any) =>
        item.facility_name?.toLowerCase().includes(searchTerm)
      );
    }
    // if (consistent == true || consistent == false) {
    //   data = data.filter((item: any) =>
    //     item.facility_name?.toLowerCase().includes(searchTerm)
    //   );
    // }
  };
  const onUpdateData = ({
    test = searchParams?.test,
    consistent = searchParams?.consistent,
    prescribed = searchParams?.prescribed,
  }: Partial<{
    test: any;
    consistent: any;
    prescribed: any;
  }>) => {
    const queryParams: any = {
      ...(searchParams?.from_date && {
        from_date: searchParams?.from_date,
      }),
      ...(searchParams?.to_date && { to_date: searchParams?.to_date }),
      ...(searchParams?.test && {
        test: searchParams?.test,
      }),
      ...(searchParams?.consistent && {
        consistent: searchParams?.consistent,
      }),
      ...(searchParams?.prescribed && {
        prescribed: searchParams?.prescribed,
      }),
    };
    router.replace(`${pathname}${prepareURLEncodedParams("", queryParams)}`);
    let filteredData: any = [...completeData];
    filteredData = dataFilters({ filteredData, test, consistent, prescribed });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <GlobalDateRangeFilter
        onChangeData={onChangeData}
        dateFilterDefaultValue={dateFilterDefaultValue}
      />
      <AutoCompleteForSearch
        placeholder={"Select Tests"}
        selectedValue={selectedTest}
        setSelectedValue={setSelectedTest}
        autocompleteOptions={postiveOrnegativeOptions}
        label={"label"}
      />
      <AutoCompleteForSearch
        placeholder={"Select Positive Or Negative"}
        selectedValue={posOrNegValue}
        setSelectedValue={setPosOrNegValue}
        autocompleteOptions={postiveOrnegativeOptions}
        label={"label"}
      />
      <AutoCompleteForSearch
        placeholder={"Select Consistant Or Inconsistant"}
        selectedValue={consistentOrnot}
        setSelectedValue={setConsistentOrnot}
        autocompleteOptions={consistantOrInconsistantsOptions}
        label={"label"}
      />
      <AutoCompleteForSearch
        placeholder={"Select Prescribed Or Not"}
        selectedValue={prescribedOrNot}
        setSelectedValue={setPrescribedOrNot}
        autocompleteOptions={prescribedOrNotOptions}
        label={"label"}
      />
    </div>
  );
};
export default ToxiResultsFilters;
