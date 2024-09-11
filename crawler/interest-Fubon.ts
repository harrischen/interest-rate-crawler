import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateResp, IInterestResp } from "./../type";
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
  const output: IGetRateResp = {
    bankName: "富邦銀行",
    group: "OtherTraditionalBank",
    url: "https://www.fubonbank.com.hk/tc/home.html",
    savingsUrl: `https://www.chbank.com/tc/personal/banking-services/useful-information/deposit-rates/index.shtml?tab=cloudRate`,
    depositUrl: `https://www.fubonbank.com.hk/tc/deposit/latest-promotions/new-customers-promotion.html`,
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
    console.log("----------------GetFuBonBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetFuBonBankInterestRate----------------");
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
  const tbody = $("#rateTable3 tbody");
  const hkd = tbody.find("tr[title=HKD]").find("td").eq(1).text();
  const cny = tbody.find("tr[title=RMB]").find("td").eq(1).text();
  const usd = tbody.find("tr[title=USD]").find("td").eq(1).text();
  return {
    HKD: FormatRate(hkd),
    CNY: FormatRate(cny),
    USD: FormatRate(usd),
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
    const period = FormatPeriod($(td).text());
    const rate = rateRow.find("td").eq(_).text();
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
    const period = FormatPeriod($(td).text());
    const rate = rateRow.find("td").eq(_).text();
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
    const period = FormatPeriod($(td).text());
    const rate = rateRow.find("td").eq(_).text();
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
