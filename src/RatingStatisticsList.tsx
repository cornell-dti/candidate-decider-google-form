import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import React, { ReactElement } from 'react';

import styles from './Reviewer.module.css';
import { ratingsText, ratingsColors, RatingStatistics } from './ratings-util';

type Props = { readonly statistics: RatingStatistics };

const colorLinearProgress = (backgroundColor: string) =>
  withStyles({
    colorPrimary: { backgroundColor: 'transparent' },
    barColorPrimary: { backgroundColor },
  })(LinearProgress);
const colorLinearProgressList = ratingsColors.map((color) => colorLinearProgress(color));

const RatingStatisticsList = ({ statistics }: Props): ReactElement => {
  const totalCount = statistics[0] + statistics[1] + statistics[2] + statistics[3] + statistics[4];
  return (
    <div>
      {statistics.map((count, id) => {
        const key = id;
        const value = (count / totalCount) * 100;
        const Progress = colorLinearProgressList[id];
        return (
          <div key={key} className={styles.PercentageContainer}>
            <div className={styles.PercentageContainerText}>{`${ratingsText[id]} (${count})`}</div>
            <Progress variant="determinate" value={value} className={styles.PercentageBar} />
          </div>
        );
      })}
    </div>
  );
};

export default RatingStatisticsList;
