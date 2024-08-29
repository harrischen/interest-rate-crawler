import * as fs from "fs";
import { IBankListResp } from "./type";
import * as puppeteer from "puppeteer";

/**
 * 通过 puppeteer 访问指定的网站
 * @param browser
 * @param url
 * @returns
 */
export async function FetchWebsiteContent(
  browser: puppeteer.Browser,
  url: string
): Promise<string> {
  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 1000 * 60 * 5,
    });
    // 如果是众安的话，则模拟点击一次
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (url.indexOf("bank.za.group") !== -1) {
      await page.click(".InterestQueryTable_tabItem__2dCiB:first-child");
    }
    const htmlContent = await page.content();
    return htmlContent;
  } catch (error) {
    console.error(`Error fetching the page: ${error}`);
    throw error;
  }
}

/**
 * 将数据内容保存为一个 json 文件
 * @param data
 * @param filename
 */
export function SaveToJsonFile(data: IBankListResp[], filename: string): void {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * 格式化存期信息
 * @param period
 * @returns
 */
export function FormatPeriod(period: string): string {
  const replaceVal = PeriodMap(period.replace(/ /g, ""));
  const daysMatch = replaceVal.match(/(\d+)天/);
  const weeksMatch = replaceVal.match(/(\d+)週/);
  const monthsMatch = replaceVal.match(/(\d+)個月/);

  if (daysMatch) {
    return `${daysMatch[1]}D`;
  } else if (weeksMatch) {
    return `${weeksMatch[1]}W`;
  } else if (monthsMatch) {
    return `${monthsMatch[1]}M`;
  }
  return "";
}

function PeriodMap(title: string) {
  const map: { [key: string]: string } = {
    一天: "1天",
    七天: "7天",
    "1週": "7天",
    十四天: "14天",
    一個月: "1個月",
    兩個月: "2個月",
    三個月: "3個月",
    四個月: "4個月",
    五個月: "5個月",
    六個月: "6個月",
    九個月: "9個月",
    十二個月: "12個月",
    一年: "12個月",
    兩年: "24個月",
  };
  return map[title] || title;
}

/**
 * 业务逻辑场景下，统一的利率内容
 * @returns
 */
export function GetInterestTemplate(): { [key: string]: string } {
  return {
    "1D": "",
    "7D": "",
    "14D": "",
    "1M": "",
    "2M": "",
    "3M": "",
    "4M": "",
    "6M": "",
    "9M": "",
    "12M": "",
    "24M": "",
  };
}

/**
 * 业务逻辑场景下，返回标准且统一的数据格式
 * TODO: 优化数据结构，返回标准的数组格式
 * @param param
 * @returns
 */
export function FormatInterestOutput(param: { [key: string]: string }) {
  return param;
}
