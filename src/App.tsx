import React, { ReactElement, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { SheetData } from './types';
import { getSheetData } from './apis/gapi';
import ReviewPanels from './ReviewPanels';
import { getAppUser } from './apis/firebase-auth';

const theme = createMuiTheme();

const Wrapper = ({ children }: { readonly children: ReactElement }): ReactElement => (
  <MuiThemeProvider theme={theme}>
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" style={{ flex: '1 1 auto' }}>
            Candidate Decider
          </Typography>
          <Typography variant="h6" color="inherit">
            Welcome {getAppUser().displayName}!
          </Typography>
          <Button style={{ color: 'white' }} onClick={() => firebase.auth().signOut()}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  </MuiThemeProvider>
);

const searchParameters = (() => {
  const parameterList = window.location.search
    .substring(1)
    .split('&')
    .map(part => part.split('='));
  const map = new Map(parameterList as [string, string][]);
  const spreadsheetId = map.get('spreadsheetId');
  const range = map.get('range');
  if (spreadsheetId == null || range == null) {
    return null;
  }
  return { spreadsheetId: decodeURIComponent(spreadsheetId), range: decodeURIComponent(range) };
})();

const MISSING_PARAMETER_MESSAGE = 'spreadsheetId and range must be in search parameters!';
const FAILED_SHEET_FETCH_MESSAGE =
  "Failed to fetch sheet data due to potential auth failure. Maybe you are not granted the sheet's read permission.";

const App = () => {
  const [sheetData, setSheetData] = useState<SheetData | string>('Loading SheetData...');
  useEffect(() => {
    if (searchParameters == null) {
      setSheetData(MISSING_PARAMETER_MESSAGE);
      return;
    }
    const fetchAndSetSheetData = (): void => {
      getSheetData(searchParameters.spreadsheetId, searchParameters.range).then(data => {
        setSheetData(data ?? FAILED_SHEET_FETCH_MESSAGE);
        setTimeout(() => fetchAndSetSheetData(), 10000);
      });
    };
    fetchAndSetSheetData();
  }, []);
  if (searchParameters == null) {
    if (typeof sheetData !== 'string') {
      throw new Error();
    }
    return (
      <Wrapper>
        <div>{sheetData}</div>
      </Wrapper>
    );
  }
  if (typeof sheetData === 'string') {
    return (
      <Wrapper>
        <div>{sheetData}</div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <ReviewPanels
        spreadsheetId={searchParameters.spreadsheetId}
        range={searchParameters.range}
        sheetData={sheetData}
      />
    </Wrapper>
  );
};

export default App;
