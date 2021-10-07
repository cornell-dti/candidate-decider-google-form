import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

import RatingStatisticsList from './RatingStatisticsList';
import styles from './Reviewer.module.css';
import { getAppUser } from './apis/firebase-auth';
import { ratingStatistics, RatingStatistics, ratingsText } from './ratings-util';
import { SheetVotes } from './types';

type Props = {
  readonly expectedNumber: number;
  readonly allVotes: SheetVotes;
  readonly allVotingStatistics: readonly RatingStatistics[];
  readonly candidateId: number;
  readonly showOthers: boolean;
  readonly className: string;
};

export default function ReviewLocalSidePanel({
  expectedNumber,
  allVotes,
  allVotingStatistics,
  candidateId,
  showOthers,
  className,
}: Props): JSX.Element {
  const myEmail = getAppUser().email;
  const { [myEmail]: myVote } = allVotes;
  const { ratings: myRatings } = myVote ?? { ratings: {} };
  const myProgress = (100 * Object.keys(myRatings).length) / expectedNumber;
  return (
    <div className={className}>
      <div className={styles.Section}>
        <h3>My Progress</h3>
        <LinearProgress variant="determinate" value={myProgress} />
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
      {showOthers && (
        <div className={styles.Section}>
          <h3>All Votes on Candidate {candidateId + 1}</h3>
          <div>
            {Object.keys(allVotes).map((email) => {
              const { displayName, ratings } = allVotes[email];
              const rating = ratings[candidateId];
              if (rating == null) {
                return null;
              }
              return (
                <div key={email} className={styles.Section}>
                  {`${displayName}: ${ratingsText[rating - 1]}`}
                </div>
              );
            })}
          </div>
          <h3>All Comments on Candidate {candidateId + 1}</h3>
          <div>
            {Object.keys(allVotes).map((email) => {
              const { displayName, comments } = allVotes[email];
              const comment = comments[candidateId];
              if (comment == null) {
                return null;
              }
              return (
                <div key={email} className={styles.Section}>
                  {`${displayName}: ${comment}`}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
