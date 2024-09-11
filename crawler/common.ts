import * as fs from "fs";
import * as puppeteer from "puppeteer";

const blockedResourceTypes = [
  "image",
  "media",
  "font",
  "texttrack",
  "object",
  "beacon",
  "csp_report",
  "imageset",
];

const skippedResources = [
  "quantserve",
  "adzerk",
  "doubleclick",
  "adition",
  "exelator",
  "sharethrough",
  "cdn.api.twitter",
  "google-analytics",
  "googletagmanager",
  "google",
  "fontawesome",
  "facebook",
  "analytics",
  "optimizely",
  "clicktale",
  "mixpanel",
  "zedo",
  "clicksor",
  "tiqcdn",
];

export async function WaitForElement(
  page: puppeteer.Page,
  selector: string,
  retries = 5
) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch (error) {
      console.log(`Retry ${i + 1}: ${selector} not found, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error(`Element ${selector} not found after ${retries} retries`);
}

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
      timeout: 0,
    });
    // 开启请求拦截功能
    await page.setRequestInterception(true);

    page.on("request", (req) => {
      const url = req.url();
      const resourceType = req.resourceType();

      const shouldBlockResourceType =
        blockedResourceTypes.includes(resourceType);
      const shouldSkipResource = skippedResources.some((resource) =>
        url.includes(resource)
      );

      if (shouldBlockResourceType || shouldSkipResource) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    const htmlContent = await page.content();
    await page.close();
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
export function SaveToJsonFile(data: any, filename: string): void {
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

/**
 * 格式化利率信息
 * @param val
 * @returns
 */
export function FormatRate(val: string): string {
  return val.trim().replace("%", "");
}

function PeriodMap(title: string) {
  const map: { [key: string]: string } = {
    一天: "1天",
    七天: "7天",
    "7日": "7天",
    "1週": "7天",
    "1星期": "7天",
    一星期: "7天",
    兩星期: "14天",
    "2星期": "14天",
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
    "7D": "",
    "1M": "",
    "3M": "",
    "6M": "",
    "12M": "",
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

/**
 * 将字符串里面的利率取出来
 * @param input
 * @returns
 */
export function ExtractPercentage(input: string) {
  const regex = /(\d+(\.\d+)?)%/;
  const match = input.match(regex);
  return match ? FormatRate(match[0]) : "";
}
