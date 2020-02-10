import React, { ReactElement, useState, useEffect } from 'react';
import * as db from './apis/firestore';
import { SheetData, Rating, Ratings, SheetVotes } from './types';
import ReviewApplicationPanel from './ReviewApplicationPanel';
import styles from './Reviewer.module.css';
import ReviewSidePanel from './ReviewSidePanel';
import { getAppUser } from './apis/firebase-auth';

type Props = { readonly spreadsheetId: string; readonly sheetData: SheetData };

export default ({ spreadsheetId, sheetData }: Props): ReactElement => {
  const [ratings, setRatings] = useState<Ratings>({});
  const [allVotes, setAllVotes] = useState<SheetVotes>({});
  useEffect(() => {
    db.listen(spreadsheetId, votes => {
      const myVote = votes[getAppUser().email]?.ratings ?? {};
      setRatings(myVote);
      setAllVotes(votes);
    });
  }, [spreadsheetId]);
  const onRatingChange = (candidateId: number, updatedRating: Rating | null): void => {
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
        onRatingChange={onRatingChange}
        className={styles.ReviewApplicationPanel}
      />
      <ReviewSidePanel
        expectedNumber={sheetData.content.length}
        allVotes={allVotes}
        className={styles.ReviewSidePanel}
      />
    </div>
  );
};
