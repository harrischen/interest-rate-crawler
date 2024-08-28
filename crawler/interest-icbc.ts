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
export async function GetIcbcBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "工銀亞洲",
    url: "https://www.icbcasia.com/hk/tc/personal/banking/rate/deposit-interest-rate/default.html",
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

  return FormatInterestOutput(output);
}
