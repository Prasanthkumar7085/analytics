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

const ToxiCologyResults = () => {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [toxicologyResults, setToxiCologyResults] = useState<any>({});
  const [patientsData, setPatientsData] = useState<any>({});
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();
  const [completeData, setCompleteData] = useState<any>({});
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
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
          const { result, positive, consistent, prescribed } = entry[key];
          groupedByCategory[key].push({
            result_date: entry.result_date,
            result: result,
            positive: positive,
            consistent: consistent,
            prescribed: prescribed,
          });
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
          positive: result?.positive,
          consistent: result?.consistent,
          prescribed: result?.prescribed,
        };
      });
      return { category, ...ranges, results: resultsByDate };
    });

    return { resultDates, tableRows };
  };

  const getPatientToxicologyResult = async (
    patient_id: any,
    fromDate: any,
    toDate: any
  ) => {
    setLoading(true);
    try {
      let queryParams: any = {
        patient_id: patient_id,
      };

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      const response = await getAllToxicologyPatientResultsAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        let rangesData = await getPatientToxicologyRangeValues(queryParams);
        let groupedPatientResultsData: any = formatDataForTable(
          response?.data,
          rangesData
        );
        setPatientsData(response?.data[0]);
        setToxiCologyResults(groupedPatientResultsData);
        setCompleteData(groupedPatientResultsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPatientToxicologyRangeValues = async (queryParams: any) => {
    setLoading(true);
    try {
      const response = await getAllToxicologyPatientRangesAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        return response?.data;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPatientToxicologyResult(id, "", "");
  }, []);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div style={{ paddingTop: "10px" }}>
      <div className="subNavBar">
        <Button
          className="bacKBtn"
          variant="outlined"
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
        <div className="SubNavPointsBlock">
          <div className="eachBlocks">
            <Image alt="" src="/card.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Patient ID</label>
              <p className="value">
                {patientsData?.patient_id ? patientsData?.patient_id : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">First Name</label>
              <p className="value">
                {patientsData?.first_name ? patientsData?.first_name : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/vector-patient.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Last Name</label>
              <p className="value">
                {patientsData?.last_name ? patientsData?.last_name : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks">
            <Image alt="" src="/Group.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Gender</label>
              <p className="value">
                {patientsData?.gender ? patientsData?.gender : "--"}
              </p>
            </div>
          </div>
          <div className="eachBlocks b-right">
            <Image alt="" src="/calendar.svg" height={20} width={20} />
            <div className="namesData">
              <label className="label">Date of Birth</label>
              <p className="value">
                {patientsData?.dob ? patientsData?.dob : "--"}
              </p>
            </div>
          </div>
        </div>
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
      {/* <LineGraphForPatientResult
        graphDialogOpen={graphDialogOpen}
        setGraphDialogOpen={setGraphDialogOpen}
        graphValuesData={rowResultsdata}
        data={patientSingleRowData}
        graphColor="blue"
        tabValue="Patient Result"
        patientsData={patientsData}
      /> */}
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ToxiCologyResults;
