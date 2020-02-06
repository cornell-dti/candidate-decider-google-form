import React, { ReactElement, useState } from 'react';
import Button from '@material-ui/core/Button';
import { SheetData, Rating, Ratings } from './types';
import SingleCandidateViewer from './SingleCandidateViewer';
import SingleCandidateReviewer from './SingleCandidateReviewer';
import styles from './Reviewer.module.css';

type Props = {
  readonly sheetData: SheetData;
  readonly ratings: Ratings;
  readonly onRatingChange: (candidateId: number, updatedRating: Rating | null) => void;
  readonly className: string;
};

export default (
  { sheetData: { header, content }, ratings, onRatingChange, className }: Props
): ReactElement => {
  const [candidateId, setCandidateId] = useState(0);
  const previous = () => setCandidateId(id => id - 1);
  const next = () => setCandidateId(id => id + 1);
  return (
    <div className={className}>
      <div className={styles.Section}>
        <span>Candicate ID: {candidateId + 1}/{content.length}</span>
        <Button
          variant="outlined"
          color="primary"
          className={styles.Button}
          disabled={candidateId === 0}
          onClick={previous}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={styles.Button}
          disabled={candidateId === content.length - 1}
          onClick={next}
        >
          Next
        </Button>
        <SingleCandidateReviewer
          rating={ratings[candidateId] ?? null}
          onRatingChange={updatedRating => onRatingChange(candidateId, updatedRating)}
        />
      </div>
      <div className={styles.Section}>
        <SingleCandidateViewer header={header} row={content[candidateId]} />
      </div>
    </div>
  );
};
