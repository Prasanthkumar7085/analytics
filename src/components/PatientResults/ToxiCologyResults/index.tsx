import LoadingComponent from "@/components/core/LoadingComponent";
import datePipe from "@/lib/Pipes/datePipe";
import {
  getAllToxicologyPatientRangesAPI,
  getAllToxicologyPatientResultsAPI,
  getSinglePatientResultAPI,
} from "@/services/patientResults/getAllPatientResultsAPIs";
import { Button, Container } from "@mui/material";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import ToxiCologyResultsTable from "./ResultsTable";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import dayjs from "dayjs";
import ToxiResultsFilters from "./ToxiResultsFilters";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { capitalizeAndRemoveUnderscore } from "@/lib/helpers/apiHelpers";
import ResultsNavBar from "./ResultsNavBar";
import ToxiCologyPatientDetailsDialog from "./PatientDetailsDialog";

const ToxiCologyResults = () => {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [toxicologyResults, setToxiCologyResults] = useState<any>({});
  const [patientsData, setPatientsData] = useState<any>({});
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [completeData, setCompleteData] = useState<any>({});
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [patientsDetailsDialog, setPatientsDetailsDialog] =
    useState<boolean>(false);
  const [testAutoCompleteOptions, setTestAutoCompleteOptions] = useState<any>(
    []
  );

  const formatDataForTable = (data: any, rangesData: any) => {
    const excludedKeys = [
      "id",
      "patient_id",
      "first_name",
      "last_name",
      "middle_name",
      "dob",
      "gender",
      "result_date",
      "accession_id",
      "lab_id",
      "created_at",
      "updated_at",
    ];

    const groupedByCategory: any = {};
    const resultDatesSet = new Set<string>();

    data.forEach((entry: any) => {
      Object.keys(entry).forEach((key) => {
        if (!excludedKeys.includes(key)) {
          if (!groupedByCategory[key]) {
            groupedByCategory[key] = [];
          }
          if (entry[key]) {
            const { result, positive, consistent, prescribed } = entry[key];
            groupedByCategory[key].push({
              result_date: entry.result_date,
              result: result,
              positive: positive,
              consistent: consistent,
              prescribed: prescribed,
            });
          } else {
            groupedByCategory[key].push({
              result_date: entry.result_date,
              nodata: true, // Indicates no data for this category
            });
          }
        }
      });
      resultDatesSet.add(entry.result_date);
    });

    const resultDates = Array.from(resultDatesSet).sort();

    const tableRows = Object.keys(groupedByCategory).map((category) => {
      const resultsByDate: any = {};
      const ranges = rangesData.find(
        (item: any) => item.mapped_key === category
      );

      resultDates.forEach((date) => {
        const result = groupedByCategory[category].find(
          (item: any) => item.result_date === date
        );
        resultsByDate[date] = {
          result: result ? result.result : "",
          positive: result?.positive?.toString(),
          consistent: result?.consistent?.toString(),
          prescribed: result?.prescribed?.toString(),
        };
      });
      return {
        category,
        nodata: groupedByCategory[category].every((item: any) => item.nodata),
        ...ranges,
        results: resultsByDate,
      };
    });

    return { resultDates, tableRows };
  };

  const getPatientToxicologyResult = async ({
    patient_id,
    test = searchParams?.test,
    fromDate,
    toDate,
    consistent = searchParams?.consistent,
    prescribed = -searchParams?.prescribed,
    positive = searchParams?.positive,
  }: any) => {
    setLoading(true);
    try {
      let queryParams: any = {
        patient_id: patient_id,
      };
      if (test) {
        queryParams["test"] = test;
      }
      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
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
      const response = await getAllToxicologyPatientResultsAPI(queryParams);
      let queryString = prepareURLEncodedParams("", queryParams);
      router.replace(`${pathname}${queryString}`);
      if (response.status == 200 || response.status == 201) {
        let rangesData = await getPatientToxicologyRangeValues(queryParams);
        let groupedPatientResultsData: any = formatDataForTable(
          response?.data,
          rangesData
        );
        setPatientsData(response?.data[0]);
        let filterData = dataFilters({
          data: groupedPatientResultsData,
          test: queryParams?.test,
          consistent: queryParams?.consistent,
          prescribed: queryParams?.prescribed,
          positive: queryParams?.positive,
        });

        setToxiCologyResults(filterData);
        setCompleteData(filterData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const getPatientToxicologyRangeValues = async (queryParams: any) => {
    try {
      const response = await getAllToxicologyPatientRangesAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        return response?.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPatientToxicologyResult({
      patient_id: id,
      test: params?.get("test"),
      fromDate: params?.get("from_date"),
      toDate: params?.get("to_date"),
      consistent: params?.get("consistent"),
      prescribed: params?.get("prescribed"),
      positive: params?.get("positive"),
    });
  }, [params]);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div style={{ paddingTop: "10px" }} className={"patientResultstsDashboard"}>
      <div className="subNavBar">
        <ResultsNavBar
          patientsData={patientsData}
          setPatientsDetailsDialog={setPatientsDetailsDialog}
        />
      </div>

      <div className="navActionsBlock">
        <h2 className="tableHeading">{"Toxicology Tests"}</h2>
        <ToxiResultsFilters
          getPatientToxicologyResult={getPatientToxicologyResult}
          id={id}
          setDateFilterDefaultValue={setDateFilterDefaultValue}
          dateFilterDefaultValue={dateFilterDefaultValue}
          toxicologyResults={toxicologyResults}
          setToxiCologyResults={setToxiCologyResults}
          searchParams={searchParams}
          router={router}
          pathname={pathname}
          completeData={completeData}
          testAutoCompleteOptions={testAutoCompleteOptions}
        />
      </div>
      {toxicologyResults?.["resultDates"]?.length ? (
        <Container maxWidth="xl">
          <div className="eachPatientResultTable">
            <div className="allPatientResultTable">
              <div className="tableContainer">
                <ToxiCologyResultsTable toxicologyResults={toxicologyResults} />
              </div>
            </div>
          </div>
        </Container>
      ) : !loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Image src="/Search Image.svg" alt="" height={200} width={510} />
          <h3>No Data</h3>
        </div>
      ) : (
        ""
      )}
      <ToxiCologyPatientDetailsDialog
        patientsDetailsDialog={patientsDetailsDialog}
        setPatientsDetailsDialog={setPatientsDetailsDialog}
      />

      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ToxiCologyResults;
