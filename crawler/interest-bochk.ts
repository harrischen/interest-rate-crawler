import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  FormatPeriod,
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  ExtractPercentage,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetBocHkBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "中国银行(香港)",
    savingsUrl: `https://www.bochk.com/whk/rates/depositRates/depositRates-input.action?lang=hk`,
    depositUrl: `https://www.bochk.com/tc/deposits/promotion/timedeposits.html`,
    url: `https://www.bochk.com/tc/home.html`,
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
    const page = await browser.newPage();
    await page.goto(output.savingsUrl, {
      waitUntil: "networkidle2",
      timeout: 1000 * 60 * 5,
    });
    await page.select("#depositRates_form_currency_field", "HKD");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const hkdSavingsContent = await page.content();
    output.savings.HKD = getSavingsDetail(hkdSavingsContent);

    await page.select("#depositRates_form_currency_field", "USD");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const usdSavingsContent = await page.content();
    output.savings.USD = getSavingsDetail(usdSavingsContent);

    await page.select("#depositRates_form_currency_field", "CNY");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cnySavingsContent = await page.content();
    output.savings.CNY = getSavingsDetail(cnySavingsContent);

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
  const tbody = $("#depositRates_form .width-100-percent tbody");
  return tbody.find("tr").eq(3).find("td").eq(1).text().trim();
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
  const tableRow = $("#ui-id-2 tbody tr").eq(1);
  const tableDataCell = $(tableRow).find("td");
  output["3M"] = $(tableDataCell).eq(2).text().trim();
  output["6M"] = $(tableDataCell).eq(3).text().trim();
  output["12M"] = $(tableDataCell).eq(4).text().trim();

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const tableRow = $("#ui-id-2 tbody tr").eq(3);
  const tableDataCell = $(tableRow).find("td");
  output["3M"] = $(tableDataCell).eq(2).text().trim();
  output["6M"] = $(tableDataCell).eq(3).text().trim();
  output["12M"] = $(tableDataCell).eq(4).text().trim();

  return {
    title: "",
    min: "1000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const tableRow = $("#ui-id-2 tbody tr").eq(5);
  const tableDataCell = $(tableRow).find("td");
  output["3M"] = $(tableDataCell).eq(2).text().trim();
  output["6M"] = $(tableDataCell).eq(3).text().trim();
  output["12M"] = $(tableDataCell).eq(4).text().trim();

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}
