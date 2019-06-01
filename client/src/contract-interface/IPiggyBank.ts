import * as BigNumber from "bignumber.js";

interface Deposit {
    amount: BigNumber.BigNumber,
    period: BigNumber.BigNumber
}

export default interface IPiggyBank {
    deposit(_period: BigNumber.BigNumber): Promise<void>;
    expendPeriod(secondsToExtend: BigNumber.BigNumber, _id: BigNumber.BigNumber): Promise<void>;
    withdraw(_id: BigNumber.BigNumber): Promise<void>;
    isUserExist(address: string): Promise<boolean>;
    userToDeposit(address: string, id: BigNumber.BigNumber): Promise<Deposit>;
    userTotalDeposit(address: string): Promise<BigNumber.BigNumber>;
  }