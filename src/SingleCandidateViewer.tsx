import React, { ReactElement } from 'react';
import styles from './Reviewer.module.css';

type Props = {
  readonly header: readonly string[];
  readonly row: readonly string[];
};

const Answer = ({ answer }: { readonly answer: string }): ReactElement => {
  const normalized = answer?.trim() ?? '';
  if (!normalized) {
    return <code>No answer provided</code>;
  }
  if (normalized.startsWith('http')) {
    return (
      <a href={normalized} target="_blank" rel="noopener noreferrer">
        {normalized}
      </a>
    );
  }
  return (
    <>
      {normalized.split('\n').map((line, lineId) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={lineId} className={styles.AnswerText}>
          {line}
        </div>
      ))}
    </>
  );
};

export default ({ header, row }: Props): ReactElement => {
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
};
