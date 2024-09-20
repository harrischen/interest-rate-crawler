import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FormatRate,
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
export async function GetBeaBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    bankName: "東亞銀行",
    group: "OtherTraditionalBank",
    url: "https://www.hkbea.com/html/tc/index.html",
    savingsUrl: `https://www.hkbea.com/cgi-bin/rate_hkddr.jsp?language=tc&language=tc`,
    depositUrl: `https://www.hkbea.com/html/tc/bea-personal-banking-supremegold-time-deposit.html`,
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
    // 获取活期利率信息
    const savingsContent = await FetchWebsiteContent(
      browser,
      output.savingsUrl
    );
    output.savings = getSavingsDetail(savingsContent);

    // 获取定期利率信息
    const depositContent = await FetchWebsiteContent(
      browser,
      output.depositUrl
    );
    output.deposit = getDepositDetail(depositContent);
    return output;
  } catch (error) {
    console.log("----------------GetBeaBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetBeaBankInterestRate----------------");
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

  const tbody = $(".table1 tbody");
  return {
    HKD: FormatRate(tbody.find("tr").eq(3).find("td").eq(1).text()),
    CNY: "",
    USD: "",
  };
}

/**
 * 获取定期存款
 * @param html
 * @returns
 */
function getDepositDetail(html: string) {
  return {
    HKD: [getDetailWithHKD(html)],
    CNY: [getDetailWithCNY(html)],
    USD: [getDetailWithUSD(html)],
  };
}

function getDetailWithHKD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const table = $('p:contains("網上港元定期存款特惠年利率 (%)")').next("table");
  const tr = table.find("tr");

  // 简单粗暴的指定定期数据
  output["3M"] = FormatRate(tr.eq(3).find("td").eq(2).text().split("/")?.[0]);
  output["6M"] = FormatRate(tr.eq(4).find("td").eq(2).text().split("/")?.[0]);
  output["12M"] = FormatRate(tr.eq(5).find("td").eq(2).text().split("/")?.[0]);

  return {
    title: "至尊理財",
    min: "10000",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  // 找出指定的table
  const table = $('p:contains("網上美元定期存款特惠年利率(%)")').next("table");
  const tr = table.find("tr");

  // 简单粗暴的指定定期数据
  output["3M"] = FormatRate(tr.eq(3).find("td").eq(2).text().split("/")?.[0]);
  output["6M"] = FormatRate(tr.eq(4).find("td").eq(2).text().split("/")?.[0]);
  output["12M"] = FormatRate(tr.eq(5).find("td").eq(2).text().split("/")?.[0]);

  return {
    title: "至尊理財",
    min: "1000",
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
