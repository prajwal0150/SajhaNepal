export interface ReportFormState {
  needType: string;
  urgency: string;
  title: string;
  description: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  address: string;
  lat: number | null;
  lng: number | null;
  affectedPeople: string;
  requiredQuantity: string;
  quantityUnit: string;
  contact: string;
  consent: boolean;
}

export type ReportFormSetter = <K extends keyof ReportFormState>(key: K, value: ReportFormState[K]) => void;

export const INITIAL_REPORT_FORM: ReportFormState = {
  needType: '', urgency: '', title: '', description: '',
  province: 'Bagmati', district: '', municipality: '', ward: '', address: '',
  lat: null, lng: null, affectedPeople: '1', requiredQuantity: '1', quantityUnit: 'units',
  contact: '', consent: false,
};
