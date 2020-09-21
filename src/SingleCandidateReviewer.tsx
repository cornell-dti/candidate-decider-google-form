import React, { ReactElement, ChangeEvent, useState } from 'react';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { Rating } from './types';
import { ratingsText, ratingsColors } from './ratings-util';
import styles from './SingleCandidateReviewer.module.css';

type CommentEditorProps = {
  readonly comment: string;
  readonly onCommentChange: (comment: string) => void;
};

const CommentEditor = ({ comment, onCommentChange }: CommentEditorProps): ReactElement => {
  const [currentComment, setCurrentComment] = useState(comment);

  return (
    <div className={styles.CommentEditor}>
      <TextField
        className={styles.CommentEditorTextInput}
        label="My comment"
        value={currentComment}
        onChange={event => setCurrentComment(event.currentTarget.value)}
      />
      <Button variant="contained" color="primary" onClick={() => onCommentChange(currentComment)}>
        Save Comment
      </Button>
    </div>
  );
};

type Props = {
  readonly candidateId: number;
  readonly rating: Rating | null;
  readonly comment: string;
  readonly onRatingChange: (rating: Rating | null) => void;
  readonly onCommentChange: (comment: string) => void;
};

const SingleCandidateReviewer = ({
  candidateId,
  rating,
  comment,
  onRatingChange,
  onCommentChange
}: Props): ReactElement => {
  const onRatingRadioChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // eslint-disable-next-line prefer-destructuring
    const value = event.currentTarget.value;
    if (value === '') {
      onRatingChange(null);
    } else {
      onRatingChange(parseInt(value, 10) as Rating);
    }
  };
  return (
    <div>
      <FormControl component="fieldset">
        <RadioGroup row value={rating ?? ''} onChange={onRatingRadioChange}>
          {ratingsText.map((text, id) => (
            <FormControlLabel
              key={text}
              value={id + 1}
              control={<Radio style={{ color: ratingsColors[id] }} />}
              label={text}
              labelPlacement="top"
            />
          ))}
          <FormControlLabel
            value=""
            control={<Radio color="primary" />}
            label="Undecided"
            labelPlacement="top"
          />
        </RadioGroup>
        <CommentEditor key={candidateId} comment={comment} onCommentChange={onCommentChange} />
      </FormControl>
    </div>
  );
};

export default SingleCandidateReviewer;
