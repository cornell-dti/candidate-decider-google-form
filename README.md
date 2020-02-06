# candidate-decider-google-form

Decide which candidate to interview with data from Google Form.

## Getting Started

Visit `https://candidate-decider-form.firebaseapp.com/?spreadsheetId=[your id]&range=[your range]`,
where range has syntax `[Sheet name]![start cell]:[end cell]`. (e.g. `Sheet1!A1:S1000`)

## Architecture

This web app uses serverless Firebase. It uses Google Sheets API to fetch data from the Google
spreadsheet you are interested in, and uses Firestore to store and display realtime voting data.

## Assumption

To ensure desired security properties described in a later section, the system makes a few
assumptions about the Google sheet:

- The sheet is a `m * n` matrix of strings.
- The sheet's first row represents the header of the table.
- Candidate information in the sheet has a stable order. (i.e. candidate A is always in row 42)

These assumptions are true if the form is managed by Google Form and people don't manually edit it.

## Scalability

The system can potentially handle unbounded number of different rating records for different
spreadsheet.

Given that I designed this system mostly for college club recruitment, I assumed that the size of
the candidates and reviewers will not go crazily big. Therefore, the performance may serious hurt
if the data size is too big, since each vote takes `O(n)`, where `n` is number of candidates.

## Security

The system concerns about the confidentiality of candidate data and their ratings. By design,
within a group, reviewer's ratings are public to allow transparent discussion of decisions. By
design, the system's confidentiality depends on the confidentiality of the spreadsheet of
applicant's data.

### Confidentiality of Candidate Data

Candidate data is fetched from Google Sheet API and never sent to or stored on the server side.
Assuming the Google Sheet's permission is properly configured, unintended access will be prevented
by Google at the time of sheet data fetching.

### Confidentiality of Candidate Ratings

Assume attacker Eve wants to figure out some candidate ratings. Eve needs to first guess the correct
sheet id, which is already impossible. Then Eve needs to figure out the mapping between candidate
order and candidate name, which is impossible to get without the access to the real spreadsheet
data.
