// Utility for creating worksheet and inserting data in Google Sheets via Google Apps Script
// This function must be called using google.script.run from the client

/**
 * Calls the Apps Script backend to create a sheet and insert data.
 * @param {string} reportType - The sheet name to use.
 * @param {Array<Object>} data - Array of objects to insert as rows.
 * @returns {Promise<string>} Resolves with success message or rejects with error.
 */
/**
 * Fetches data from the API and inserts it into a Google Sheet via Apps Script.
 * @param {string} reportType - The sheet name to use.
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<string>} Resolves with success message or rejects with error.
 */
// eslint-disable-next-line import/prefer-default-export
export function createSheetAndInsertData(reportType, startDate, endDate) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://6ee7-88-71-223-83.ngrok-free.app/reports?reportName=${encodeURIComponent(reportType)}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;
      const resp = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });
      if (!resp.ok) throw new Error(`API error: ${resp.status} ${resp.statusText}`);
      const data = await resp.json();
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Unexpected API response: missing results array');
      }
      if (!window.google || !window.google.script || !window.google.script.run) {
        reject('Google Apps Script client API is not available.');
        return;
      }
      window.google.script.run
        .withSuccessHandler(() => {
          resolve('Data imported successfully!');
        })
        .withFailureHandler((err) => {
          reject(err.message || err);
        })
        .createSheetAndInsertData(data);
    } catch (err) {
      reject(err.message || err);
    }
  });
}
