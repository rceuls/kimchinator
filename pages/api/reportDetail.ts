export interface IReport {
  reportElements: Array<{
    image: string;
    description: string;
    location?: string;
    id: string;
  }>;
}
