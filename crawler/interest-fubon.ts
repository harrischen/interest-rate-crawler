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
export async function GetFuBonBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    cnName: "富邦",
    url: "https://www.fubonbank.com.hk/tc/deposit/latest-promotions/new-customers-promotion.html",
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

  // 过滤出当前属于 HKD 的表格
  const table = $(".table-responsive").first();
  // 取第 1 行的数据表示存期
  const periodRow = table.find("tr").eq(0);
  // 取第 2 行的数据表示利率
  const rateRow = table.find("tr").eq(1);
  // 遍历存期信息，然后匹配相同的下标得到对应的利率
  periodRow.find("td").each((_, td) => {
    const period = FormatPeriod($(td).text().trim());
    if (period) {
      output[period] = rateRow.find("td").eq(_).text().trim();
    }
  });

  return FormatInterestOutput(output);
}
