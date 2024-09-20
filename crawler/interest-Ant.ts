import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FormatRate,
  FormatPeriod,
  ExtractPercentage,
  GetInterestTemplate,
  FormatInterestOutput,
  FetchWebsiteContent,
} from "./common";
import Decimal from "decimal.js-light";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetAntBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    group: "VirtualBank",
    bankName: "蚂蚁銀行",
    url: "https://www.antbank.hk/home?lang=zh_hk",
    savingsUrl: "https://www.antbank.hk/rates?lang=zh_hk",
    depositUrl: "https://www.antbank.hk/rates?lang=zh_hk",
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
    // 获取活期存款的利率信息
    const savingsContent = await FetchWebsiteContent(
      browser,
      output.savingsUrl
    );
    output.savings = getSavingsDetail(savingsContent);

    // 获取定期存款的利率信息
    const depositContent = await FetchWebsiteContent(
      browser,
      output.depositUrl
    );
    output.deposit = getDepositDetail(depositContent);

    return output;
  } catch (error) {
    console.log("----------------GetAntBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetAntBankInterestRate----------------");
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
  const target = $('p:contains("活期儲蓄帳戶")').first();
  const table = target.siblings("table").first();
  const tbody = table.find("tbody").first();
  const hkd = tbody.find("tr").eq(0).find("td").eq(1).text();
  const usd = tbody.find("tr").eq(1).find("td").eq(1).text();
  const cny = tbody.find("tr").eq(2).find("td").eq(1).text();

  return {
    HKD: ExtractPercentage(hkd),
    CNY: ExtractPercentage(cny),
    USD: ExtractPercentage(usd),
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

  const target = $('div:contains("港幣定期存款年利率及新資金")');
  const table = target.parents().first();
  const tr = table
    .find("[class^=rateTableList]")
    .not("[class*=rateTableFirstList]");

  tr.each((_, row) => {
    const period = FormatPeriod($(row).find("div").eq(0).text());
    const normalRate = $(row).find("div").eq(1).text();
    const newRate = $(row).find("div").eq(2).text();
    if (normalRate && newRate && period && output[period] === "") {
      const decimalRate = new Decimal(FormatRate(normalRate));
      const rate = decimalRate.add(FormatRate(newRate)).toFixed(2);
      output[period] = FormatRate(rate);
    }
  });

  return {
    title: "定期存款 + 新資金額外加息",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  return {
    title: "定期存款 + 新資金額外加息",
    min: "",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const target = $('div:contains("美元定期存款年利率及新資金")');
  const table = target.parents().first();
  const tr = table
    .find("[class^=rateTableList]")
    .not("[class*=rateTableFirstList]");

  tr.each((_, row) => {
    const period = FormatPeriod($(row).find("div").eq(0).text());
    const normalRate = $(row).find("div").eq(1).text();
    const newRate = $(row).find("div").eq(2).text();
    if (normalRate && newRate && period && output[period] === "") {
      const decimalRate = new Decimal(FormatRate(normalRate));
      const rate = decimalRate.add(FormatRate(newRate)).toFixed(2);
      output[period] = FormatRate(rate);
    }
  });

  return {
    title: "定期存款 + 新資金額外加息",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}
