import TextField from '@material-ui/core/TextField';
import AutoComplete from '@material-ui/lab/Autocomplete';
import React from 'react';

import { SheetData } from './types';

type Props = {
  readonly sheetData: SheetData;
  readonly updateCandidateId: (updater: number | ((previous: number) => number)) => void;
};

type Option = {
  id: number;
  displayName: string;
};

type Question = {
  question: string;
  pos: number;
};

const CandidateSearch = ({
  sheetData: { header, content },
  updateCandidateId,
}: Props): JSX.Element => {
  const enumeratedQuestions = header.map((question: string, i: number) => ({ question, pos: i }));

  const namesPos = enumeratedQuestions.filter((question: Question) =>
    question.question.toLowerCase().includes('name')
  );

  const netIdPos = enumeratedQuestions.find((question: Question) =>
    question.question.toLowerCase().includes('netid')
  );

  const options: Option[] = content.map((response: string[], i: number) => {
    let displayName = '';
    namesPos.forEach((pos: { pos: number }) => {
      displayName += `${response[pos.pos]} `;
    });
    if (netIdPos) displayName += ` (${response[netIdPos.pos]})`;
    return {
      id: i,
      displayName,
    };
  });

  return (
    <AutoComplete
      onChange={(_, newOpt) => {
        updateCandidateId(() => (newOpt !== null ? newOpt.id : 0));
      }}
      options={options}
      renderInput={(params) => <TextField {...params} label="Candidate Search" />}
      getOptionLabel={(option) => `${option.id + 1} - ${option.displayName}`}
      getOptionSelected={(option: Option, val: Option) => {
        return option.id === val.id;
      }}
    />
  );
};

export default CandidateSearch;
