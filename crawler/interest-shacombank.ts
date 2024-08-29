import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import {
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
export async function GetShaComBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "上商",
    url: "https://www.shacombank.com.hk/tch/personal/promotion/fix-rate.jsp",
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
  const target = $("p")
    .filter((i, e) => $(e).text().indexOf("港元、美元、人民幣") !== -1)
    .first();
  const tbody = target.next(".tableWrap").find("tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  const rateRow = tbody.find("tr").eq(0);
  output["1M"] = rateRow.find("td").eq(1).text().trim();
  output["3M"] = rateRow.find("td").eq(2).text().trim();
  output["6M"] = rateRow.find("td").eq(3).text().trim();
  output["12M"] = rateRow.find("td").eq(4).text().trim();

  return FormatInterestOutput(output);
}
