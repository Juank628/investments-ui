import type { TBroker } from '../../services/endpoints/movements/types';

export type TMonthsRange = [string | null, string | null];

export type TSelectionMode = 'all' | 'range' | 'month';

export interface ISelectionModeOption {
  value: TSelectionMode;
  label: string;
}

export interface IBrokerOption {
  value: TBroker;
  label: string;
}
