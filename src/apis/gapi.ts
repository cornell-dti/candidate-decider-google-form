// Unfortunate compromise to adapt to the global gapi library.
import { SheetData } from '../types';

// Client ID and API key from the Developer Console
const CLIENT_ID = '81814583566-co2eovvgsl6kn1if48q9dtp8793m4qna.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDjq1ttH3qdmxtWk9qpH9o9K3FpYvLZcfc';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let googleAPILoaded = false;

// Convert Google API script loading into a promise for later usage.
// Google please try harder to make it more friendly to modern tooling :(
const dynamicallyLoadGoogleAPIScriptPromise = new Promise<void>((resolve) => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    googleAPILoaded = true;
    resolve();
  };

  document.body.appendChild(script);
});

function initializeGoogleAPI(): Promise<void> {
  if (googleAPILoaded) return Promise.resolve();
  return dynamicallyLoadGoogleAPIScriptPromise;
}

/** Initializes the API client library and sets up sign-in state listeners. */
async function initializeClient() {
  await initializeGoogleAPI();
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(error, null, 2));
  }
}

export function handleClientLoad(accessToken: string, onLoad: () => void): void {
  // Before we reach any code that contains `gapi`, we must initialize it first.
  initializeGoogleAPI().then(() =>
    gapi.load('client:auth2', async () => {
      await initializeClient();
      gapi.client.setToken({ access_token: accessToken });
      onLoad();
    })
  );
}

export const getSheetData = async (
  spreadsheetId: string,
  range: string
): Promise<SheetData | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any;
  try {
    // @ts-expect-error: sheets exists
    response = await gapi.client.sheets.spreadsheets.values.get({ spreadsheetId, range });
  } catch (error) {
    return null;
  }
  const table: readonly string[][] = response.result.values;
  const header = table[0];
  const content = table.slice(1);
  return { header, content };
};
