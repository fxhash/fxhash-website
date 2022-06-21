import { ParseResult } from "papaparse";

export const hasCsvMissedColumns = (results: ParseResult<any>, cols: string[]): false | string[] => {
  if (!results?.meta?.fields) return cols;
  const missingCols = cols.reduce((acc, col) => {
    if (results.meta.fields!.indexOf(col) === -1) {
      acc.push(col);
    }
    return acc;
  }, [] as string[])
  return missingCols.length > 0 ? missingCols : false;
}
export const getDataFromCsvFile = async (file: File): Promise<ParseResult<any>> => {
  const Papa = await import('papaparse');
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete (results, file) {
        resolve(results)
      },
      error (err, file) {
        reject(err)
      }
    })
  })
}
