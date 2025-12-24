# Google Sheets Integration Setup Guide

This guide will help you connect your app to Google Sheets so data is automatically saved when users submit forms.

## Important: Google Cloud Project Scope

**The Google Cloud Console project is for the WHOLE APP**, not just this one form. Once set up:
- ✅ All forms in your app can use the same Google Sheets API credentials
- ✅ All features that need Google Sheets access will work
- ✅ You only need to set this up once for the entire application

If you add more forms or features later that need Google Sheets, they will use the same service account and credentials.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Chein Production & Products" or "Chein App")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - Service account name: `chein-sheets-service`
   - Service account ID: (auto-generated)
   - Click "Create and Continue"
4. Skip role assignment (click "Continue")
5. Click "Done"

## Step 4: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create" - this will download a JSON file

## Step 5: Share Your Google Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button (top right)
3. Copy the **service account email** from the JSON file you downloaded (it looks like: `your-service@project.iam.gserviceaccount.com`)
4. Paste it in the "Add people" field
5. Give it "Editor" permission
6. Click "Send" (you can uncheck "Notify people")

## Step 6: Get Your Spreadsheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` part (the long string between `/d/` and `/edit`)

## Step 7: Set Up Environment Variables

1. Open the downloaded JSON file from Step 4
2. Copy the following values:
   - `client_email` → This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → This is your `GOOGLE_PRIVATE_KEY`

3. Create a file named `.env.local` in the root of your project
4. Add the following (replace with your actual values):

```env
GOOGLE_SPREADSHEET_ID=1QaXDq6BzJMBMOdj1ruhm9LmqCPm7T5FjXYBaJsXqUNc
GOOGLE_SERVICE_ACCOUNT_EMAIL=chein-sheets-service@chein-production-and-products.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nnMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLk7gXx06dL7+A\nhTcBiZx+0WlzLKFaxHKXN1qlakDjecu0epurBvhqcUGRjFPza1N4v44vRyenUf6/\nsOYMvmfwgH2MUyV8VgSAiFBRvmtP0cknjSEGYrVuMin3Wn/tC+BtHHoSDf+eFiG3\n6bImlL6Qw0he14yqo89nocCi0Ah3+KQmhk5R82tTwycCgjTNBem+aPWOy5QdZCHH\n8VOhHSy7hW9C9A+Zv4TFK+MpgU5alkFtmjuYExyDI2Xytn14CLiKjRg+s4IpgMk3\njwhGjESNHRcgDroDnMAednDxQRANZjs9kQm7QUdJzzA9jqGXWplTflGQVQ5qa5Af\nIf2N5p4RAgMBAAECggEAA8SOrzz7JOBf0VwrKT9/up6mWUanEAf2WCYNgCXWwIcO\nGL+TWZTfUeau+Eec5v1SaLfrOiTdXw90JojarHt1LxpiXc+iUC+Y4CagYu+XlZ0m\nwDvwflQNyCshmPWvNrGmCZWcd5tT+EbFVhMF6bN40UiAp/BiHCc8P656wzX/Dsuu\nNZzyrZuuHkdgqYov+vGqs9ygHvEcWZYoucxb4TeA0r6OYiuaswGzFxyZzwWtEfz/\nHUZTSAoYV4M8Cj69RYe7n3XMR0gJhMzPOwbAAPcGHJE8CcAFH8pG39vhnFU5Y/Ds\n0Fd2hitHndqDTzv++FKeLx/A32X++9cLRlTbbLFtwQKBgQDwPxCWlsTnAWjntJWZ\nCogIiVFadWfxvn08EfuFMbQaJhMaRBzYxAJ0LZBfr1wpyTu0zWogm1LE2NVjE46h\nZMaoWhW1wpWvyzhQTGvAa5KzC4h67I+pNrT0sfuMu5qIgTCzTMqN/TL8Od1Uhzd8\n+1/zL2+H4U85cV24hMQaaU7uoQKBgQDY7RlEadLl32GwyjSS3iKaXcPmbmvrCYmS\nYTZ7utxTfgTG1DpXKhN4mAZA49MueGHn4DYt0TiZGsEPUcUA7SutQIgu+sm3ADKs\nrdSl1+0k3UWnVCdNab1YxmoQ+Cv940pT3j/pb7VKiGusJ8C0xW7Fd224DhPiE0NN\negewHCepcQKBgQC6ublx4aMOjLj1hhTTyyypvdi+PwxYBx8dJjjgcB40SK2GN7RY\nAhiKJbPVut0eGSrPvuwihbaSCpnnlJbB+CqzRLkk+SUQahnNx2fkOXfeszMTn3OV\nKFEC8qa53kIgoJCyexffvhD3mx3cie/lsxcDUzYTXVoPIn6eYIpuoLTZoQKBgCpI\nHJKvJcJUhhAVeaXe0lPQTuzNPQ+07jGv7RS02VkUyQ2QNEblFqJ8z0s6nOED6eFu\nXGEV1LhS9Kptv75sfATq/SBbFZIr4bSytS4WJkz3LCpvRrHaGGQDWI0yMjDsaoJq\nYX64nVeHu6T0oqUZjnvCyYoEhG+eXZHuZS04b6qhAoGAeoNwXdbUQmOKoMvdhPho\nDJzASbMJ9dUJdPx/LUsQ949KLk1m4skX6K+z0RdWq1w31o/YB87ZKJu9v45zoUOS\nBoxZSHy3W6cJWxU9AOP6lHdG3qGqFtafYLb24cDM6WdyRASHyHoSPStMYhdSjleQ\n/OeJvur2VZNg+T/Q6SwoMjM=\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- The private key must be in quotes and keep the `\n` characters
- The private key should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`
- Keep `.env.local` secret - never commit it to git!

## Step 8: Prepare Your Google Sheet

### Important: Per-User Sheets

**Each user will automatically get their own tab (sheet) in your Google Spreadsheet!**

When a user submits the form for the first time:
- A new tab will be automatically created with the user's name as the tab name
- Headers will be automatically added to row 1
- Data will be written to rows 7 through 37 (A7, A8, A9, ... A37)
- **Each user has 31 rows available** (rows 7 to 37)

**You don't need to manually create tabs** - the system does this automatically for each user.

The form will automatically find the first empty row starting from A7 in each user's tab (up to A37) and fill in:
- Column A: Date (ว/ด/ป)
- Column B: Starting Mileage (เลขไมล์เรี่มต้น)
- Column C: Ending Mileage (เลขไมล์สิ้นสุด)
- Column D: Distance (ระยะทางที่ถึง)
- Column E: Fuel Refilled (เติมน้ำมัน)
- Column F: Price Per Liter (ราคา/ลิตร)
- Column G: Total Amount (รวมเป็นเงิน)
- Column H: Fuel Consumption Rate (อัตราสิ้นเปลือง)
- Column I: Activity (กิจกรรมที่ปฏิบัติงาน)
- Column J: Notes (หมายเหตุ)

**Make sure:**
- The service account has Editor access to your Google Sheet
- Your spreadsheet can have multiple tabs (sheets) - this is the default

## Step 9: Test the Connection

1. Start your development server: `npm run dev`
2. Fill out and submit the form
3. Check your Google Sheet - data should appear starting from row 7, then 8, 9, etc.

## Troubleshooting

### Error: "GOOGLE_SPREADSHEET_ID is not set"
- Make sure `.env.local` exists in the root directory
- Restart your dev server after creating/updating `.env.local`

### Error: "The caller does not have permission"
- Make sure you shared the Google Sheet with the service account email
- Give it "Editor" permission

### Error: "Invalid credentials"
- Check that your `GOOGLE_PRIVATE_KEY` is correctly formatted with quotes and `\n`
- Make sure the private key includes the BEGIN and END markers

### Data not appearing
- Check the browser console for errors
- Check the server terminal for error messages
- Verify the spreadsheet ID is correct
- Check if a new tab was created with the user's name
- Make sure there are empty rows starting from A7 in the user's tab

### "All rows are already filled" error
- Each user has rows 7-37 available (31 rows total)
- If a user has filled all 31 rows, they cannot add more data
- You may need to create a new spreadsheet or extend the range if needed
- Contact the administrator if you need more rows per user

### Sheet name issues
- If a user's name contains special characters, they will be replaced with underscores
- Sheet names are limited to 100 characters
- If multiple users have the same name, they will share the same tab

## Security Note

- Never commit `.env.local` to git (it should be in `.gitignore`)
- Keep your service account credentials secure
- Only share your Google Sheet with the specific service account email

