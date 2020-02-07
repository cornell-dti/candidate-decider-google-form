import React, { ReactElement, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { SheetVotes } from './types';
import {
  exportRatings,
  ratingsText,
  ratingsColors,
  ratingStatistics,
  votingStatistics,
  votingStatisticsPerPerson,
  RatingStatistics
} from './ratings-util';
import styles from './Reviewer.module.css';
import { getAppUser } from './firebase-auth';

type RatingStatisticsListProps = { readonly statistics: RatingStatistics };

const colorLinearProgress = (backgroundColor: string) => withStyles({
  colorPrimary: { backgroundColor: 'transparent' },
  barColorPrimary: { backgroundColor },
})(LinearProgress);
const colorLinearProgressList = ratingsColors.map(color => colorLinearProgress(color));

const RatingStatisticsList = ({ statistics }: RatingStatisticsListProps): ReactElement => {
  const totalCount = statistics[0] + statistics[1] + statistics[2] + statistics[3] + statistics[4];
  return (
    <div>
      {statistics.map((count, id) => {
        const key = id;
        const value = count / totalCount * 100
        const Progress = colorLinearProgressList[id];
        return (
          <div key={key} className={styles.PercentageContainer}>
            <div className={styles.PercentageContainerText}>{`${ratingsText[id]} (${count})`}</div>
            <Progress
              variant="determinate"
              value={value}
              className={styles.PercentageBar}
            />
          </div>
        );
      })}
    </div>
  )
};

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
        <RatingStatisticsList statistics={ratingStatistics(myRatings)} />
      </div>
      <div className={styles.Section}>
        <h3>Global Rating Statistics</h3>
        <RatingStatisticsList statistics={votingStatistics(allVotes)} />
      </div>
      <div className={styles.Section}>
        <h3>My Ratings</h3>
        <ol>
          {exportRatings(expectedNumber, myRatings).map((text, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={id}>{text}</li>
          ))}
        </ol>
      </div>
      <div className={styles.Section}>
        <Switch
          checked={showOthers}
          onChange={() => setShowOthers(prev => !prev)}
        />
        <span>{'Show other people\'s votes'}</span>
      </div>
      {showOthers && (
        <>
          <div className={styles.Section}>
            <h3>Per-person Ratings:</h3>
            <ol>
              {votingStatisticsPerPerson(expectedNumber, allVotes).map((statistics, id) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={id}>
                  <RatingStatisticsList statistics={statistics} />
                </li>
              ))}
            </ol>
          </div>
          {Object.keys(otherVotes).map((email) => {
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
    </div>
  );
};
