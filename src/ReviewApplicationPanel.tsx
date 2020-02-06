import React, { ReactElement, useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
        <span>Candicate ID: </span>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={candidateId}
            onChange={event => setCandidateId(event.currentTarget.value as number)}
          >
            {Array.from(Array(content.length).keys()).map((id) => (
              <MenuItem key={id} value={id}>{id + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <span>of {content.length}.</span>
        <ButtonGroup color="primary" className={styles.Button}>
          <Button disabled={candidateId === 0} onClick={previous}>Previous</Button>
          <Button disabled={candidateId === content.length - 1} onClick={next}>Next</Button>
        </ButtonGroup>
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
