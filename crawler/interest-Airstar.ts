import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  FormatRate,
  FormatPeriod,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetAirStarBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    bankName: "天星銀行",
    group: "VirtualBank",
    url: "https://www.airstarbank.com/zh-hk/",
    savingsUrl: "https://www.airstarbank.com/zh-hk/deposit.html",
    depositUrl: "https://www.airstarbank.com/zh-hk/deposit.html",
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
    console.log("----------------GetAirStarBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetAirStarBankInterestRate----------------");
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
    HKD: FormatRate(hkdDom.eq(1).find("td").eq(1).text()),
    USD: FormatRate(notHkdDom.eq(1).find("td").eq(2).text()),
    CNY: FormatRate(notHkdDom.eq(2).find("td").eq(2).text()),
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

  const target = $('#saving td:contains("港幣")');
  const firstRow = target.parent("tr");
  const targetPeriod = FormatPeriod(firstRow.find("td").eq(1).text());
  const targetRate = FormatRate(firstRow.find("td").eq(2).text());
  output[targetPeriod] = targetRate;

  const rowspan = target.attr("rowspan");
  const targetNextAll = firstRow.nextAll().slice(0, Number(rowspan) - 1);

  $(targetNextAll).each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(1).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "星息定存 提取自如",
    min: "1000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const target = $('#saving td:contains("美元")');
  const firstRow = target.parent("tr");
  const targetPeriod = FormatPeriod(firstRow.find("td").eq(1).text());
  const targetRate = FormatRate(firstRow.find("td").eq(2).text());
  output[targetPeriod] = targetRate;

  const rowspan = target.attr("rowspan");
  const targetNextAll = firstRow.nextAll().slice(0, Number(rowspan) - 1);

  $(targetNextAll).each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(1).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "星息定存 提取自如",
    min: "",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const target = $('#saving td:contains("人民幣")');
  const firstRow = target.parent("tr");
  const targetPeriod = FormatPeriod(firstRow.find("td").eq(1).text());
  const targetRate = FormatRate(firstRow.find("td").eq(2).text());
  output[targetPeriod] = targetRate;

  const rowspan = target.attr("rowspan");
  const targetNextAll = firstRow.nextAll().slice(0, Number(rowspan) - 1);

  $(targetNextAll).each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(1).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "星息定存 提取自如",
    min: "",
    rates: FormatInterestOutput(output),
  };
}
