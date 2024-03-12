import { MenuItem, Select, TextField } from "@mui/material";
import GlobalDateRangeFilter from "../core/GlobalDateRangeFilter";
import styles from "./salesreps-filters.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SalesRepsFilters = ({
  onUpdateData,
}: {
  onUpdateData: ({
    status,
    search,
  }: Partial<{
    status: string;
    search: string;
  }>) => void;
}) => {
  const params = useSearchParams();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(params.get("search") ? (params.get("search") as string) : "");
    setStatus(params.get("status") ? (params.get("status") as string) : "");
  }, [params]);
  return (
    <div className={styles.filterContainer}>
      <Select
        onChange={(e: any) => {
          setStatus(e.target.value);
          onUpdateData({ status: e.target.value });
        }}
        value={status}
      >
        <MenuItem value={"all"}>All</MenuItem>
        <MenuItem value={"yes"}>Yes</MenuItem>
        <MenuItem value={"no"}>No</MenuItem>
      </Select>
      <GlobalDateRangeFilter onChange={() => {}} />
      <TextField
        placeholder="Search"
        type="search"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value);
          onUpdateData({ search: e.target.value });
        }}
      />
    </div>
  );
};

export default SalesRepsFilters;
