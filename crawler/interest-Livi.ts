import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateResp, IInterestResp } from "./../type";
import {
  FormatRate,
  FormatPeriod,
  ExtractPercentage,
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
export async function GetLiviBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateResp = {
    group: "VirtualBank",
    bankName: "理慧銀行",
    url: "https://www.livibank.com/zh_HK/",
    savingsUrl: "https://www.livibank.com/zh_HK/features/livisave.html",
    depositUrl: "https://www.livibank.com/zh_HK/features/livisave.html",
    savings: {
      HKD: "",
      USD: "",
      CNY: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
      USD: [] as IInterestResp[],
      CNY: [] as IInterestResp[],
    },
  };
  try {
    const htmlContent = await FetchWebsiteContent(browser, output.depositUrl);
    output.savings = getSavingsDetail(htmlContent);
    output.deposit = getDepositDetail(htmlContent);
    return output;
  } catch (error) {
    console.log("----------------GetLiviBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetLiviBankInterestRate----------------");
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
  const hkd = $("#table-港幣 tbody tr").eq(0).find("td").eq(1).text();
  const usd = $("#table-美元 tbody tr").eq(0).find("td").eq(1).text();
  const cny = $("#table-人民幣 tbody tr").eq(0).find("td").eq(1).text();
  return {
    HKD: ExtractPercentage(hkd),
    USD: ExtractPercentage(usd),
    CNY: ExtractPercentage(cny),
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  return {
    HKD: [getLowLevelWithHKD(html), getHighLevelWithHKD(html)],
    CNY: [getDetailWithCNY(html)],
    USD: [getDetailWithUSD(html)],
  };
}

function getLowLevelWithHKD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const tr = $(".time-deposit-rate-table-container-desktop tbody tr");
  tr.each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(1).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "",
    min: "500",
    rates: FormatInterestOutput(output),
  };
}

function getHighLevelWithHKD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const tr = $(".time-deposit-rate-table-container-desktop tbody tr");
  tr.each((_, row) => {
    const period = FormatPeriod($(row).find("td").eq(0).text());
    const rate = FormatRate($(row).find("td").eq(2).text());
    if (rate && period && output[period] === "") {
      output[period] = rate;
    }
  });

  return {
    title: "",
    min: "100000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  return {
    title: "",
    min: "",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  return {
    title: "",
    min: "",
    rates: FormatInterestOutput(output),
  };
}
