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
export async function GetDbsBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "星展",
    url: "https://www.dbs.com.hk/personal-zh/promotion/OnlineTD-promo",
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
  const table = $("#new-fund .currency_table");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 3) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(1).text().trim();
      if (period && rate && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return FormatInterestOutput(output);
}
