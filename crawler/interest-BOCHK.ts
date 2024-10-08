import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  FormatRate,
  WaitForElement,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetBocHkBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    group: "1stTierBank",
    bankName: "中銀銀行(香港)",
    url: `https://www.bochk.com/tc/home.html`,
    savingsUrl: `https://www.bochk.com/whk/rates/depositRates/depositRates-input.action?lang=hk`,
    depositUrl: `https://www.bochk.com/tc/deposits/promotion/timedeposits.html`,
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
    const savingsPage = await browser.newPage();
    await savingsPage.goto(output.savingsUrl, {
      waitUntil: "networkidle2",
      timeout: 0,
    });
    await WaitForElement(savingsPage, "#depositRates_form_currency_field");
    await savingsPage.select("#depositRates_form_currency_field", "HKD");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const hkdSavingsContent = await savingsPage.content();
    output.savings.HKD = getSavingsDetail(hkdSavingsContent);

    await savingsPage.select("#depositRates_form_currency_field", "USD");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const usdSavingsContent = await savingsPage.content();
    output.savings.USD = getSavingsDetail(usdSavingsContent);

    await savingsPage.select("#depositRates_form_currency_field", "CNY");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const cnySavingsContent = await savingsPage.content();
    output.savings.CNY = getSavingsDetail(cnySavingsContent);
    await savingsPage.close();

    // 获取定期利率信息
    const depositContent = await FetchWebsiteContent(
      browser,
      output.depositUrl
    );
    output.deposit = getDepositDetail(depositContent);
    return output;
  } catch (error) {
    console.log("----------------GetBocHkBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetBocHkBankInterestRate----------------");
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
  return FormatRate(tbody.find("tr").eq(3).find("td").eq(1).text());
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
  const table = $('#ui-id-2').find('table').eq(0);
  const tr = table.find('tbody tr').eq(2);
  const td = $(tr).find("td");
  output["3M"] = FormatRate($(td).eq(1).text());
  output["6M"] = FormatRate($(td).eq(2).text());
  output["12M"] = FormatRate($(td).eq(3).text());

  return {
    title: "智盈理財/自在理財/個人客戶",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const table = $('#ui-id-2').find('table').eq(0);
  const tr = table.find('tbody tr').eq(4);
  const td = $(tr).find("td");
  output["3M"] = FormatRate($(td).eq(1).text());
  output["6M"] = FormatRate($(td).eq(2).text());
  output["12M"] = FormatRate($(td).eq(3).text());

  return {
    title: "智盈理財/自在理財/個人客戶",
    min: "1000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const table = $('#ui-id-2').find('table').eq(0);
  const tr = table.find('tbody tr').eq(6);
  const td = $(tr).find("td");
  output["3M"] = FormatRate($(td).eq(1).text());
  output["6M"] = FormatRate($(td).eq(2).text());
  output["12M"] = FormatRate($(td).eq(3).text());

  return {
    title: "智盈理財/自在理財/個人客戶",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}
