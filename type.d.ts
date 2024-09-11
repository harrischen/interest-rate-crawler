export interface IBankListResp {
  bankName: string;
  bankLink: string | null;
}

export interface IInterestResp {
  min: string;
  title: string;
  rates: {
    [key: string]: string;
  };
}

export interface IGetRateResp {
  bankName: string;
  group: string;
  url: string;
  savingsUrl: string;
  depositUrl: string;
  savings: {
    HKD: string;
    USD: string;
    CNY: string;
  };
  deposit: {
    HKD: IInterestResp[];
    USD: IInterestResp[];
    CNY: IInterestResp[];
  };
}
