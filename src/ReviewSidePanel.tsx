import React, { ReactElement, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Button } from '@material-ui/core';
import { SheetVotes } from './types';
import {
  exportRatings,
  ratingStatistics,
  votingStatistics,
  exportAsCsv,
  RatingStatistics
} from './ratings-util';
import RatingStatisticsList from './RatingStatisticsList';
import styles from './Reviewer.module.css';
import { getAppUser } from './apis/firebase-auth';

type Props = {
  readonly expectedNumber: number;
  readonly allVotes: SheetVotes;
  readonly allVotingStatistics: readonly RatingStatistics[];
  readonly candidateId: number;
  readonly showOthers: boolean;
  readonly className: string;
};

export default ({
  expectedNumber,
  allVotes,
  allVotingStatistics,
  candidateId,
  showOthers,
  className
}: Props): ReactElement => {
  const [showCSV, setShowCSV] = useState(false);
  const myEmail = getAppUser().email;
  const { [myEmail]: myVote, ...otherVotes } = allVotes;
  const { ratings: myRatings } = myVote ?? { ratings: {} };
  const myProgress = (100 * Object.keys(myRatings).length) / expectedNumber;
  const globalProgress =
    (100 *
      Object.values(allVotes)
        .map(vote => Object.keys(vote.ratings).length)
        .reduce((acc, c) => acc + c, 0)) /
    (Object.keys(allVotes).length * expectedNumber);
  return (
    <div className={className}>
      <div className={styles.Section}>
        <h3>My Progress</h3>
        <LinearProgress variant="determinate" value={myProgress} />
      </div>
      <div className={styles.Section}>
        <h3>Global Progress</h3>
        <LinearProgress variant="determinate" value={globalProgress} />
      </div>
      {showOthers && (
        <div className={styles.Section}>
          <h3>Candidate {candidateId + 1} Global Ratings</h3>
          <RatingStatisticsList statistics={allVotingStatistics[candidateId]} />
        </div>
      )}
      <div className={styles.Section}>
        <h3>My Rating Statistics</h3>
        <RatingStatisticsList statistics={ratingStatistics(myRatings)} />
      </div>
      <div className={styles.Section}>
        <h3>Global Rating Statistics</h3>
        <RatingStatisticsList statistics={votingStatistics(allVotes)} />
      </div>
      {showOthers && (
        <>
          <div className={styles.Section}>
            <h3>Per-person Ratings</h3>
            {exportRatings(expectedNumber, myRatings).map((text, id) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={id}>
                <h4>Candidate {id + 1}:</h4>
                <RatingStatisticsList statistics={allVotingStatistics[id]} />
              </div>
            ))}
          </div>
          {Object.keys(otherVotes).map(email => {
            const { displayName, ratings } = otherVotes[email];
            return (
              <div key={email} className={styles.Section}>
                <h3>{`${displayName}'s Ratings`}</h3>
                <ol>
                  {exportRatings(expectedNumber, ratings).map((text, id) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={id}>{text}</li>
                  ))}
                </ol>
              </div>
            );
          })}
        </>
      )}
      <div className={styles.Section}>
        <h3>Export</h3>
        <div>
          <Button color="primary" onClick={() => setShowCSV(prev => !prev)}>
            {showCSV ? 'Hide' : 'Show'} CSV
          </Button>
          <pre>{showCSV && exportAsCsv(expectedNumber, allVotes)}</pre>
        </div>
      </div>
    </div>
  );
};
