export type SheetData = {
  readonly header: readonly string[];
  readonly content: readonly string[][];
};

export type Rating = 1 | 2 | 3 | 4 | 5;

export type Ratings = { readonly [id: number]: Rating };
export type Comments = { readonly [id: number]: string };

export type UserVote = {
  readonly displayName: string;
  readonly ratings: Ratings;
  readonly comments: Comments;
};

export type SheetVotes = {
  readonly [email: string]: UserVote;
};
