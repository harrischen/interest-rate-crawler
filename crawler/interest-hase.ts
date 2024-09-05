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
export async function GetHaseBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "恒生银行",
    savingsUrl:
      "https://www.hangsengbank.com/zh-hk/personal/banking/rates/deposit-interest-rates/",
    depositUrl:
      "https://cms.hangseng.com/cms/emkt/pmo/grp06/p04/chi/index.html",
    url: "https://www.hangsengbank.com/en-hk/home/",
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
  const divDom = $(".rwd-interestRates-savingDepositRatesTable-container");
  const tbody = divDom.find(".rwd-table").find("tbody");
  return {
    HKD: tbody.find("tr").eq(1).find("td").eq(1).text().trim(),
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
  const hkdDom = $(
    '.tab-content[data-target="signature"] .table-title:contains("港元定期存款特優年利率")'
  )
    .next(".ui-table")
    .find("tbody")
    .find("tr");
  hkdDom.each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(1).text().trim();
      if (rate && period && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const hkdDom = $(
    '.tab-content[data-target="signature"] .table-title:contains("美元定期存款特優年利率")'
  )
    .next(".ui-table")
    .find("tbody")
    .find("tr");
  hkdDom.each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(1).text().trim();
      if (rate && period && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "",
    min: "2000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();
  const hkdDom = $(
    '.tab-content[data-target="signature"] .table-title:contains("人民幣定期存款特優年利率")'
  )
    .next(".ui-table")
    .find("tbody")
    .find("tr");
  hkdDom.each((_, row) => {
    if (_ !== 0) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(1).text().trim();
      if (rate && period && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}
