import { SheetData } from './types';

// Client ID and API key from the Developer Console
const CLIENT_ID = '81814583566-co2eovvgsl6kn1if48q9dtp8793m4qna.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDjq1ttH3qdmxtWk9qpH9o9K3FpYvLZcfc';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

/** Initializes the API client library and sets up sign-in state listeners. */
async function initializeClient(onLoad: () => void) {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    });
  } catch (error) {
    alert(JSON.stringify(error, null, 2));
  }
  onLoad();
}

export const handleClientLoad = (onLoad: () => void): void =>
  gapi.load('client:auth2', () => initializeClient(onLoad));

// @ts-ignore
export const signIn = (): Promise<void> => gapi.auth2.getAuthInstance().signIn();
// @ts-ignore
export const isSignedIn = (): boolean => gapi.auth2.getAuthInstance().isSignedIn.get();

export const getSheetData = async (spreadsheetId: string, range: string): Promise<SheetData> => {
  // @ts-ignore
  const response = await gapi.client.sheets.spreadsheets.values.get({ spreadsheetId, range });
  const table: readonly string[][] = response.result.values;
  const header = table[0];
  const content = table.slice(1);
  return { header, content };
};
