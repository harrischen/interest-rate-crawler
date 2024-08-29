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
export async function GetPublicBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "大眾",
    url: "https://www.publicbank.com.hk/tc/usefultools/rates/depositinterestrates",
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
  const table = $("table.Table__StyledTable-sc-145r63p-8:first tbody");
  
  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("th").eq(0).text().trim());
    const rate = $(row).find("td").eq(0).text().trim();
    if (period && rate && output[period] === "") {
      output[period] = rate;
    }
  });

  return FormatInterestOutput(output);
}
