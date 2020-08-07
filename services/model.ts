export interface IReportElement {
  image: string;
  description?: string;
  location?: string;
  id: string;
  addedOn: string;
  addedBy: string;
}

export interface IReport {
  _id: string;
  name: string;
  date: Date;
  reportElements: IReportElement[];
  addedOn: string;
  addedBy: string;
}
