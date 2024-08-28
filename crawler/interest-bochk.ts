import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import {
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
export async function GetBocHkBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    cnName: "中銀",
    url: "https://www.bochk.com/tc/deposits/promotion/timedeposits.html",
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

  const tableRow = $("#ui-id-2 tbody tr").eq(1);
  const tableDataCell = $(tableRow).find("td");
  output["3M"] = $(tableDataCell).eq(2).text().trim();
  output["6M"] = $(tableDataCell).eq(3).text().trim();
  output["12M"] = $(tableDataCell).eq(4).text().trim();

  return FormatInterestOutput(output);
}
