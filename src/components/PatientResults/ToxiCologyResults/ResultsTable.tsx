import GraphDialogForToxiResults from "@/components/core/GrpahDilogInToxiResults";
import LineGraphForResults from "@/components/core/LineGraph/LineGraphForResults";
import { capitalizeAndRemoveUnderscore } from "@/lib/helpers/apiHelpers";
import { momentWithTimezone } from "@/lib/Pipes/timeFormat";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const ToxiCologyResultsTable = ({ toxicologyResults }: any) => {
  const [graphDialogOpen, setGraphDialogOpen] = useState<any>(false);
  const [graphData, setGraphData] = useState<any>({});
  const getGraphValuesData = (data: any) => {
    const resultArrayWithDates = Object.entries(data.results).map(
      ([date, entry]: any) => [date, entry.result]
    );
    return resultArrayWithDates;
  };
  return (
    <table>
      <thead style={{ backgroundColor: "blue" }}>
        <tr>
          <th style={{ minWidth: "150px" }}>CONFIRMATION</th>
          <th style={{ minWidth: "150px" }}>CUTOFF</th>
          <th style={{ minWidth: "150px" }}>RANGES</th>

          {toxicologyResults?.["resultDates"]?.map(
            (result: any, resultIndex: any) => (
              <th style={{ minWidth: "100px",maxWidth:"100px" }} key={resultIndex}>
                {momentWithTimezone(result)}
              </th>
            )
          )}
          <th style={{ minWidth: "70px" }}>TREND</th>
        </tr>
      </thead>
      <tbody>
        {toxicologyResults?.tableRows?.map((row: any, rowIndex: any) => (
          <tr key={rowIndex}>
            <td
              style={{
                backgroundColor: row?.nodata == true ? "#f0edfe" : "",
              }}
            >
              {capitalizeAndRemoveUnderscore(row?.category)}
            </td>
            <td
              style={{
                backgroundColor: row?.nodata == true ? "#f0edfe" : "",
              }}
            >
              {row?.cutoff ? row?.cutoff : "-"} {row?.cutoff ? row?.units : ""}
            </td>
            <td
              style={{
                backgroundColor: row?.nodata == true ? "#f0edfe" : "",
              }}
            >
              {row?.ref_range ? row?.ref_range : "-"}{" "}
              {row?.ref_range ? row?.units : ""}
            </td>
            {toxicologyResults?.["resultDates"]?.map(
              (item: any, index: any) => {
                return (
                  <td
                    style={{
                      background:
                        row?.results[item]?.positive == "true"
                          ? "#f2d2d7"
                          : row?.results[item]?.positive == "false"
                          ? "#cce7d4"
                          : "#f0edfe",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {row.results[item]?.result
                        ? row.results[item]?.result
                        : "-"}

                      <div
                        style={{
                          display: row.results[item]?.result ? "flex" : "none",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {row.results[item]?.prescribed == "true" ? (
                          <Tooltip title="prescribed">
                            <Image
                              src={"/PR.svg"}
                              alt="pr"
                              width={18}
                              height={18}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Not prescribed">
                            <Image
                              src={"/NP.svg"}
                              alt="np"
                              width={18}
                              height={18}
                            />
                          </Tooltip>
                        )}
                        {row.results[item]?.consistent == "true" ? (
                          <Tooltip title="consistent">
                            <Image
                              src={"/CO.svg"}
                              alt="co"
                              width={18}
                              height={18}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="In consistent">
                            <Image
                              src={"/IN.svg"}
                              alt="in"
                              width={18}
                              height={18}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </td>
                );
              }
            )}

            <td
              style={{ cursor: "pointer" }}
              onClick={() => {
                setGraphDialogOpen(true);
                setGraphData({ ...row });
              }}
            >
              <LineGraphForResults
                patientsData={[]}
                graphValuesData={getGraphValuesData({ ...row })}
              />
            </td>
          </tr>
        ))}
      </tbody>
      {graphDialogOpen ? (
        <GraphDialogForToxiResults
          graphDialogOpen={graphDialogOpen}
          setGraphDialogOpen={setGraphDialogOpen}
          graphData={graphData}
        />
      ) : (
        ""
      )}
    </table>
  );
};
export default ToxiCologyResultsTable;
