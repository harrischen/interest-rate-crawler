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
export async function GetChBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "創興",
    url: "https://www.chbank.com/tc/personal/banking-services/useful-information/deposit-rates/index.shtml",
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
  const tbody = $("#rateTable tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  const rateRow = tbody.find("tr").eq(2);
  output["1D"] = rateRow.find("td").eq(2).text().trim();
  output["7D"] = rateRow.find("td").eq(3).text().trim();
  output["14D"] = rateRow.find("td").eq(4).text().trim();
  output["1M"] = rateRow.find("td").eq(5).text().trim();
  output["2M"] = rateRow.find("td").eq(6).text().trim();
  output["3M"] = rateRow.find("td").eq(7).text().trim();
  output["6M"] = rateRow.find("td").eq(8).text().trim();
  output["9M"] = rateRow.find("td").eq(9).text().trim();
  output["12M"] = rateRow.find("td").eq(10).text().trim();
  output["24M"] = rateRow.find("td").eq(11).text().trim();

  return FormatInterestOutput(output);
}
