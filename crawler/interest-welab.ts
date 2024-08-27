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
export async function GetWeLabInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "匯立",
    url: "https://www.welab.bank/zh/feature/gosave_2/",
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

  $(".data-perks .d-md-block tbody tr").each((_, row) => {
    const tableDataCell = $(row).find("td");
    const rate = $(tableDataCell).eq(1).text().trim();
    const period = FormatPeriod($(tableDataCell).eq(0).text().trim());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return FormatInterestOutput(output);
}
