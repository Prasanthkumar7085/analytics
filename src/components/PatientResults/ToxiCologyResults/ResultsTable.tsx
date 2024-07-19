import { capitalizeAndRemoveUnderscore } from "@/lib/helpers/apiHelpers";
import { momentWithTimezone } from "@/lib/Pipes/timeFormat";
import Image from "next/image";

const ToxiCologyResultsTable = ({ toxicologyResults }: any) => {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ minWidth: "150px" }}>CONFIRMATION</th>
          <th style={{ minWidth: "150px" }}>CUTOFF</th>
          <th style={{ minWidth: "150px" }}>RANGES</th>

          {toxicologyResults?.["resultDates"]?.map(
            (result: any, resultIndex: any) => (
              <th style={{ minWidth: "50px" }} key={resultIndex}>
                {momentWithTimezone(result)}
              </th>
            )
          )}
          <th style={{ minWidth: "120px" }}>TREND</th>
        </tr>
      </thead>
      <tbody>
        {toxicologyResults?.tableRows?.map((row: any, rowIndex: any) => (
          <tr key={rowIndex}>
            <td>{capitalizeAndRemoveUnderscore(row?.category)}</td>
            <td>
              {row?.cutoff ? row?.cutoff : "-"} {row?.units}
            </td>
            <td>
              {row?.ref_range ? row?.ref_range : "-"} {row?.units}
            </td>
            {Object.keys(row.results)?.map((item: any, index) => {
              return (
                <td
                  style={{
                    background: row?.results[item]?.positive
                      ? "#f2d2d7"
                      : "#cce7d4",
                  }}
                  key={index}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {row.results[item]?.result}
                    <div style={{ display: "flex", gap: "4px" }}>
                      {row.results[item]?.prescribed ? (
                        <Image
                          src={"/PR.svg"}
                          alt="pr"
                          width={23}
                          height={23}
                        />
                      ) : (
                        <Image
                          src={"/NP.svg"}
                          alt="np"
                          width={23}
                          height={23}
                        />
                      )}
                      {row.results[item]?.consistent ? (
                        <Image
                          src={"/CO.svg"}
                          alt="co"
                          width={23}
                          height={23}
                        />
                      ) : (
                        <Image
                          src={"/IN.svg"}
                          alt="in"
                          width={23}
                          height={23}
                        />
                      )}
                    </div>
                  </div>
                </td>
              );
            })}

            <td>{/* Placeholder for trend */}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ToxiCologyResultsTable;
