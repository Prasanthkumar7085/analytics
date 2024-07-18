const ErrorsTable = ({ errors, notExisted, existed }: any) => {
  return (
    <div id="ErrorsTablecontainer">
      <div className="table">
        <h2>Errors</h2>
        <div className="tableContainer min-w-[600px]">
          <table>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Accession ID</th>
                <th>Error Message</th>
              </tr>
            </thead>
            <tbody>
              {errors?.length > 0
                ? errors.map((error: any, index: any) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{error.accession_id}</td>
                    <td>{error.message}</td>
                  </tr>
                ))
                : ""}
            </tbody>
          </table>
        </div>

      </div>

      {/* <div className="table">
        <h2>Not Existed</h2>
        <table>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Accession ID</th>
            </tr>
          </thead>
          <tbody>
            {notExisted?.length > 0
              ? notExisted.map((item: any, index: any) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.accessionId}</td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>

      <div className="table">
        <h2>Existed</h2>
        <table>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Accession ID</th>
            </tr>
          </thead>
          <tbody>
            {existed?.length > 0
              ? existed.map((item: any, index: any) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.accessionId}</td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};
export default ErrorsTable;
