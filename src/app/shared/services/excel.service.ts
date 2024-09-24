import {Injectable} from '@angular/core';
import {utils, write} from "xlsx";
import FileSaver from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  exportAsExcel(data: any[], columns: string[], name: string) {
    const worksheet = utils.json_to_sheet(data);

    utils.sheet_add_aoa(worksheet, [columns], {origin: "A1"});
    worksheet["!cols"] = this.getColumnLengths(data, columns);

    const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = write(workbook, {bookType: 'xlsx', type: 'array'});

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(blob, name + '.xlsx');
  }

  private getColumnLengths(data: any[], cols: string[]): { wch: number }[] {
    const maxContentWidth: number[] = Object.values(data.reduce((max, obj) => {
      Object.keys(obj).forEach(property => {
        max[property] = Math.max(obj[property]?.length || 10, max[property] || 10);
      });
      return max;
    }, {}));
    return maxContentWidth.map((len, index) => ({wch: Math.max(len, cols[index].length)}));
  }
}
