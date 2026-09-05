export type TBroker = 'IBKR' | 'TASTY';

export interface IMovement {
  id: string;
  dateTime: string;
  broker: TBroker;
  amount: number;
  description: string;
  userId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ICreateMovementRequestBody {
  dateTime: string;
  broker: TBroker;
  amount: number;
  description: string;
  userId: string;
}

export interface IUpdateMovementRequestBody {
  dateTime?: string;
  broker?: TBroker;
  amount?: number;
  description?: string;
  userId?: string;
}
