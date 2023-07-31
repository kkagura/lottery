import { ElMessage } from "element-plus";
import {
  ILottery,
  ILotteryAddReqDTO,
  ILotteryDetailResDTO,
  ILotteryOption,
  ILotteryOptionAddReqDTO,
} from "../model/lottery";
import { randomName } from "../utils";

const lotteryKey = "storage-lottery";
const lotteryOptionKey = "storage-lottery-option";

function interceptor(
  target: any,
  propertyKey: string,
  des: PropertyDescriptor
) {
  const origin = des.value;
  des.value = async function (this: LotteryService, ...args: any[]) {
    try {
      const res = await origin.call(this, ...args);
      return res;
    } catch (error) {
      const message = (error as any).message;
      ElMessage.error(message);
      throw new Error(message);
    }
  };
}

function sync(target: any, propertyKey: string, des: PropertyDescriptor) {
  const origin = des.value;

  des.value = async function (this: LotteryService, ...args: any[]) {
    await origin.call(this, ...args);
    localStorage.setItem(lotteryKey, JSON.stringify(this.lotteries));
    localStorage.setItem(lotteryOptionKey, JSON.stringify(this.lotteryOptions));
  };
}

export default class LotteryService {
  lotteries: ILottery[] = [];
  lotteryOptions: ILotteryOption[] = [];
  constructor() {
    const lotteryJson = localStorage.getItem(lotteryKey);
    if (lotteryJson) {
      try {
        this.lotteries = JSON.parse(lotteryJson);
      } catch (error) {}
    }
    const optionJson = localStorage.getItem(lotteryOptionKey);
    if (optionJson) {
      try {
        this.lotteryOptions = JSON.parse(optionJson);
      } catch (error) {}
    }
  }

  getLotteryList(): Promise<ILottery[]> {
    const lotteries = [...this.lotteries];
    lotteries.sort((a, b) => a.createdAt - b.createdAt);
    return Promise.resolve(lotteries);
  }

  getLotteryOptions(lotteryId: string) {
    const options = this.lotteryOptions.filter(
      (el) => el.lotteryId === lotteryId
    );
    options.sort((a, b) => a.createdAt - b.createdAt);
    return options;
  }

  @sync
  @interceptor
  addLottery(lotteryDIO: ILotteryAddReqDTO) {
    const name = lotteryDIO.name;
    if (this.lotteries.find((el) => el.name === name)) {
      return Promise.reject(new Error("分组名重复！"));
    }
    const lottery: ILottery = {
      id: randomName(),
      createdAt: performance.now(),
      name,
    };
    this.lotteries.push(lottery);
    return Promise.resolve(lottery);
  }

  @sync
  @interceptor
  addLotteryOption(lotteryOptionDTO: ILotteryOptionAddReqDTO) {
    const { name, lotteryId } = lotteryOptionDTO;
    const parent = this.lotteries.find((el) => el.id === lotteryId);
    if (!parent) {
      return Promise.reject(new Error(`ID为[${lotteryId}]的分组不存在`));
    }
    if (
      this.lotteryOptions.find(
        (el) => el.lotteryId === lotteryId && name === el.name
      )
    ) {
      return Promise.reject(new Error("该分组下已存在同名选项"));
    }
    const option: ILotteryOption = {
      ...lotteryOptionDTO,
      id: randomName(),
      createdAt: performance.now(),
    };
    this.lotteryOptions.push(option);
    return Promise.resolve(option);
  }

  getLotteryDetail(id: string): Promise<ILotteryDetailResDTO> {
    const item = this.lotteries.find((el) => el.id === id);
    if (!item) return Promise.reject(new Error("数据不存在"));
    const options = this.lotteryOptions.filter((el) => el.lotteryId === id);
    return Promise.resolve({
      ...item,
      options,
    });
  }
}
