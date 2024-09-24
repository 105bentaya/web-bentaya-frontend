export interface AlertMessage {
  title: string;
  message?: string;
  severity: "info" | "warn" | "success" | "error";
}
