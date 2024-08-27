export interface IBankListResp {
  bankName: string;
  bankLink: string | null;
}

export interface IInterestResp {
  /** 存期 */
  deposit_period: string;
  /** 利率 */
  interest_rate: string;
}
