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
export async function GetHangSengBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    cnName: "恒生",
    url: "https://cms.hangseng.com/cms/emkt/pmo/grp06/p04/chi/index.html",
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

  const title = $(".tableWrapper_signature .table-title");
  // 查询所有 title 的内容
  // 如果没有 港元定期 则直接退出即可
  if (!title.text().includes("港元定期")) {
    return output;
  }

  // 过滤出紧跟在指定 title 后面的那个table
  // 即可以过滤出港元的信息
  title.each((_, t) => {
    if ($(t).text().includes("港元定期")) {
      const tableRow = $(t).next(".ui-table").find("tr");
      tableRow.each((__, row) => {
        const tableDataCell = $(row).find("td");
        const rate = $(tableDataCell).eq(1).text().trim();
        const period = FormatPeriod($(tableDataCell).eq(0).text().trim());
        if (rate && period && output[period] === "") {
          output[period] = rate;
        }
      });
    }
  });

  return FormatInterestOutput(output);
}
