export interface DatabaseModel {
  _id?: string
  databaseName: string;
  child? : EntityModel;
  databaseAccessToken? : string;
}

export interface EntityModel {
  name : string,
  count : number,
  child? : EntityModel
}
