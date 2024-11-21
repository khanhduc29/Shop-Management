import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { Slide } from "@mui/material";

interface SnackbarAlertProps {
  open: boolean;
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

const SlideTransition = (props: any) => {
  return <Slide {...props} direction="down" />;
};

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  onClose,
  message,
  severity,
}) => {

  const getAlertStyles = (severity: "success" | "error" | "warning" | "info") => {
    switch (severity) {
      case "success":
        return { backgroundColor: "#4caf50", color: "#ffffff" };
      case "error":
        return { backgroundColor: "#f44336", color: "#ffffff" };
      case "warning":
        return { backgroundColor: "#ff9800", color: "#ffffff" };
      case "info":
        return { backgroundColor: "#2196f3", color: "#ffffff" };
      default:
        return {};
    }
  };
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        sx={{ zIndex: 9999, marginTop: "20px" }}
      >
        <Alert
          onClose={onClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", ...getAlertStyles(severity), }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackbarAlert;
