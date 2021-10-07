import React, { ReactChild } from 'react';

import styles from './Reviewer.module.css';

type Props = { readonly header: readonly string[]; readonly row: readonly string[] };

function formatURLFromLine(line: string): readonly ReactChild[] | ReactChild {
  const matches = line.match(/https?:\/\/[^\s]+/);
  if (matches == null) {
    return line;
  }
  let remainingLine = line;
  const segments: ReactChild[] = [];
  matches.forEach((oneMatch, index) => {
    const [start, remaining] = remainingLine.split(oneMatch, 2);
    segments.push(
      // eslint-disable-next-line react/no-array-index-key
      <span key={index * 2}>{start}</span>,
      // eslint-disable-next-line react/no-array-index-key
      <a key={index * 2 + 1} href={oneMatch} target="_blank" rel="noopener noreferrer">
        {oneMatch}
      </a>
    );
    remainingLine = remaining;
  });
  return segments;
}

function Answer({ answer }: { readonly answer: string }): JSX.Element {
  const normalized = answer?.trim() ?? '';
  if (!normalized) {
    return <code>No answer provided</code>;
  }
  return (
    <>
      {normalized.split('\n').map((line, lineId) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={lineId} className={styles.AnswerText}>
          {formatURLFromLine(line)}
        </div>
      ))}
    </>
  );
}

export default function SingleCandidateViewer({ header, row }: Props): JSX.Element {
  const joinedData: [string, string][] = [];
  for (let i = 0; i < header.length; i += 1) {
    joinedData.push([header[i], row[i]]);
  }
  return (
    <div>
      {joinedData.map(([question, answer]) => (
        <div key={question}>
          <h4 className={styles.Header}>{question}</h4>
          <Answer answer={answer} />
        </div>
      ))}
    </div>
  );
}
