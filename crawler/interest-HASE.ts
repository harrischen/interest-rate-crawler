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
export async function GetHaseBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    bankName: "恒生銀行",
    group: "1stTierBank",
    url: "https://www.hangsengbank.com/en-hk/home/",
    savingsUrl: `https://www.hangsengbank.com/zh-hk/personal/banking/rates/deposit-interest-rates/`,
    depositUrl: `https://cms.hangseng.com/cms/emkt/pmo/grp06/p04/chi/index.html`,
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
    console.log("----------------GetHaseBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetHaseBankInterestRate----------------");
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
  const targetDom = $(".rwd-interestRates-savingDepositRatesTable-container");
  const tbody = targetDom.find(".rwd-table").find("tbody");
  return {
    HKD: FormatRate(tbody.find("tr").eq(1).find("td").eq(1).text()),
    USD: "",
    CNY: "",
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
  const targetDom = $(
    '.tableWrapper_signature .table-title:contains("港元定期存款特優年利率")'
  );
  const tr = targetDom.next(".ui-table").find("tbody").find("tr");
  tr.each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = FormatRate($(row).find("td").eq(1).text());
      if (rate && period && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "特優年利率 (%)",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const targetDom = $(
    '.tableWrapper_signature .table-title:contains("美元定期存款特優年利率")'
  );
  const tr = targetDom.next(".ui-table").find("tbody").find("tr");
  tr.each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = FormatRate($(row).find("td").eq(1).text());
      if (rate && period && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "特優年利率 (%)",
    min: "2000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const targetDom = $(
    '.tableWrapper_signature .table-title:contains("人民幣定期存款特優年利率")'
  );
  const tr = targetDom.next(".ui-table").find("tbody").find("tr");
  tr.each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text());
      const rate = FormatRate($(row).find("td").eq(1).text());
      if (rate && period && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "特優年利率 (%)",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}
