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
export async function GetWeLabBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "汇立",
    url: "https://www.welab.bank/zh/feature/gosave_2/",
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
  return {
    HKD: "",
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
  const tr = $(".data-perks .d-md-block tbody tr");

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  tr.each((_, row) => {
    const tableDataCell = $(row).find("td");
    const rate = $(tableDataCell).eq(1).text().trim();
    const period = FormatPeriod($(tableDataCell).eq(0).text().trim());
    if (rate && period && hkdOutput[period] === "") {
      hkdOutput[period] = rate;
    }
  });

  return {
    minAmt: {
      HKD: "-",
    },
    interestRates: {
      HKD: FormatInterestOutput(hkdOutput),
      CNY: [],
      USD: [],
    },
  };
}
