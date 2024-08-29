import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
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
export async function GetDahSingBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "大新",
    url: "https://www.dahsing.com/html/tc/deposit/fixed_deposit/hkd_fixed_deposit.html",
    interestRate: {
      HKD: {} as { [key: string]: string },
    },
  };
  try {
    const htmlContent = await FetchWebsiteContent(browser, output.url);
    output.interestRate.HKD = parseHtmlContent(htmlContent);
    return output;
  } catch (error) {
    return output;
  }
}

function parseHtmlContent(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const tbody = $(".jspPane table:first tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  output["1M"] = tbody.find("tr").eq(0).find("td").eq(1).text().trim();
  output["3M"] = tbody.find("tr").eq(0).find("td").eq(2).text().trim();
  output["6M"] = tbody.find("tr").eq(0).find("td").eq(3).text().trim();
  output["12M"] = tbody.find("tr").eq(0).find("td").eq(4).text().trim();

  return FormatInterestOutput(output);
}
