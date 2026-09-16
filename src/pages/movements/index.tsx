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
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateTimePicker, MonthPickerInput } from '@mantine/dates';

import { formatMovementDateTime } from './helpers';
import styles from './styles.module.css';
import { useMovements } from './useMovements';

const Movements = () => {
  const {
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
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover withTableBorder tabularNums>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Id</Table.Th>
                <Table.Th>Date and time</Table.Th>
                <Table.Th>Broker</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>User email</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {movements.map((movement) => (
                <Table.Tr key={movement.id}>
                  <Table.Td>{movement.id}</Table.Td>
                  <Table.Td>{formatMovementDateTime(movement.dateTime)}</Table.Td>
                  <Table.Td>{movement.broker}</Table.Td>
                  <Table.Td>{movement.amount}</Table.Td>
                  <Table.Td>{movement.description}</Table.Td>
                  <Table.Td>{movement.userId}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {movements.length === 0 && (
            <Text c="dimmed" mt="sm">
              No movements for the selected months.
            </Text>
          )}
        </Table.ScrollContainer>
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
