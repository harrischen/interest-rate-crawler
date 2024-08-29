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
export async function GetBeaBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "東亞",
    url: "https://www.hkbea.com/html/tc/bea-personal-banking-supremegold-time-deposit.html",
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
  const table = $('p:contains("網上港元定期存款特惠年利率 (%)")').next("table");

  // 简单粗暴的指定定期数据
  output["3M"] = table.find("tr").eq(3).find("td").eq(1).text().trim();
  output["6M"] = table.find("tr").eq(4).find("td").eq(1).text().trim();
  output["12M"] = table.find("tr").eq(5).find("td").eq(1).text().trim();

  return FormatInterestOutput(output);
}
