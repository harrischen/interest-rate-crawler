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
