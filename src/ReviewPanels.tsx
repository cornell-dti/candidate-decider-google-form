import React, { useState, useEffect } from 'react';

import ReviewApplicationPanel from './ReviewApplicationPanel';
import ReviewGlobalSidePanel from './ReviewGlobalSidePanel';
import ReviewLocalSidePanel from './ReviewLocalSidePanel';
import styles from './Reviewer.module.css';
import { getAppUser } from './apis/firebase-auth';
import * as db from './apis/firestore';
import { votingStatisticsPerPerson } from './ratings-util';
import { SheetData, Rating, Ratings, Comments, SheetVotes } from './types';

type Props = {
  readonly spreadsheetId: string;
  readonly range: string;
  readonly sheetData: SheetData;
};

export default function ReviewPanels({ spreadsheetId, range, sheetData }: Props): JSX.Element {
  const [ratings, setRatings] = useState<Ratings>({});
  const [comments, setComments] = useState<Comments>({});
  const [allVotes, setAllVotes] = useState<SheetVotes>({});
  const [candidateId, setCandidateId] = useState(0);
  const [showOthers, setShowOthers] = useState(false);
  useEffect(() => {
    db.listen(`${spreadsheetId}_____${range}`, (votes) => {
      const personalChoices = votes[getAppUser().email];
      const myRatings = personalChoices?.ratings ?? {};
      const myComments = personalChoices?.comments ?? {};
      setRatings(myRatings);
      setComments(myComments);
      setAllVotes(votes);
    });
  }, [spreadsheetId, range]);
  const onRatingChange = (updatedRating: Rating | null): void => {
    if (updatedRating === null) {
      const { [candidateId]: _, ...restRatings } = ratings;
      db.update(`${spreadsheetId}_____${range}`, restRatings, comments);
    } else {
      db.update(
        `${spreadsheetId}_____${range}`,
        { ...ratings, [candidateId]: updatedRating },
        comments
      );
    }
  };
  const onCommentChange = (comment: string): void => {
    db.update(`${spreadsheetId}_____${range}`, ratings, { ...comments, [candidateId]: comment });
  };
  const [customOrder, setCustomOrder] = useState<number[]>([]);
  return (
    <div key={Object.keys(allVotes).length} className={styles.ReviewPanels}>
      <ReviewApplicationPanel
        sheetData={sheetData}
        ratings={ratings}
        comments={comments}
        candidateId={candidateId}
        updateCandidateId={setCandidateId}
        customOrder={customOrder}
        updateCustomOrder={setCustomOrder}
        showOthers={showOthers}
        onToggleShowOthers={() => setShowOthers((prev) => !prev)}
        onRatingChange={onRatingChange}
        onCommentChange={onCommentChange}
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
}
