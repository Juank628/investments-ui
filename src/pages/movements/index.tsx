import {
  Button,
  Center,
  Group,
  Loader,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateTimePicker, MonthPickerInput } from '@mantine/dates';
import { AgGridReact } from 'ag-grid-react';

import type { IMovement } from '../../services/endpoints/movements/types';
import styles from './styles.module.css';
import { useMovements } from './useMovements';

const Movements = () => {
  const {
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
    isSelectionIncomplete,
    loadErrorMsg,
    isDialogOpen,
    closeDialog,
    handleNewMovement,
    form,
    errorMsg,
    isSaving,
    handleSaveMovement,
  } = useMovements();

  return (
    <div className={styles.container}>
      <Title order={2} mb="md">
        Movements
      </Title>

      <Group align="flex-end" mb="md">
        <SegmentedControl
          data={selectionModeOptions}
          value={selectionMode}
          onChange={setSelectionMode}
        />
        {selectionMode === 'month' && (
          <MonthPickerInput
            clearable
            label="Month"
            placeholder="Pick a month"
            value={month}
            onChange={setMonth}
            w={320}
          />
        )}
        {selectionMode === 'range' && (
          <MonthPickerInput
            type="range"
            allowSingleDateInRange
            clearable
            label="Months"
            placeholder="Pick a month range"
            value={monthsRange}
            onChange={setMonthsRange}
            w={320}
          />
        )}
        <Button onClick={handleNewMovement}>New movement</Button>
      </Group>

      {isFetching && (
        <Center py="xl">
          <Loader />
        </Center>
      )}
      {loadErrorMsg && <Text c="red">{loadErrorMsg}</Text>}

      {!isFetching && !loadErrorMsg && isSelectionIncomplete && (
        <Text c="dimmed">Select a month to see movements.</Text>
      )}

      {!isFetching && !loadErrorMsg && !isSelectionIncomplete && (
        <div className={styles.grid}>
          <AgGridReact<IMovement>
            rowData={movements}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
          />
        </div>
      )}

      <Modal opened={isDialogOpen} onClose={closeDialog} title="New movement">
        <form onSubmit={form.onSubmit(handleSaveMovement)}>
          <Stack>
            <DateTimePicker
              label="Date and time"
              placeholder="Pick date and time"
              required
              key={form.key('dateTime')}
              {...form.getInputProps('dateTime')}
            />
            <Select
              label="Broker"
              placeholder="Pick broker"
              required
              data={brokerOptions}
              key={form.key('broker')}
              {...form.getInputProps('broker')}
            />
            <NumberInput
              label="Amount"
              placeholder="Amount"
              required
              decimalScale={2}
              key={form.key('amount')}
              {...form.getInputProps('amount')}
            />
            <TextInput
              label="Description"
              placeholder="Description"
              required
              key={form.key('description')}
              {...form.getInputProps('description')}
            />
            <TextInput
              label="User email"
              placeholder="user@example.com"
              required
              key={form.key('userId')}
              {...form.getInputProps('userId')}
            />
            {errorMsg && (
              <Text c="red" size="sm">
                {errorMsg}
              </Text>
            )}
            <Button type="submit" loading={isSaving}>
              Save
            </Button>
          </Stack>
        </form>
      </Modal>
    </div>
  );
};

export default Movements;
