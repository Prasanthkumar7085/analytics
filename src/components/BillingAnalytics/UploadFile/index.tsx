import BilledAndRevenueTabs from "@/components/core/BilledAndRevenueTabs";
import {
  uploadBillingDataAPI,
  uploadRevenueDataAPI,
} from "@/services/BillingAnalytics/uploadFileAPIs";
import { Grid, IconButton } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import CloseIcon from "@mui/icons-material/Close";
import LoadingComponent from "@/components/core/LoadingComponent";
import ErrorsTable from "./ErrorsTable";

const UploadDataWithFile = () => {
  const params = useSearchParams();
  const [selectedTabValue, setSelectedTabValue] = useState<any>("billed");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [renderField, setRenderField] = useState<any>(false);
  const [fileName, setFileName] = useState<string>();
  const [fileData, setFileData] = useState<any>({});
  const defaultErrorMessage =
    "The uploaded CSV file is missing required headers  Or The uploaded CSV file is empty. Please ensure the file includes all necessary headers for processing";
  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    setFileName(file?.name);
    uploadBillingData(file);
  };

  const renderInputFeild = () => {
    setFileName("");
    setFileData({});
    setRenderField(true);
    setTimeout(() => {
      setRenderField(false);
    }, 100);
  };

  const apiCallBasedOnTabs = (payload: any) => {
    let responseData: any;

    if (params?.get("tab") == "billed") {
      responseData = uploadBillingDataAPI(payload);
    } else {
      responseData = uploadRevenueDataAPI(payload);
    }
    return responseData;
  };

  const uploadBillingData = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await apiCallBasedOnTabs(formData);
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        setFileData(response);
      } else {
        if (response?.message == 'syntax error at or near ")"') {
          toast.warning(defaultErrorMessage);
        } else {
          toast.error(response?.message);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    renderInputFeild();
  }, [selectedTabValue]);

  return (
    <div id="uploadFile">
      <div className="totalUploadBlocks">
        <div className="tabsBlock">
          <div >
            <BilledAndRevenueTabs
              selectedTabValue={selectedTabValue}
              setSelectedTabValue={setSelectedTabValue}
            />
          </div>
        </div>
        <Grid container spacing={2} className="mb-5">
          <Grid item xs={12}>
            <div className="upload-container">
              {fileName ? (
                <div>
                  <p> {fileName}</p>
                  <IconButton
                    onClick={() => {
                      renderInputFeild();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                ""
              )}
              <label htmlFor="file-upload" className="upload-label">
                Choose a file
              </label>
              {renderField == false ? (
                <input
                  disabled={fileName ? true : false}
                  id="file-upload"
                  className="file-input"
                  type="file"
                  accept=".csv"
                  onChange={onFileChange}
                />
              ) : (
                ""
              )}
            </div>
          </Grid>
          {Object.keys(fileData)?.length ? (
            <Grid item xs={12}>
              <ErrorsTable
                errors={fileData?.errors}
                notExisted={fileData?.data?.notExisted}
                existed={fileData?.data?.existed}
              />
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </div>
      <LoadingComponent loading={loading} />
      <Toaster richColors closeButton position="top-center" />
    </div>
  );
};
export default UploadDataWithFile;
