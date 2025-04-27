/**
 * Inserts data into a Google Sheets worksheet. If the worksheet does not exist, it is created.
 * @param {string} reportType - The name of the worksheet to insert data into.
 * @param {Array<Object>} results - The data to insert (array of objects).
 */
// Accepts the full API response as 'responseObj', extracts reportName, start_date, end_date, and results
export function createSheetAndInsertData(responseObj: { request: { reportName: string, start_date: string, end_date: string }, results: any[] }) {
  const { reportName, start_date, end_date } = responseObj.request;
  const results = responseObj.results;
  const sheetName = `${reportName}_${start_date}_${end_date}`;
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  if (results && results.length > 0) {
    const headers = Object.keys(results[0]);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const dataRows = results.map(row => headers.map(h => row[h]));
    sheet.getRange(2, 1, dataRows.length, headers.length).setValues(dataRows);
  }
}
