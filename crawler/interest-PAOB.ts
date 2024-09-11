import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateResp, IInterestResp } from "./../type";
import {
  FormatPeriod,
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  ExtractPercentage,
  FormatRate,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetPaoBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateResp = {
    group: "VirtualBank",
    bankName: "平安壹賬通",
    url: "https://www.paob.com.hk/tc/index.html",
    savingsUrl: "https://www.paob.com.hk/tc/retail-savings.html",
    depositUrl: "https://www.paob.com.hk/tc/retail-savings.html",
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
    console.log("----------------GetPaoBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetPaoBankInterestRate----------------");
    return output;
  }
}

/**
 * 获取活期存款
 * @param html
 * @returns
 */
function getSavingsDetail(html: string) {
  const $ = cheerio.load(html);
  const targetDom = $(".des-block ul").eq(0).find("li").eq(0);
  return {
    HKD: ExtractPercentage(targetDom.text()),
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
  const tr = $(".table tbody tr");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tr.each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(1).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "",
    min: "100",
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
