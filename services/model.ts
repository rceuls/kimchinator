export interface IReportElement {
  image: string;
  description?: string;
  location?: string;
  id: string;
  byDate?: Date;
  responsible?: string;
  addedOn: Date;
  addedBy: string;
}

export interface IReport {
  _id: string;
  name: string;
  date: Date;
  reportElements: IReportElement[];
  addedOn: Date;
  addedBy: string;
}
