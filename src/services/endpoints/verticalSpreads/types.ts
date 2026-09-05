export type TDayType = 'normal' | 'gap too hight' | 'risk event';
export type TStrategy = 'bearCallSpread' | 'bullPutSpread';

export interface IVerticalSpread {
  id: string;
  ticker: string;
  openDateTime: string;
  dayType: TDayType;
  maxGapFirst15min: number;
  priceAtOpen: number;
  straddleAtOpen: number;
  strategy: TStrategy;
  strike: number;
  width: number;
  delta: number;
  credit: number;
  dte: number;
  closeDateTime?: string | null;
  priceAtClose?: number | null;
  netProfitLoss?: number | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ICreateVerticalSpreadRequestBody {
  ticker: string;
  openDateTime: string;
  dayType: TDayType;
  maxGapFirst15min: number;
  priceAtOpen: number;
  straddleAtOpen: number;
  strategy: TStrategy;
  strike: number;
  width: number;
  delta: number;
  credit: number;
  dte: number;
  closeDateTime?: string | null;
  priceAtClose?: number | null;
  netProfitLoss?: number | null;
}

export interface IUpdateVerticalSpreadRequestBody {
  ticker?: string;
  openDateTime?: string;
  dayType?: TDayType;
  maxGapFirst15min?: number;
  priceAtOpen?: number;
  straddleAtOpen?: number;
  strategy?: TStrategy;
  strike?: number;
  width?: number;
  delta?: number;
  credit?: number;
  dte?: number;
  closeDateTime?: string | null;
  priceAtClose?: number | null;
  netProfitLoss?: number | null;
}
