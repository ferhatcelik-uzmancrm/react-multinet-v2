import Papa from "papaparse";
import * as XLSX from "xlsx";

export const handleExport = (
  data: any[],
  name: string,
  format: "csv" | "xlsx"
) => {
  let blob: Blob;

  if (format === "csv") {
    const csv = Papa.unparse(data);
    blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  } else if (format === "xlsx") {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } else {
    throw new Error("Unsupported format");
  }

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name + (format === "csv" ? ".csv" : ".xlsx");
  link.click();
};
