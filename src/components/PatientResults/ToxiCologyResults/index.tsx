import LoadingComponent from "@/components/core/LoadingComponent";
import datePipe from "@/lib/Pipes/datePipe";
import {
  getAllToxicologyPatientResultsAPI,
  getSinglePatientResultAPI,
} from "@/services/patientResults/getAllPatientResultsAPIs";
import { Button, Container } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ToxiCologyResultsTable from "./ResultsTable";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import dayjs from "dayjs";

const ToxiCologyResults = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toxicologyResults, setToxiCologyResults] = useState<any>({});
  const [patientsData, setPatientsData] = useState<any>({});
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>();

  const formatDataForTable = (data: any) => {
    const groupedByCategory: any = {};

    data.forEach((entry: any) => {
      Object.keys(entry).forEach((key) => {
        if (
          key !== "id" &&
          key !== "patient_id" &&
          key !== "first_name" &&
          key !== "last_name" &&
          key !== "middle_name" &&
          key !== "dob" &&
          key !== "gender" &&
          key !== "result_date" &&
          key !== "accession_id" &&
          key !== "lab_id" &&
          key !== "created_at" &&
          key !== "updated_at"
        ) {
          if (!groupedByCategory[key]) {
            groupedByCategory[key] = [];
          }
          groupedByCategory[key].push({
            result_date: entry.result_date,
            result: entry[key].result,
            positive: entry[key].positive,
            consistent: entry[key]?.consistent,
            prescribed: entry[key]?.prescribed,
          });
        }
      });
    });

    const resultDates = Array.from(
      new Set(data.map((entry: any) => entry.result_date))
    );
    resultDates.sort();

    const tableRows = Object.keys(groupedByCategory).map((category) => {
      const row: any = {
        category: category,
        results: {},
      };

      resultDates.forEach((date: any) => {
        const result: any = groupedByCategory[category].find(
          (item: any) => item.result_date === date
        );
        row.results[date] = {
          result: result ? result.result : "",
          positive: result?.positive,
          consistent: result?.consistent,
          prescribed: result?.prescribed,
        };
      });

      return row;
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
        let groupedPatientResultsData: any = formatDataForTable(response?.data);
        setPatientsData(response?.data[0]);
        setToxiCologyResults(groupedPatientResultsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    getPatientToxicologyResult(id, "", "");
  }, []);

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
        <GlobalDateRangeFilter
          onChangeData={onChangeData}
          dateFilterDefaultValue={dateFilterDefaultValue}
        />
      </div>
      {toxicologyResults?.["resultDates"]?.length ? (
        <Container maxWidth="xl">
          <div className="eachPatientResultTable" style={{ marginTop: "30px" }}>
            <h2 className="tableHeading">{"Toxicology Tests"}</h2>
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
