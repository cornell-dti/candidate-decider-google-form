import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import React from 'react';

import CandidateSearch from './CandidateSearch';
import styles from './Reviewer.module.css';
import SingleCandidateReviewer from './SingleCandidateReviewer';
import SingleCandidateViewer from './SingleCandidateViewer';
import { SheetData, Rating, Ratings, Comments } from './types';

type Props = {
  readonly sheetData: SheetData;
  readonly ratings: Ratings;
  readonly comments: Comments;
  readonly candidateId: number;
  readonly updateCandidateId: (updater: number | ((previous: number) => number)) => void;
  readonly showOthers: boolean;
  readonly onToggleShowOthers: () => void;
  readonly onRatingChange: (updatedRating: Rating | null) => void;
  readonly onCommentChange: (comment: string) => void;
  readonly className: string;
};

export default function ReviewApplicationPanel({
  sheetData: { header, content },
  ratings,
  comments,
  candidateId,
  updateCandidateId,
  showOthers,
  onToggleShowOthers,
  onRatingChange,
  onCommentChange,
  className,
}: Props): JSX.Element {
  const previous = () => updateCandidateId((id) => id - 1);
  const next = () => updateCandidateId((id) => id + 1);

  return (
    <div className={className}>
      <div className={styles.Section}>
        <CandidateSearch sheetData={{ header, content }} updateCandidateId={updateCandidateId} />
        <div className={styles.Section}>
          <span>Candidate ID: </span>
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={candidateId}
              onChange={(event) => updateCandidateId((event.target?.value ?? 0) as number)}
            >
              {Array.from(Array(content.length).keys()).map((id) => (
                <MenuItem key={id} value={id}>
                  {id + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span>of {content.length}.</span>
          <ButtonGroup color="primary" className={styles.Button}>
            <Button disabled={candidateId === 0} onClick={previous}>
              Previous
            </Button>
            <Button disabled={candidateId === content.length - 1} onClick={next}>
              Next
            </Button>
          </ButtonGroup>
          <Switch checked={showOthers} onChange={onToggleShowOthers} />
          <span>Show other people&apos;s votes</span>
        </div>
        <SingleCandidateReviewer
          candidateId={candidateId}
          rating={ratings[candidateId] ?? null}
          comment={comments[candidateId] ?? ''}
          onRatingChange={(updatedRating) => onRatingChange(updatedRating)}
          onCommentChange={(updatedComment) => onCommentChange(updatedComment)}
        />
      </div>
      <div className={styles.Section}>
        <SingleCandidateViewer header={header} row={content[candidateId]} />
      </div>
    </div>
  );
}
