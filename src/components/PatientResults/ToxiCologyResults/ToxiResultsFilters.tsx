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
import ToxiCologyResultsTable from "./ResultsTable";
import ReactDOMServer from "react-dom/server";

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

  const downloadAsPdf = async () => {
    const downloadRefElement = (
      <ToxiCologyResultsTable toxicologyResults={toxicologyResults} />
    );

    const htmlString: any = ReactDOMServer.renderToString(downloadRefElement);

    print(htmlString);
  };

  const print = (htmlString: string) => {
    const printWindow: any = window.open("", "blank");

    if (!printWindow) {
      console.error("Failed to open the window.");
      return;
    }

    if (!printWindow.document) {
      console.error("The document property of the window is undefined.");
      return;
    }

    try {
      printWindow.document.write(htmlString);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 100);
    } catch (error) {
      console.error("An error occurred while writing to the document:", error);
    }
  };

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

  // Function to filter data based on criteria
  const dataFilters = (criteria: any, data: any) => {
    const filteredData = [];
    for (const row of data.tableRows) {
      const filteredResults: any = {};
      for (const date in row.results) {
        const result = row.results[date];
        let matchCriteria = true;

        if (criteria.hasOwnProperty("positive")) {
          matchCriteria =
            matchCriteria && result.positive === criteria.positive;
        }

        if (criteria.hasOwnProperty("prescribed")) {
          matchCriteria =
            matchCriteria && result.prescribed === criteria.prescribed;
        }
        if (criteria.hasOwnProperty("test")) {
          const searchTerm = criteria.test.toLowerCase().trim();
          matchCriteria =
            matchCriteria && row.category.toLowerCase().includes(searchTerm);
        }
        if (criteria.hasOwnProperty("consistent")) {
          matchCriteria =
            matchCriteria && result.consistent === criteria.consistent;
        }

        if (matchCriteria) {
          filteredResults[date] = result;
        }
      }
      if (Object.keys(filteredResults).length > 0) {
        filteredData.push({
          ...row,
          results: filteredResults,
        });
      }
    }

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
    // data = dataFilters({ data, test, consistent, prescribed, positive });

    let temp = dataFilters(queryParams, data);
    let filteredData = {
      ...data,
      tableRows: temp,
    };
    setToxiCologyResults(filteredData);
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
      <Button
        onClick={() => {
          downloadAsPdf();
        }}
        disabled={Object?.keys(toxicologyResults)?.length > 0 ? false : true}
        variant="contained"
        className="exportBtn"
      >
        Export to pdf
      </Button>
    </div>
  );
};
export default ToxiResultsFilters;
