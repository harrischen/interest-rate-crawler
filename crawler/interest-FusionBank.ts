import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FormatRate,
  FormatPeriod,
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
export async function GetFusionBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    bankName: "富融銀行",
    group: "VirtualBank",
    url: "https://www.fusionbank.com/?lang=tc",
    savingsUrl: "https://www.fusionbank.com/deposit.html?lang=tc",
    depositUrl: "https://www.fusionbank.com/deposit.html?lang=tc",
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
      output.depositUrl
    );
    output.savings = getSavingsDetail(savingsContent);

    // 获取定期存款的利率信息
    const depositPage = await browser.newPage();
    await depositPage.goto(output.depositUrl, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const hkdDepositContent = await depositPage.content();
    output.deposit.HKD = getDepositDetail(hkdDepositContent).HKD;

    await depositPage.click(".deposit-time-item:nth-child(2)");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const cnyDepositContent = await depositPage.content();
    output.deposit.CNY = getDepositDetail(cnyDepositContent).CNY;

    await depositPage.click(".deposit-time-item:last-child");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const usdDepositContent = await depositPage.content();
    output.deposit.USD = getDepositDetail(usdDepositContent).USD;

    await depositPage.close();
    return output;
  } catch (error) {
    console.log("----------------GetFusionBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetFusionBankInterestRate----------------");
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
  const targetDom = $(".deposit-current").children("div");
  return {
    HKD: FormatRate(targetDom.eq(0).children("div").eq(1).text()),
    CNY: FormatRate(targetDom.eq(1).children("div").eq(1).text()),
    USD: FormatRate(targetDom.eq(2).children("div").eq(1).text()),
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
  const tbody = $(".deposit-table tbody");

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
  const tbody = $(".deposit-table tbody");

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

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const tbody = $(".deposit-table tbody");

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
