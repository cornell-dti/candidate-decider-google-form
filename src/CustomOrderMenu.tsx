import { Button, ButtonGroup, Grid, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useState } from 'react';

type Props = {
  readonly contentLength: number;
  readonly setCustomOrder: (order: number[]) => void;
};

export default function CustomOrderMenu({ contentLength, setCustomOrder }: Props): JSX.Element {
  const [errorMsg, setErrorMsg] = useState('');
  const [currentOrder, setCurrentOrder] = useState('');

  const updateOrder = (orderStr: string) => {
    const orderArr = orderStr.split(',').map((num) => Number(num));
    if (orderArr.some((num) => isNaN(num) || num <= 0 || num > contentLength)) {
      setErrorMsg('Custom Order: bad string or out of bounds');
    } else if (orderArr.length !== new Set(orderArr).size) {
      setErrorMsg('Custom Order: contains duplicates');
    } else {
      setErrorMsg('');
      setCustomOrder(orderArr.map((num) => num - 1));
    }
  };

  return (
    <div>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <Grid container alignItems="center">
        <TextField
          label="Custom Order"
          placeholder="1,5,2,3,88,6"
          value={currentOrder}
          onChange={(event) => setCurrentOrder(event.currentTarget.value)}
        />
        <ButtonGroup disableElevation variant="contained">
          <Button color="primary" onClick={() => updateOrder(currentOrder)}>
            Apply
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setErrorMsg('');
              setCustomOrder([]);
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
      </Grid>
    </div>
  );
}
