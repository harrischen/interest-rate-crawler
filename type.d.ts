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

export interface IGetRateData {
  bankName: string;
  group: string;
  url: string;
  savingsUrl: string;
  depositUrl: string;
  savings: { [key: string]: string };
  deposit: { [key: string]: IInterestResp[] };
}

export interface IGetRateResp {
  start: string;
  end: string;
  list: IGetRateData[];
}

export interface ITableData {
  bankName: string;
  savings: string;
  url: string;
  savingsUrl: string;
  depositUrl: string;
  deposit: IInterestResp[];
}

export interface ITableResp {
  [key: string]: {
    [key: string]: Array<ITableData>;
  };
}
