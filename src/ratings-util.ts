import { red, yellow, green } from '@material-ui/core/colors';
import { Ratings, Rating, SheetVotes } from './types';

export const ratingsText = ['No', 'Unlikely', 'Maybe', 'Strong Maybe', 'Yes'] as const;
export const ratingsColors = [red[400], red[200], yellow[600], green[200], green[400]] as const;

const orderedRatings = (expectedNumber: number, ratings: Ratings): readonly (Rating | null)[] => {
  const ordered: (Rating | null)[] = [];
  for (let i = 0; i < expectedNumber; i += 1) {
    ordered.push(ratings[i] ?? null);
  }
  return ordered;
};

export const exportRatings = (expectedNumber: number, ratings: Ratings): readonly string[] =>
  orderedRatings(expectedNumber, ratings).map(rating =>
    rating === null ? '' : ratingsText[rating - 1]
  );

export type RatingStatistics = [number, number, number, number, number];

export const ratingStatistics = (ratings: Ratings): RatingStatistics => {
  const statistics = [0, 0, 0, 0, 0];
  Object.values(ratings).forEach(rating => {
    statistics[rating - 1] += 1;
  });
  return statistics as RatingStatistics;
};

export const votingStatistics = (votes: SheetVotes): RatingStatistics =>
  Object.values(votes)
    .map(vote => ratingStatistics(vote.ratings))
    .reduce(
      (acc, statistics) => [
        acc[0] + statistics[0],
        acc[1] + statistics[1],
        acc[2] + statistics[2],
        acc[3] + statistics[3],
        acc[4] + statistics[4]
      ],
      [0, 0, 0, 0, 0]
    );

export const votingStatisticsPerPerson = (
  expectedNumber: number,
  votes: SheetVotes
): readonly RatingStatistics[] => {
  const statisticsList: RatingStatistics[] = [];
  for (let i = 0; i < expectedNumber; i += 1) {
    const statistics = [0, 0, 0, 0, 0];
    Object.values(votes).forEach(vote => {
      const rating = vote.ratings[i];
      if (rating == null) {
        return;
      }
      statistics[rating - 1] += 1;
    });
    statisticsList.push(statistics as RatingStatistics);
  }
  return statisticsList;
};
