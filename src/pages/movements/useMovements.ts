import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

import { skipToken } from '@reduxjs/toolkit/query/react';
import type { ColDef, ValueFormatterParams } from 'ag-grid-community';

import {
  useCreateMovementMutation,
  useGetMovementsQuery,
} from '../../services/endpoints/movements';
import type {
  ICreateMovementRequestBody,
  IMovement,
} from '../../services/endpoints/movements/types';
import { useGetAllUsersQuery } from '../../services/endpoints/user';
import { getErrorMessage } from '../../services/helpers';
import {
  formatMovementDateTime,
  getCurrentMonthValue,
  getMonthsRange,
  pickerDateTimeToIso,
} from './helpers';
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

const columnDefs: ColDef<IMovement>[] = [
  // Ids are 36-character UUIDs; an equal flex share would truncate them.
  { field: 'id', headerName: 'Id', minWidth: 290 },
  {
    field: 'dateTime',
    headerName: 'Date and time',
    // formatMovementDateTime throws on an invalid value, and the grid calls this for empty rows.
    valueFormatter: (params: ValueFormatterParams<IMovement, string>) =>
      params.value != null ? formatMovementDateTime(params.value) : '',
  },
  { field: 'broker', headerName: 'Broker' },
  { field: 'amount', headerName: 'Amount' },
  { field: 'description', headerName: 'Description' },
  { field: 'userId', headerName: 'User email' },
];

const defaultColDef: ColDef<IMovement> = {
  sortable: true,
  resizable: true,
  filter: true,
  flex: 1,
  minWidth: 100,
};

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

  const {
    data: userOptions = [],
    isFetching: isFetchingUsers,
    error: usersError,
  } = useGetAllUsersQuery();
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
      userId: (value) => (value ? null : 'User is required'),
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
    columnDefs,
    defaultColDef,
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
    userOptions,
    isFetchingUsers,
    usersErrorMsg: usersError ? getErrorMessage(usersError) : '',
    errorMsg,
    isSaving,
    handleSaveMovement,
  };
};
