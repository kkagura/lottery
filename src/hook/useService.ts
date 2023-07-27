import { inject } from "vue";
import LotteryService from "../service/LotteryService";

export const serviceInjectionKey = Symbol("");
export const useService = () =>
  inject(serviceInjectionKey) as { lotteryService: LotteryService };
