import React, { ReactElement, useState, useEffect } from 'react';
import * as db from './apis/firestore';
import { SheetData, Rating, Ratings, SheetVotes } from './types';
import ReviewApplicationPanel from './ReviewApplicationPanel';
import styles from './Reviewer.module.css';
import ReviewLocalSidePanel from './ReviewLocalSidePanel';
import ReviewGlobalSidePanel from './ReviewGlobalSidePanel';
import { votingStatisticsPerPerson } from './ratings-util';
import { getAppUser } from './apis/firebase-auth';

type Props = { readonly spreadsheetId: string; readonly sheetData: SheetData };

export default ({ spreadsheetId, sheetData }: Props): ReactElement => {
  const [ratings, setRatings] = useState<Ratings>({});
  const [allVotes, setAllVotes] = useState<SheetVotes>({});
  const [candidateId, setCandidateId] = useState(0);
  const [showOthers, setShowOthers] = useState(false);
  useEffect(() => {
    db.listen(spreadsheetId, votes => {
      const myVote = votes[getAppUser().email]?.ratings ?? {};
      setRatings(myVote);
      setAllVotes(votes);
    });
  }, [spreadsheetId]);
  const onRatingChange = (updatedRating: Rating | null): void => {
    if (updatedRating === null) {
      const { [candidateId]: _, ...restRatings } = ratings;
      db.update(spreadsheetId, restRatings);
    } else {
      db.update(spreadsheetId, { ...ratings, [candidateId]: updatedRating });
    }
  };
  return (
    <div className={styles.ReviewPanels}>
      <ReviewApplicationPanel
        sheetData={sheetData}
        ratings={ratings}
        candidateId={candidateId}
        updateCandidateId={setCandidateId}
        showOthers={showOthers}
        onToggleShowOthers={() => setShowOthers(prev => !prev)}
        onRatingChange={onRatingChange}
        className={styles.ReviewApplicationPanel}
      />
      <ReviewLocalSidePanel
        expectedNumber={sheetData.content.length}
        allVotes={allVotes}
        allVotingStatistics={votingStatisticsPerPerson(sheetData.content.length, allVotes)}
        candidateId={candidateId}
        showOthers={showOthers}
        className={styles.ReviewSidePanel}
      />
      <ReviewGlobalSidePanel
        expectedNumber={sheetData.content.length}
        allVotes={allVotes}
        allVotingStatistics={votingStatisticsPerPerson(sheetData.content.length, allVotes)}
        showOthers={showOthers}
        className={styles.ReviewSidePanel}
      />
    </div>
  );
};
