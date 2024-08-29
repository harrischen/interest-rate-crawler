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
export async function GetWingLungBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "招商永隆",
    url: "https://www.cmbwinglungbank.com/ibanking/CnCoFiiDepratDsp.jsp",
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
  const table = $("td.wl_deepgreen:contains('定期存款')")
    .closest("table")
    .first();

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  table.find("tr").each((_, row) => {
    if (_ >= 2) {
      const period = FormatPeriod($(row).find("td").eq(0).text().trim());
      const rate = $(row).find("td").eq(2).html()?.split("<br>")[0].trim();
      if (period && rate && output[period] === "") {
        output[period] = rate;
      }
    }
  });

  return FormatInterestOutput(output);
}
