import datePipe from "@/lib/Pipes/datePipe";
import { TextField } from "@mui/material";
import Image from "next/image";

const ResultsNavBar = ({ patientsData }: any) => {
  return (
    <div style={{ display: "flex" }}>
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
              {patientsData?.dob
                ? datePipe(patientsData?.dob, "MM-DD-YYYY")
                : "--"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultsNavBar;
