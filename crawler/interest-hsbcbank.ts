import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  FormatPeriod,
  GetInterestTemplate,
  FetchWebsiteContent,
  FormatInterestOutput,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetHsbcBankInterestRate(browser: puppeteer.Browser) {
  const domain = "https://www.hsbc.com.hk";
  const output = {
    bankName: "汇丰银行",
    savingsUrl: `${domain}/zh-hk/investments/market-information/hk/deposit-rate/`,
    depositUrl: `${domain}/zh-hk/accounts/offers/deposits/`,
    savings: {
      HKD: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
    },
  };
  try {
    const savingsContent = await FetchWebsiteContent(
      browser,
      output.savingsUrl
    );
    output.savings = getSavingsDetail(savingsContent);

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
  const hkd = $("#content_main_basicTable_7 tbody");
  const cny = $("#content_main_basicTable_15 tbody");
  const usd = $("#content_main_basicTable_23 tbody");
  return {
    HKD: hkd.find("tr").eq(1).find("td").eq(1).text(),
    CNY: cny.find("tr").eq(0).find("td").eq(1).text(),
    USD: usd.find("tr").eq(0).find("td").eq(1).text(),
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  return {
    HKD: [getPremierWithHKD(html), getOneWithHKD(html)],
    CNY: [getPremierWithCNY(html), getOneWithCNY(html)],
    USD: [getPremierWithUSD(html), getOneWithUSD(html)],
  };
}

/**
 * 滙豐卓越理財尊尚客戶
 * @param html
 * @returns
 */
function getPremierWithHKD(html: string) {
  const $ = cheerio.load(html);
  const rates = GetInterestTemplate();
  const tbody = $("#content_main_basicTable_1 tbody");
  tbody.find("tr").each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = $(row).find("td").eq(1).text();
      if (rate && period && rates[period] === "") {
        rates[period] = rate.trim();
      }
    }
  });
  return {
    title: "滙豐卓越理財尊尚客戶",
    min: "10000",
    rates: FormatInterestOutput(rates),
  };
}

/**
 * 滙豐One客户
 * @param html
 * @returns
 */
function getOneWithHKD(html: string) {
  const $ = cheerio.load(html);
  const rates = GetInterestTemplate();
  const tbody = $("#content_main_basicTable_3 tbody");
  tbody.find("tr").each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = $(row).find("td").eq(1).text();
      if (rate && period && rates[period] === "") {
        rates[period] = rate.trim();
      }
    }
  });
  return {
    title: "滙豐One",
    min: "10000",
    rates: FormatInterestOutput(rates),
  };
}

/**
 * 滙豐卓越理財尊尚客戶
 * @param html
 * @returns
 */
function getPremierWithUSD(html: string) {
  const $ = cheerio.load(html);
  const rates = GetInterestTemplate();
  const tbody = $("#content_main_basicTable_9 tbody");
  tbody.find("tr").each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = $(row).find("td").eq(1).text();
      if (rate && period && rates[period] === "") {
        rates[period] = rate.trim();
      }
    }
  });
  return {
    title: "滙豐卓越理財尊尚客戶",
    min: "2000",
    rates: FormatInterestOutput(rates),
  };
}

/**
 * 滙豐One客户
 * @param html
 * @returns
 */
function getOneWithUSD(html: string) {
  const $ = cheerio.load(html);
  const rates = GetInterestTemplate();
  const tbody = $("#content_main_basicTable_11 tbody");
  tbody.find("tr").each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = $(row).find("td").eq(1).text();
      if (rate && period && rates[period] === "") {
        rates[period] = rate.trim();
      }
    }
  });
  return {
    title: "滙豐One",
    min: "2000",
    rates: FormatInterestOutput(rates),
  };
}

/**
 * 滙豐卓越理財尊尚客戶
 * @param html
 * @returns
 */
function getPremierWithCNY(html: string) {
  const $ = cheerio.load(html);
  const rates = GetInterestTemplate();
  const tbody = $("#content_main_basicTable_17 tbody");
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = $(row).find("td").eq(1).text();
    if (rate && period && rates[period] === "") {
      rates[period] = rate.trim();
    }
  });
  return {
    title: "滙豐卓越理財尊尚客戶",
    min: "10000",
    rates: FormatInterestOutput(rates),
  };
}

/**
 * 滙豐One客户
 * @param html
 * @returns
 */
function getOneWithCNY(html: string) {
  const $ = cheerio.load(html);
  const rates = GetInterestTemplate();
  const tbody = $("#content_main_basicTable_19 tbody");
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = $(row).find("td").eq(1).text();
    if (rate && period && rates[period] === "") {
      rates[period] = rate.trim();
    }
  });
  return {
    title: "滙豐One",
    min: "10000",
    rates: FormatInterestOutput(rates),
  };
}
