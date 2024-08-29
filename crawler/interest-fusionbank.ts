import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import {
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  FormatPeriod,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetFusionBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "富融",
    url: "https://www.fusionbank.com/deposit.html?lang=tc",
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
  const tbody = $(".deposit-table tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text().trim());
    const rate = $(row).find("td").eq(1).text().trim();
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return FormatInterestOutput(output);
}
