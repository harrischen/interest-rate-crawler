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
export async function GetScBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    cnName: "渣打",
    url: "https://www.sc.com/hk/zh/deposits/online-time-deposit/",
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

  // 获取当前 HKD 有多少种存期
  // 这里是潜规则，第一行的数据一定是 HKD
  const firstTableRow = $("#table-content-253993-1 tbody tr").eq(0);
  const rowSpan = $(firstTableRow).find("td:eq(0)").attr("rowspan") || "0";
  // 遍历表格，获取 HKD 的利率信息
  $("#table-content-253993-1 tbody tr").each((_, row) => {
    if (_ === Number(rowSpan)) {
      return false;
    }
    const tableDataCell = $(row).find("td");
    const rate = tableDataCell.eq(-1).text().trim();
    const period = FormatPeriod(tableDataCell.eq(-2).text().trim());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return FormatInterestOutput(output);
}
