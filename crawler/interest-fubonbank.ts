import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  FormatRate,
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  FormatPeriod,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetFuBonBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "富邦银行",
    savingsUrl: `https://www.chbank.com/tc/personal/banking-services/useful-information/deposit-rates/index.shtml?tab=cloudRate`,
    depositUrl: `https://www.fubonbank.com.hk/tc/deposit/latest-promotions/new-customers-promotion.html`,
    url: "https://www.fubonbank.com.hk/tc/home.html",
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
    return output;
  }
}

/**
 * 获取活期存款
 * @param html
 * @returns
 */
function getSavingsDetail(html: string) {
  return {
    HKD: "",
    CNY: "",
    USD: "",
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

  const target = $("h3:contains('特優港元定期存款優惠')").first();
  const table = target.nextAll(".table-responsive").first();
  const periodRow = table.find("tr").eq(0);
  const rateRow = table.find("tr").last();
  // 遍历存期信息，然后匹配相同的下标得到对应的利率
  periodRow.find("td").each((_, td) => {
    const period = FormatPeriod($(td).text().trim());
    const rate = rateRow.find("td").eq(_).text().trim();
    if (period && rate && output[period] === "") {
      output[period] = FormatRate(rate);
    }
  });

  return {
    title: "Fubon+ 手機應用程式限定 ─ 特優港元定期存款優惠",
    min: "500000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const target = $("h3:contains('特優美元定期存款優惠')").first();
  const table = target.nextAll(".table-responsive").first();
  const periodRow = table.find("tr").eq(0);
  const rateRow = table.find("tr").last();
  // 遍历存期信息，然后匹配相同的下标得到对应的利率
  periodRow.find("td").each((_, td) => {
    const period = FormatPeriod($(td).text().trim());
    const rate = rateRow.find("td").eq(_).text().trim();
    if (period && rate && output[period] === "") {
      output[period] = FormatRate(rate);
    }
  });

  return {
    title: "Fubon+ 手機應用程式限定 ─特優美元定期存款優惠",
    min: "65000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const target = $("h3:contains('外幣新資金定期存款優惠')").first();
  const table = target.nextAll(".table-responsive").first();
  const periodRow = table.find("tr").eq(1);
  const rateRow = table.find("tr").eq(2);
  // 遍历存期信息，然后匹配相同的下标得到对应的利率
  periodRow.find("td").each((_, td) => {
    const period = FormatPeriod($(td).text().trim());
    const rate = rateRow.find("td").eq(_).text().trim();
    if (period && rate && output[period] === "") {
      output[period] = FormatRate(rate);
    }
  });

  return {
    title: "Fubon+ 手機應用程式限定 ─ 外幣新資金定期存款優惠",
    min: "200000",
    rates: FormatInterestOutput(output),
  };
}
