import { momentWithTimezone } from "@/lib/Pipes/timeFormat";

const ToxiCologyResultsTable = () => {
  let data = [
    {
      id: 37,
      patientId: "P0000000002",
      firstName: "sai Krishna",
      lastName: "Sagadaboina",
      middleName: "krishna",
      dob: "1999-02-26",
      gender: "MALE",
      resultDate: "2020-03-01T00:00:00.000Z",
      mam6: {
        result: 50,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      aminoclonazepam7: {
        result: 25,
        positive: false,
        consistent: true,
        prescribed: true,
      },
      alphaHydroxyalprazolam: {
        result: 75,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      alprazolam: {
        result: 100,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      amitriptyline: {
        result: 30,
        positive: false,
        consistent: true,
        prescribed: false,
      },
      benzoylecgonine: {
        result: 40,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      buprernorphine: {
        result: 60,
        positive: true,
        consistent: false,
        prescribed: true,
      },
      butalbital: {
        result: 70,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      carisoprodol: {
        result: 80,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      clonazepam: {
        result: 90,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      codeine: {
        result: 100,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      cotinine: {
        result: 110,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      cyclobenzaprine: {
        result: 120,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      dextromethorphan: {
        result: 130,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      diazepam: {
        result: 140,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      dihydrocodeine: {
        result: 150,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      doxepin: {
        result: 160,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      eddp: {
        result: 170,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      fentanyl: {
        result: 180,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      flunitrazepam: {
        result: 190,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      flurazepam: {
        result: 200,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      gabapentin: {
        result: 210,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      hydrocodone: {
        result: 220,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      hydromorphone: {
        result: 230,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      imipramine: {
        result: 240,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      levorphanol: {
        result: 250,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      lorazepam: {
        result: 260,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      mda: {
        result: 270,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      mdma: {
        result: 280,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      mdpv: {
        result: 290,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      meperidine: {
        result: 300,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      meprobamate: {
        result: 310,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      methadone: {
        result: 320,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      methamphetamine: {
        result: 330,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      methylphenidate: {
        result: 340,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      morphine: {
        result: 350,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      naltrexone: {
        result: 360,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      naloxone: {
        result: 370,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      norbuprenorphine: {
        result: 380,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      nordiazepam: {
        result: 390,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      norfentanyl: {
        result: 400,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      normeperidine: {
        result: 410,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      noroxycodone: {
        result: 420,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      norquetaipine: {
        result: 430,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      norsetraline: {
        result: 440,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      nortriptyline: {
        result: 450,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      oDesmethyltramadol: {
        result: 460,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      oxazepam: {
        result: 470,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      oxycodone: {
        result: 480,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      oxymorphone: {
        result: 490,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      pcp: {
        result: 500,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      phenobarbital: {
        result: 510,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      phentermine: {
        result: 520,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      pregabalin: {
        result: 530,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      propoxyphene: {
        result: 540,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      quetiapine: {
        result: 550,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      sertraline: {
        result: 560,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      tapentadol: {
        result: 570,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      temazepam: {
        result: 580,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      thcCooh: {
        result: 590,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      tramadol: {
        result: 600,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      zolpidem: {
        result: 610,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      zolpidemPhenyl4Cooh: {
        result: 620,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      norhydrocodone: {
        result: 630,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      hydroxybupropion: {
        result: 640,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      mitragynine: {
        result: 650,
        positive: true,
        consistent: true,
        prescribed: false,
      },
      hydroxymitragynine7: {
        result: 660,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      xylazine: {
        result: 670,
        positive: true,
        consistent: false,
        prescribed: false,
      },
      hydroxyXylazine4: {
        result: 680,
        positive: true,
        consistent: true,
        prescribed: true,
      },
      labId: "LAB001",
      createdAt: "2024-07-15T09:40:27.982Z",
      updatedAt: "2024-07-16T05:34:21.280Z",
    },
  ];

  const groupedByDate = data.reduce((acc: any, obj: any) => {
    const date: any = obj.resultDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(obj);
    return acc;
  }, {});

  console.log(groupedByDate);

  return (
    <table>
      <thead>
        <tr>
          <th style={{ minWidth: "150px" }}>CONFIRMATION</th>
          <th style={{ minWidth: "150px" }}>CUTOFF</th>
          <th style={{ minWidth: "150px" }}>RANGES</th>

          {Object.keys(groupedByDate)?.map((result: any, resultIndex: any) => (
            <th style={{ minWidth: "100px" }} key={resultIndex}>
              {momentWithTimezone(result?.date)}
            </th>
          ))}
          <th style={{ minWidth: "150px" }}>Trend</th>
        </tr>
      </thead>
      {/* <tbody>
          {patientResultsData[title][0].results.map(
            (test: any, testIndex: any) => (
              <tr key={testIndex}>
                <td>{test.result_name ? test.result_name : "--"}</td>
                <td>
                  {test.reference_range + " " + test.units
                    ? test.reference_range + " " + test.units
                    : "--"}
                </td>
                {patientResultsData[title].map(
                  (result: any, resultIndex: any) => (
                    <td key={resultIndex}>
                      {
                        result.results?.find(
                          (ite: any) => ite.result_name == test.result_name
                        )?.result
                      }
                    </td>
                  )
                )}
                <td>
                  <div
                    onClick={() => {
                      handleGraphClick(test, title);
                      setPatientSingleRowData(test);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <LineGraphForResults
                      patientsData={patientsData}
                      graphValuesData={getGraphValuesData(
                        patientResultsData,
                        title,
                        test
                      )}
                    />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody> */}
    </table>
  );
};
export default ToxiCologyResultsTable;
