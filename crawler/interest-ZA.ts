import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateResp, IInterestResp } from "./../type";
import {
  GetInterestTemplate,
  FormatInterestOutput,
  FormatPeriod,
  FormatRate,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetZaBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateResp = {
    group: "VirtualBank",
    bankName: "眾安銀行",
    url: "https://bank.za.group/hk",
    savingsUrl: "https://bank.za.group/hk/deposit",
    depositUrl: "https://bank.za.group/hk/deposit",
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
    const page = await browser.newPage();
    await page.goto(output.depositUrl, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    // 活期
    let htmlContent = await page.content();
    output.savings = getSavingsDetail(htmlContent);

    await page.waitForSelector(".InterestQueryTable_tabItem__2dCiB");
    await page.click(".InterestQueryTable_tabItem__2dCiB:first-child");

    // 定期
    htmlContent = await page.content();
    output.deposit = getDepositDetail(htmlContent);
    return output;
  } catch (error) {
    console.log("----------------GetZaBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetZaBankInterestRate----------------");
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
  const targetDom = $(".InterestQueryTable_tabContent__onTgG tbody tr");
  return {
    HKD: FormatRate(targetDom.eq(0).find("td").eq(1).text()),
    CNY: FormatRate(targetDom.eq(0).find("td").eq(2).text()),
    USD: FormatRate(targetDom.eq(0).find("td").eq(3).text()),
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
  const tbody = $(".InterestQueryTable_tabContent__onTgG tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(1).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const tbody = $(".InterestQueryTable_tabContent__onTgG tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(3).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const tbody = $(".InterestQueryTable_tabContent__onTgG tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(2).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}
