interface DatabaseModel {
  _id?: string
  databaseName: string;
  availableBookings : number;
  bookerEntityName : string;
  bookableEntityName : string;
  databaseAccessToken?: string;
}

export type {DatabaseModel}
