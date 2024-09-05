import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
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
export async function GetAirStarBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "天星银行",
    url: "https://www.airstarbank.com/zh-hk/deposit.html",
    savings: {
      HKD: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
    },
  };
  try {
    const htmlContent = await FetchWebsiteContent(browser, output.url);
    output.savings = getSavingsDetail(htmlContent);
    output.deposit = getDepositDetail(htmlContent);
    return output;
  } catch (error) {
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
  const hkdDom = $("#sav-hkd2 tbody tr");
  const notHkdDom = $("#sav-non-hkd tbody tr");
  return {
    HKD: hkdDom.eq(1).find("td").eq(1).text(),
    USD: notHkdDom.eq(1).find("td").eq(2).text(),
    CNY: notHkdDom.eq(2).find("td").eq(2).text(),
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  const $ = cheerio.load(html);
  const hkdOutput = GetInterestTemplate();
  const cnyOutput = GetInterestTemplate();
  const usdOutput = GetInterestTemplate();

  // 找出指定的table
  const tr = $("#saving tbody tr");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  hkdOutput["7D"] = tr.eq(1).find("td").eq(2).text().trim();
  hkdOutput["1M"] = tr.eq(2).find("td").eq(1).text().trim();
  hkdOutput["3M"] = tr.eq(4).find("td").eq(1).text().trim();
  hkdOutput["6M"] = tr.eq(6).find("td").eq(1).text().trim();
  hkdOutput["12M"] = tr.eq(8).find("td").eq(1).text().trim();

  cnyOutput["7D"] = tr.eq(9).find("td").eq(2).text().trim();
  cnyOutput["1M"] = tr.eq(10).find("td").eq(1).text().trim();
  cnyOutput["3M"] = tr.eq(12).find("td").eq(1).text().trim();
  cnyOutput["6M"] = tr.eq(13).find("td").eq(1).text().trim();
  cnyOutput["12M"] = tr.eq(15).find("td").eq(1).text().trim();

  usdOutput["7D"] = tr.eq(16).find("td").eq(2).text().trim();
  usdOutput["1M"] = tr.eq(17).find("td").eq(1).text().trim();
  usdOutput["3M"] = tr.eq(19).find("td").eq(1).text().trim();
  usdOutput["6M"] = tr.eq(20).find("td").eq(1).text().trim();
  usdOutput["12M"] = tr.eq(22).find("td").eq(1).text().trim();

  return {
    HKD: [
      {
        title: "",
        min: "-",
        rates: FormatInterestOutput(hkdOutput),
      },
    ],
    CNY: [
      {
        title: "",
        min: "-",
        rates: FormatInterestOutput(cnyOutput),
      },
    ],
    USD: [
      {
        title: "",
        min: "-",
        rates: FormatInterestOutput(usdOutput),
      },
    ],
  };
}
