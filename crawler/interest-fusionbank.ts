import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
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
export async function GetFusionBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "富融银行",
    url: "https://www.fusionbank.com/deposit.html?lang=tc",
    savings: {
      HKD: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
    },
  };
  try {
    const htmlContent = await FetchWebsiteContent(browser, output.url);
    output.savings = getSavingsDetail(htmlContent);
    output.deposit = getDepositDetail(htmlContent);
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
  const targetDom = $(".deposit-current");
  return {
    HKD: targetDom.children('div').eq(0).children("div").eq(1).text(),
    CNY: targetDom.children('div').eq(1).children("div").eq(1).text(),
    USD: targetDom.children('div').eq(2).children("div").eq(1).text(),
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */

function getDepositDetail(html: string) {
  const $ = cheerio.load(html);
  const hkdOutput = GetInterestTemplate();

  // 找出指定的table
  const tbody = $(".deposit-table tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text().trim());
    const rate = $(row).find("td").eq(1).text().trim();
    if (rate && period && hkdOutput[period] === "") {
      hkdOutput[period] = rate;
    }
  });

  return {
    HKD: [
      {
        title: '',
        min: "0-49999",
        rates: FormatInterestOutput(hkdOutput),
      },
    ],
  };
}
