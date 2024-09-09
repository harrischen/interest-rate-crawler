import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  FormatPeriod,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetScBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "恒生银行",
    savingsUrl: "https://www.sc.com/hk/zh/deposits/board-rates/",
    depositUrl: "https://www.sc.com/hk/zh/deposits/online-time-deposit/",
    url: "https://www.sc.com/hk/zh/",
    savings: {
      HKD: "",
      USD: "",
      CNY: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
    },
  };
  try {
    // 获取活期利率信息
    const savingsContent = await FetchWebsiteContent(
      browser,
      output.savingsUrl
    );
    output.savings = getSavingsDetail(savingsContent);

    // 获取定期利率信息
    const depositContent = await FetchWebsiteContent(
      browser,
      output.depositUrl
    );
    output.deposit = getDepositDetail(depositContent);
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
  const hkd = $('h3:contains("港元存款利率")')
    .parent(".header")
    .next(".content")
    .find("table")
    .find("tbody");
  const cny = $('h3:contains("人民幣存款利率")')
    .parent(".header")
    .next(".content")
    .find("table")
    .find("tbody");
  const usd = $('h3:contains("美元存款利率")')
    .parent(".header")
    .next(".content")
    .find("table")
    .find("tbody");
  return {
    HKD: hkd.find("tr").eq(0).find("td").eq(1).text().trim(),
    CNY: cny.find("tr").eq(0).find("td").eq(1).text().trim(),
    USD: usd.find("tr").eq(0).find("td").eq(1).text().trim(),
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

  const tr = $("#table-content-253993-1 tbody").find("tr");
  output["3M"] = tr.eq(0).find("td").eq(3).text();
  output["6M"] = tr.eq(1).find("td").eq(1).text();
  output["12M"] = tr.eq(2).find("td").eq(1).text();

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const tr = $("#table-content-253993-1 tbody").find("tr");
  output["3M"] = tr.eq(3).find("td").eq(3).text();
  output["6M"] = tr.eq(4).find("td").eq(1).text();
  output["12M"] = tr.eq(5).find("td").eq(1).text();

  return {
    title: "",
    min: "2000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const tr = $("#table-content-253993-1 tbody").find("tr");
  output["3M"] = tr.eq(6).find("td").eq(3).text();
  output["6M"] = tr.eq(7).find("td").eq(1).text();
  output["12M"] = tr.eq(8).find("td").eq(1).text();

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}
