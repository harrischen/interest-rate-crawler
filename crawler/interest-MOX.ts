import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import { GetInterestTemplate, FormatInterestOutput, FetchWebsiteContent } from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetMoxBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    group: "VirtualBank",
    bankName: "Mox",
    savingsUrl: `https://www.cncbinternational.com/home/tc/index.jsp`,
    depositUrl: `https://www.cncbinternational.com/home/tc/index.jsp`,
    url: "https://www.cncbinternational.com/home/tc/index.jsp",
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

  try {
    const htmlContent = await FetchWebsiteContent(browser, output.url);
    output.savings = getSavingsDetail(htmlContent);
    output.deposit = getDepositDetail(htmlContent);
    return output;
  } catch (error) {
    console.log("----------------GetMoxBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetMoxBankInterestRate----------------");
    return output;
  }
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
