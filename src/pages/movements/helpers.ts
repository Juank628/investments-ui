import { endOfMonth, format, parse, parseISO, startOfMonth } from 'date-fns';

import type { IGetMovementsParams } from '../../services/endpoints/movements/types';
import type { TMonthsRange } from './types';

const PICKER_VALUE_FORMAT = 'yyyy-MM-dd';
const PICKER_DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export const getCurrentMonthValue = (): string =>
  format(startOfMonth(new Date()), PICKER_VALUE_FORMAT);

// The API filters on UTC day boundaries, so the column is rendered in UTC too — formatting in local
// time would show a movement near a month edge under the month it was not filtered into.
export const formatMovementDateTime = (isoDateTime: string): string =>
  new Date(isoDateTime).toISOString().slice(0, 16).replace('T', ' ');

// The picker emits 'yyyy-MM-dd HH:mm:ss', which parseISO rejects because of the space separator.
export const pickerDateTimeToIso = (pickerDateTime: string): string =>
  parse(pickerDateTime, PICKER_DATE_TIME_FORMAT, new Date()).toISOString();

// Null until both ends are picked, so a half-finished range fires no request. The picker hands back
// the first of each month, so `from` is already the lower bound; `to` is that month's last day.
export const getMonthsRange = ([from, to]: TMonthsRange): IGetMovementsParams | null => {
  if (!from || !to) {
    return null;
  }

  return {
    fromDate: from,
    toDate: format(endOfMonth(parseISO(to)), PICKER_VALUE_FORMAT),
  };
};
