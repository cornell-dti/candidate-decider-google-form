import React, { ReactElement, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { SheetData } from './types';
import { getSheetData } from './gapi';
import ReviewPanels from './ReviewPanels';
import { getAppUser } from './firebase-auth';

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
        </Toolbar>
      </AppBar>
      {children}
    </div>
  </MuiThemeProvider>
);

const searchParameters = (() => {
  const parameterList = window.location.search.substring(1).split('&').map(part => part.split('='));
  const map = new Map(parameterList as [string, string][]);
  const spreadsheetId = map.get('spreadsheetId');
  const range = map.get('range');
  if (spreadsheetId == null || range == null) {
    return null;
  }
  return { spreadsheetId: decodeURIComponent(spreadsheetId), range: decodeURIComponent(range) };
})();

export default () => {
  const [sheetData, setSheetData] = useState<SheetData | string>('Loading SheetData...');
  useEffect(() => {
    if (searchParameters == null) {
      setSheetData('spreadsheetId and range must be in search parameters!');
      return () => {};
    }
    const interval = setInterval(() => {
      getSheetData(searchParameters.spreadsheetId, searchParameters.range)
        .then(data => setSheetData(data));
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  if (searchParameters == null) {
    if (typeof sheetData !== 'string') {
      throw new Error();
    }
    return <Wrapper><div>{sheetData}</div></Wrapper>;
  }
  return (
    <Wrapper>
      <>
        <button
          type="button"
          style={{ display: 'none' }}
          onClick={() => firebase.auth().signOut()}
        >
          Sign Out
        </button>
        {typeof sheetData === 'string'
          ? <div>{sheetData}</div>
          : <ReviewPanels spreadsheetId={searchParameters.spreadsheetId} sheetData={sheetData} />}
      </>
    </Wrapper>
  );
};
