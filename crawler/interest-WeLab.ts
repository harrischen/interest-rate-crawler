import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FormatRate,
  FormatPeriod,
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetWeLabBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    bankName: "匯立銀行",
    group: "VirtualBank",
    url: "https://www.welab.bank/zh/",
    savingsUrl: "https://www.welab.bank/zh/feature/gosave_2/",
    depositUrl: "https://www.welab.bank/zh/feature/gosave_2/",
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
    const htmlContent = await FetchWebsiteContent(browser, output.depositUrl);
    output.savings = getSavingsDetail(htmlContent);
    output.deposit = getDepositDetail(htmlContent);
    return output;
  } catch (error) {
    console.log("----------------GetWeLabBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetWeLabBankInterestRate----------------");
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
    USD: "",
    CNY: "",
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

  // 找出指定的table
  const tr = $(".data-perks .d-md-block tbody tr");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tr.each((_, row) => {
    const tableDataCell = $(row).find("td");
    const rate = FormatRate($(tableDataCell).eq(1).text());
    const period = FormatPeriod($(tableDataCell).eq(0).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: 'GoSave 2.0 定期存款#優惠：',
    min: "10",
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
