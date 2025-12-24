import { google } from 'googleapis';

// Initialize Google Sheets API
export async function getGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Append data to Google Sheet starting from A7 for a specific user
export async function appendToGoogleSheet(data: {
  date: string;
  startingMileage: number;
  endingMileage: number;
  distance: number;
  fuelRefilled: number;
  pricePerLiter: number;
  totalAmount: number;
  fuelConsumptionRate: number;
  activity: string;
  notes: string;
}, userId: string, userName: string) {
  try {
    const sheets = await getGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set');
    }

    // Always use "p'jaguar" sheet for all submissions
    const sheetName = "p'jaguar";
    
    // For "p'jaguar" sheet, we assume it already exists and never create it
    // If it doesn't exist, the user should create it manually in Google Sheets
    // This prevents errors from trying to create duplicate sheets

    // First, find the next empty row starting from A8 to A38 in the user's sheet
    const START_ROW = 8;
    const END_ROW = 38;
    const MAX_ROWS = END_ROW - START_ROW + 1; // 31 rows (A8 to A38)
    
    const range = `${sheetName}!A${START_ROW}:A${END_ROW}`; // Check A8 to A38 in user's sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values || [];
    let nextRow = START_ROW; // Start from row 8

    // Find the first empty row within the allowed range (A8 to A38)
    for (let i = 0; i < values.length && i < MAX_ROWS; i++) {
      if (!values[i] || values[i].length === 0 || !values[i][0]) {
        nextRow = START_ROW + i;
        break;
      }
      // If we've checked all rows and all are filled
      if (i === values.length - 1 && i < MAX_ROWS - 1) {
        nextRow = START_ROW + values.length;
      }
    }

    // Validate that nextRow is within the allowed range (8-38)
    if (nextRow > END_ROW) {
      throw new Error(`All rows from A${START_ROW} to A${END_ROW} are already filled. Cannot add more data to this user's sheet.`);
    }

    // If all rows are filled, throw an error
    if (nextRow > END_ROW || (values.length === MAX_ROWS && values[values.length - 1] && values[values.length - 1][0])) {
      throw new Error(`All rows from A${START_ROW} to A${END_ROW} are already filled for user ${userName}. Please contact administrator.`);
    }

    // Format the date
    const formattedDate = data.date ? new Date(data.date).toLocaleDateString('th-TH') : '';

    // Prepare the row data in the order: Date, Starting Mileage, Ending Mileage, Distance, Fuel, Price/Liter, Total, Consumption Rate, Activity, Notes
    const rowData = [
      formattedDate,
      data.startingMileage || '',
      data.endingMileage || '',
      data.distance || '',
      data.fuelRefilled || '',
      data.pricePerLiter || '',
      data.totalAmount || '',
      data.fuelConsumptionRate || '',
      data.activity || '',
      data.notes || '',
    ];

    // Append the data to the specific row in the user's sheet
    const rangeToUpdate = `${sheetName}!A${nextRow}:J${nextRow}`;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: rangeToUpdate,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return { success: true, row: nextRow, sheetName };
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    throw error;
  }
}

// Map user names to their corresponding Google Sheet tab names
// Add more mappings here as needed
function getUserSheetName(userName: string): string {
  // For users where username matches the sheet name exactly, use it directly
  // For cases where username differs from sheet name, add mapping here:
  const userSheetMap: { [key: string]: string } = {
    // Example: 'UserName': 'Sheet Tab Name',
  };

  // If mapping exists, use it; otherwise use sanitized user name
  // Since username is now "p'jaguar" which matches the sheet, it will use it directly
  return userSheetMap[userName] || sanitizeSheetName(userName);
}

// Sanitize sheet name (Google Sheets has restrictions on sheet names)
function sanitizeSheetName(name: string): string {
  // Remove invalid characters: / \ ? * [ ]
  // Sheet names cannot be longer than 100 characters
  return name
    .replace(/[\/\\\?*\[\]]/g, '_')
    .substring(0, 100)
    .trim() || 'Sheet1';
}

// Create a new sheet for a user
async function createNewSheet(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
): Promise<void> {
  try {
    // Create a new sheet for this user
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    // Add headers to the new sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:J1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          'ว/ด/ป',
          'เลขไมล์เรี่มต้น',
          'เลขไมล์สิ้นสุด',
          'ระยะทางที่ถึง(กม.)',
          'เติมน้ำมัน(ลิตร)',
          'ราคา/ลิตร( บาท)',
          'รวมเป็นเงิน(บาท)',
          'อัตราสิ้นเปลือง(กม./ลิตร)',
          'กิจกรรมที่ปฏิบัติงาน',
          'หมายเหตุ'
        ]],
      },
    });
  } catch (error) {
    console.error('Error creating new sheet:', error);
    throw error;
  }
}

// Test connection to Google Sheets
export async function testGoogleSheetsConnection() {
  try {
    const sheets = await getGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set');
    }

    // Try to read the first cell to test connection
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:A1',
    });

    return { success: true, connected: true };
  } catch (error) {
    console.error('Error testing Google Sheets connection:', error);
    throw error;
  }
}

