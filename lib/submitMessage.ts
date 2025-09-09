"use server";

const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// const client = await auth.getClient()

const googleSheets = google.sheets({
  version: "v4",
  auth,
});

const spreadSheetID = "11J0hk-_fGePB_EKCg7IqGB-gYU6QbYu2SytOc__lEs8";

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
