import React, { ReactElement, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import LinearProgress from '@material-ui/core/LinearProgress';
import { SheetVotes } from './types';
import {
  exportRatings,
  ratingsText,
  ratingStatistics,
  votingStatistics,
  votingStatisticsPerPerson
} from './ratings-util';
import styles from './Reviewer.module.css';
import { getAppUser } from './firebase-auth';

type Props = {
  readonly expectedNumber: number;
  readonly allVotes: SheetVotes;
  readonly className: string;
};

export default ({ expectedNumber, allVotes, className }: Props): ReactElement => {
  const [showOthers, setShowOthers] = useState(false);
  const myEmail = getAppUser().email;
  const { [myEmail]: myVote, ...otherVotes } = allVotes;
  const { ratings: myRatings } = myVote ?? { ratings: {} };
  const myProgress = 100 * Object.keys(myRatings).length / expectedNumber;
  const globalProgress = 100
    * Object.values(allVotes).map(vote => Object.keys(vote.ratings).length).reduce((acc, c) => acc + c, 0)
    / (Object.keys(allVotes).length * expectedNumber)
  return (
    <div className={className}>
      <div className={styles.Section}>
        <h3>My Progress</h3>
        <LinearProgress
          variant="determinate"
          value={myProgress}
        />
      </div>
      <div className={styles.Section}>
        <h3>Global Progress</h3>
        <LinearProgress
          variant="determinate"
          value={globalProgress}
        />
      </div>
      <div className={styles.Section}>
        <h3>My Rating Statistics</h3>
        <ol>
          {ratingStatistics(myRatings).map((count, id) => (
            <li>{ratingsText[id]}: {count}</li>
          ))}
        </ol>
      </div>
      <div className={styles.Section}>
        <h3>Global Rating Statistics</h3>
        <ol>
          {votingStatistics(allVotes).map((count, id) => (
            <li>{ratingsText[id]}: {count}</li>
          ))}
        </ol>
      </div>
      <div className={styles.Section}>
        <h3>My Ratings</h3>
        <ol>
          {exportRatings(expectedNumber, myRatings).map((text, id) => <li key={id}>{text}</li>)}
        </ol>
      </div>
      <div className={styles.Section}>
        <Switch
          checked={showOthers}
          onChange={() => setShowOthers(prev => !prev)}
        />
        <span>Show other people's votes</span>
      </div>
      {showOthers && (<>
        <div className={styles.Section}>
          <h3>Per-person Ratings:</h3>
          <ol>
            {votingStatisticsPerPerson(expectedNumber, allVotes).map((statistics, id) => (
              <li key={id}>
                <div>{`${ratingsText[0]}: ${statistics[0]}`}</div>
                <div>{`${ratingsText[1]}: ${statistics[1]}`}</div>
                <div>{`${ratingsText[2]}: ${statistics[2]}`}</div>
                <div>{`${ratingsText[3]}: ${statistics[3]}`}</div>
                <div>{`${ratingsText[4]}: ${statistics[4]}`}</div>
              </li>
            ))}
          </ol>
        </div>
        {Object.keys(otherVotes).map((email) => {
          const { displayName, ratings } = otherVotes[email];
          return (
            <div key={email} className={styles.Section}>
              <h3>{displayName}'s Ratings</h3>
              <ol>
                {exportRatings(expectedNumber, ratings).map((text, id) => <li key={id}>{text}</li>)}
              </ol>
            </div>
          );
        })}
      </>)}
    </div>
  );
};
