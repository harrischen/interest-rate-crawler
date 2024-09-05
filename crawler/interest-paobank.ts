import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  FormatPeriod,
  FetchWebsiteContent,
  GetInterestTemplate,
  FormatInterestOutput,
  ExtractPercentage,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetPaoBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "平安壹賬通",
    url: "https://www.paob.com.hk/tc/retail-savings.html",
    savings: {
      HKD: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
    },
  };
  try {
    const htmlContent = await FetchWebsiteContent(browser, output.url);
    output.savings = getSavingsDetail(htmlContent);
    output.deposit = getDepositDetail(htmlContent);
    return output;
  } catch (error) {
    return output;
  }
}

/**
 * 获取活期存款
 * @param html
 * @returns
 */
function getSavingsDetail(html: string) {
  const $ = cheerio.load(html);
  const targetDom = $(".des-block ul").eq(0).find("li").eq(0);
  return {
    HKD: ExtractPercentage(targetDom.text().trim()),
    USD: "",
    CNY: "",
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  const $ = cheerio.load(html);
  const hkdOutput = GetInterestTemplate();

  // 找出指定的table
  const tr = $(".table tbody tr");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tr.each((_, row) => {
    const rate = $(row).find("td").eq(1).text().trim();
    const period = FormatPeriod($(row).find("td").eq(0).text().trim());
    if (rate && period && hkdOutput[period] === "") {
      hkdOutput[period] = rate;
    }
  });

  return {
    HKD: [
      {
        min: "100",
        rates: FormatInterestOutput(hkdOutput),
      },
    ],
  };
}
