# Testing with User "Jaguar"

## Quick Test Steps

### Before Testing - Make Sure You Have:

1. ✅ **Google Sheets API credentials set up** (see `GOOGLE_SHEETS_SETUP.md`)
2. ✅ **`.env.local` file created** with your Google credentials
3. ✅ **Google Sheet shared** with service account email
4. ✅ **Dev server running** (`npm run dev`)

### Test Steps:

1. **Login as Jaguar:**
   - Go to the app (usually `http://localhost:3000`)
   - Username: `Jaguar`
   - Password: `jaguar123`
   - Click "Sign In"

2. **Go to the Form:**
   - Click on "รายงานบันทึกการใช้รถยนต์" box in the dashboard
   - You'll be taken to the form page

3. **Fill Out the Form:**
   - Fill in all the fields (Date, Starting Mileage, Ending Mileage, etc.)
   - Click "บันทึกข้อมูล" (Submit)

4. **What Should Happen:**
   - ✅ The existing tab named "Jaguar" will be used in your Google Sheet
   - ✅ Your data will be written to the first empty row (starting from A8)
   - ✅ You'll see a success message showing the row number and sheet name

5. **Verify in Google Sheets:**
   - Open your Google Sheet
   - Look for the existing tab named "Jaguar"
   - Check the first empty row (usually A8, A9, A10, etc.) - your data should be there

### Troubleshooting:

**If you see an error:**
- Check the browser console (F12) for error messages
- Check the terminal/command prompt where `npm run dev` is running
- Verify your `.env.local` file has correct credentials
- Make sure the Google Sheet is shared with the service account email

**Common Issues:**

1. **"GOOGLE_SPREADSHEET_ID is not set"**
   - Make sure `.env.local` exists in the project root
   - Restart the dev server after creating `.env.local`

2. **"The caller does not have permission"**
   - Share your Google Sheet with the service account email
   - Give it "Editor" permission

3. **Data not appearing**
   - Check if a tab "Jaguar" was created
   - Refresh the Google Sheet
   - Check browser console for errors

### Next Submissions:

- Second submission will go to row A8
- Third submission will go to row A9
- And so on, up to row A37 (31 total entries)

