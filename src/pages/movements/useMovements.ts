import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

import { skipToken } from '@reduxjs/toolkit/query/react';

import {
  useCreateMovementMutation,
  useGetMovementsQuery,
} from '../../services/endpoints/movements';
import type { ICreateMovementRequestBody } from '../../services/endpoints/movements/types';
import { getErrorMessage } from '../../services/helpers';
import { getCurrentMonthValue, getMonthsRange, pickerDateTimeToIso } from './helpers';
import type { IBrokerOption, ISelectionModeOption, TMonthsRange, TSelectionMode } from './types';

const brokerOptions: IBrokerOption[] = [
  { value: 'IBKR', label: 'IBKR' },
  { value: 'TASTY', label: 'TASTY' },
];

const selectionModeOptions: ISelectionModeOption[] = [
  { value: 'all', label: 'All' },
  { value: 'range', label: 'Range' },
  { value: 'month', label: 'Month' },
];

const initialMovement: ICreateMovementRequestBody = {
  dateTime: '',
  broker: 'IBKR',
  amount: 0,
  description: '',
  userId: '',
};

export const useMovements = () => {
  const [selectionMode, setSelectionMode] = useState<TSelectionMode>('month');
  // Each mode keeps its own selection, so switching modes does not discard the other's.
  const [month, setMonth] = useState<string | null>(getCurrentMonthValue());
  const [monthsRange, setMonthsRange] = useState<TMonthsRange>([
    getCurrentMonthValue(),
    getCurrentMonthValue(),
  ]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDialogOpen, { open: openDialog, close: closeDialog }] = useDisclosure(false);

  // A single month is a range whose ends coincide, so both modes share getMonthsRange.
  const movementsParams = useMemo(() => {
    if (selectionMode === 'month') {
      return getMonthsRange([month, month]);
    }
    if (selectionMode === 'range') {
      return getMonthsRange(monthsRange);
    }
    return null;
  }, [selectionMode, month, monthsRange]);

  // undefined means "fetch with no params" (all); skipToken means "do not fetch at all".
  const queryArg = selectionMode === 'all' ? undefined : (movementsParams ?? skipToken);

  const { data: movements = [], isFetching, error } = useGetMovementsQuery(queryArg);
  const [createMovement, { isLoading: isSaving }] = useCreateMovementMutation();

  const form = useForm<ICreateMovementRequestBody>({
    initialValues: initialMovement,
    validate: {
      dateTime: (value) => (value ? null : 'Date and time is required'),
      broker: (value) => (value ? null : 'Broker is required'),
      amount: (value) => (typeof value === 'number' ? null : 'Amount is required'),
      description: (value) => (value.trim() ? null : 'Description is required'),
      // userId is a foreign key onto User.email, so it holds an email address, not an id.
      userId: (value) =>
        /^\S+@\S+\.\S+$/.test(value.trim()) ? null : 'A valid user email is required',
    },
  });

  const handleNewMovement = () => {
    setErrorMsg('');
    form.reset();
    openDialog();
  };

  const handleSaveMovement = async (values: ICreateMovementRequestBody) => {
    setErrorMsg('');
    const result = await createMovement({
      ...values,
      dateTime: pickerDateTimeToIso(values.dateTime),
    });

    if (!result.error) {
      closeDialog();
      form.reset();
      return;
    }
    setErrorMsg(getErrorMessage(result.error));
  };

  return {
    brokerOptions,
    selectionModeOptions,
    selectionMode,
    setSelectionMode,
    month,
    setMonth,
    monthsRange,
    setMonthsRange,
    movements,
    isFetching,
    isSelectionIncomplete: selectionMode !== 'all' && movementsParams === null,
    loadErrorMsg: error ? getErrorMessage(error) : '',
    isDialogOpen,
    closeDialog,
    handleNewMovement,
    form,
    errorMsg,
    isSaving,
    handleSaveMovement,
  };
};
