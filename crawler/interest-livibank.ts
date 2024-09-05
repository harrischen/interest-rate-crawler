import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import {
  FormatPeriod,
  ExtractPercentage,
  FetchWebsiteContent,
  GetInterestTemplate,
} from "./common";
import { IInterestResp } from "./type";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetLiviBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "Livi",
    url: "https://www.livibank.com/zh_HK/features/livisave.html",
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
  const hkd = $("#table-港幣 tbody tr").eq(0).find("td").eq(1).text();
  const usd = $("#table-美元 tbody tr").eq(0).find("td").eq(1).text();
  const cny = $("#table-人民幣 tbody tr").eq(0).find("td").eq(1).text();
  return {
    HKD: ExtractPercentage(hkd),
    USD: ExtractPercentage(usd),
    CNY: ExtractPercentage(cny),
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  const $ = cheerio.load(html);

  // 找出指定的table
  const tr = $(".time-deposit-rate-table-container-desktop tbody tr");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率

  const lowLevel = {
    title: "",
    min: "500 - 100000",
    rates: GetInterestTemplate(),
  };

  const highLevel = {
    title: "",
    min: "500 - 100000",
    rates: GetInterestTemplate(),
  };

  tr.each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text().trim());
    const lowRate = $(row).find("td").eq(1).text().trim();
    const highRate = $(row).find("td").eq(2).text().trim();
    if (lowRate && period && lowLevel.rates[period] === "") {
      lowLevel.rates[period] = lowRate;
    }
    if (highRate && period && highLevel.rates[period] === "") {
      highLevel.rates[period] = highRate;
    }
  });

  return {
    HKD: [lowLevel, highLevel],
  };
}
