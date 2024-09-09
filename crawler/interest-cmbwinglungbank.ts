import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  FetchWebsiteContent,
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
export async function GetWingLungBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "招商永隆银行",
    savingsUrl: "https://www.cmbwinglungbank.com/ibanking/CnCoFiiDepratDsp.jsp",
    depositUrl: "https://www.cmbwinglungbank.com/ibanking/CnCoFiiDepratDsp.jsp",
    url: "https://www.cmbwinglungbank.com/wlb_corporate/hk/index.html",
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
  const $ = cheerio.load(html);
  const hkd = $('p:contains("港元存款利率")').next("table").find("tbody");
  const tbody = $(
    'td:contains("外幣儲蓄存款利率（適用於一般賬戶及招商永隆一卡通賬戶）")'
  ).parents("tbody");
  const cny = tbody.find('td:contains("人民幣 (RMB)")');
  const usd = tbody.find('td:contains("美元 (USD)")');
  return {
    HKD: FormatRate(hkd.find("tr").eq(4).find("td").eq(1).text().trim()),
    CNY: FormatRate(cny.parent("tr").find("td").eq(2).text().trim()),
    USD: FormatRate(usd.parent("tr").find("td").eq(2).text().trim()),
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
  const table = $("td.wl_deepgreen:contains('定期存款')")
    .closest("table")
    .first();

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 2) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(2).html()?.split("<br>")?.[1];
      if (period && rate && output[period] === "") {
        output[period] = rate.trim();
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

  // 找出指定的table
  const table = $("td.wl_deepgreen:contains('美元定期存款利率')")
    .closest("table")
    .first();

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 2) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(2).html()?.split("<br>")?.[1];
      if (period && rate && output[period] === "") {
        output[period] = rate.trim();
      }
    }
  });

  return {
    title: "",
    min: "1000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const table = $("td.wl_deepgreen:contains('人民幣定期存款利率')")
    .closest("table")
    .first();

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 2) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(2).html()?.split("<br>")?.[1];
      if (period && rate && output[period] === "") {
        output[period] = rate.trim();
      }
    }
  });

  return {
    title: "",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}
