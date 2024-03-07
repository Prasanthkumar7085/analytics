import { Typography } from "@mui/material";

const ErrorMessages = ({
  errorMessages,
  keyname,
}: {
  errorMessages: any[];
  keyname: string;
}) => {
  return (
    <Typography
      variant="subtitle1"
      color="error"
      fontSize="13px"
      sx={{
        color: " #BF1B39 !important",
        display: errorMessages?.length ? "" : "none",
        fontFamily: "'Poppins',sans-serif !important",
        fontWeight: "500",
        letterSpacing: "0px",
        lineHeight: "14px",
      }}
    >
      {errorMessages &&
        errorMessages?.find((error: any) => error.path === keyname)?.message}
    </Typography>
  );
};
export default ErrorMessages;
