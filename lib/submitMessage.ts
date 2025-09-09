"use server";

const { google } = require("googleapis");

 const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64 || "", "base64").toString()
  );
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// const client = await auth.getClient()

const googleSheets = google.sheets({
  version: "v4",
  auth,
});

const spreadSheetID = process.env.GOOGLE_SHEETS_ID;

export const updateSheets = async (message:string) => {
  try {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId: spreadSheetID,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[message]],
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update message. Please try again");
  }
};
