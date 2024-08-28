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
 * 获取WeLab银行的利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetCcbBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "建行亞洲",
    url: "https://www.asia.ccb.com/hongkong_tc/personal/accounts/dep_rates.html",
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

  $("#time_deposit_table tbody tr").each((_, row) => {
    const tableDataCell = $(row).find("td");
    const rate = $(tableDataCell).eq(1).text().trim();
    const period = FormatPeriod($(tableDataCell).eq(0).text().trim());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return FormatInterestOutput(output);
}
