import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateResp, IInterestResp } from "./../type";
import { GetInterestTemplate, FormatInterestOutput } from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetHkCommBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateResp = {
    group: "OtherTraditionalBank",
    bankName: "交通銀行(香港)",
    savingsUrl: ``,
    depositUrl: ``,
    url: "https://www.hk.bankcomm.com/hk/shtml/hk/tw/2004972/list.shtml",
    savings: {
      HKD: "",
      USD: "",
      CNY: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
      USD: [] as IInterestResp[],
      CNY: [] as IInterestResp[],
    },
  };
  return output;
}

/**
 * 获取活期存款
 * @param html
 * @returns
 */
function getSavingsDetail(html: string) {
  return {
    HKD: "",
    CNY: "",
    USD: "",
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  return {
    HKD: [getDetailWithHKD(html)],
    CNY: [getDetailWithCNY(html)],
    USD: [getDetailWithUSD(html)],
  };
}

function getDetailWithHKD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  return {
    title: "",
    min: "",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  return {
    title: "",
    min: "",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  return {
    title: "",
    min: "",
    rates: FormatInterestOutput(output),
  };
}
