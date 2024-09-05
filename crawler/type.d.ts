export interface IBankListResp {
  bankName: string;
  bankLink: string | null;
}

export interface IInterestResp {
  min: string;
  rates: {
    [key: string]: string;
  };
}
