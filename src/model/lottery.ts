export interface ILotteryOption {
  id: string;
  lotteryId: string;
  name: string;
  weight: number;
  createdAt: number;
}

export interface ILottery {
  id: string;
  name: string;
  createdAt: number;
}

export type ILotteryAddReqDTO = Omit<ILottery, "id" | "createdAt">;
export type ILotteryOptionAddReqDTO = Omit<ILotteryOption, "id" | "createdAt">;
export type ILotteryDetailResDTO = ILottery & { options: ILotteryOption[] };
