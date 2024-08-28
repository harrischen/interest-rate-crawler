import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
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
export async function GetPaoBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    cnName: "平安壹賬通",
    url: "https://www.paob.com.hk/tc/retail-savings.html",
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

  $(".table tbody tr").each((_, row) => {
    const tableDataCell = $(row).find("td");
    const rate = $(tableDataCell).eq(1).text().trim();
    const period = FormatPeriod($(tableDataCell).eq(0).text().trim());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return FormatInterestOutput(output);
}
