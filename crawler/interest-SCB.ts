import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FormatRate,
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
export async function GetScBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    bankName: "渣打銀行",
    group: "1stTierBank",
    url: "https://www.sc.com/hk/zh/",
    savingsUrl: "https://www.sc.com/hk/zh/deposits/board-rates/",
    depositUrl: "https://www.sc.com/hk/zh/deposits/online-time-deposit/",
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
    console.log("----------------GetScBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetScBankInterestRate----------------");
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
    HKD: FormatRate(hkd.find("tr").eq(0).find("td").eq(1).text()),
    CNY: FormatRate(cny.find("tr").eq(0).find("td").eq(1).text()),
    USD: FormatRate(usd.find("tr").eq(0).find("td").eq(1).text()),
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
  output["3M"] = FormatRate(tr.eq(0).find("td").eq(3).text());
  output["6M"] = FormatRate(tr.eq(1).find("td").eq(1).text());
  output["12M"] = FormatRate(tr.eq(2).find("td").eq(1).text());

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
  output["3M"] = FormatRate(tr.eq(3).find("td").eq(3).text());
  output["6M"] = FormatRate(tr.eq(4).find("td").eq(1).text());
  output["12M"] = FormatRate(tr.eq(5).find("td").eq(1).text());

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
  output["3M"] = FormatRate(tr.eq(6).find("td").eq(3).text());
  output["6M"] = FormatRate(tr.eq(7).find("td").eq(1).text());
  output["12M"] = FormatRate(tr.eq(8).find("td").eq(1).text());

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}
