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
export async function GetZaBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "众安银行",
    url: "https://bank.za.group/hk/deposit",
    savings: {
      HKD: "",
    },
    deposit: {
      minAmt: {
        HKD: "",
      },
      interestRates: {
        HKD: {} as { [key: string]: string },
      },
    },
  };
  try {
    const page = await browser.newPage();
    await page.goto(output.url, {
      waitUntil: "networkidle2",
      timeout: 1000 * 60 * 5,
    });

    // 活期
    let htmlContent = await page.content();
    output.savings = getSavingsDetail(htmlContent);

    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.click(".InterestQueryTable_tabItem__2dCiB:first-child");

    // 定期
    htmlContent = await page.content();
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
  const targetDom = $(".InterestQueryTable_tabContent__onTgG tbody tr");
  return {
    HKD: targetDom.eq(0).find("td").eq(1).text(),
    CNY: targetDom.eq(0).find("td").eq(2).text(),
    USD: targetDom.eq(0).find("td").eq(3).text(),
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const tbody = $(".InterestQueryTable_tabContent__onTgG tbody");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tbody.find("tr").each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text().trim());
    const rate = $(row).find("td").eq(1).text().trim();
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    minAmt: {
      HKD: "1",
    },
    interestRates: {
      HKD: FormatInterestOutput(output),
    },
  };
}
