import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IGetRateData, IInterestResp } from "./../type";
import {
  FormatRate,
  FormatPeriod,
  ExtractPercentage,
  GetInterestTemplate,
  FormatInterestOutput,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetAntBankInterestRate(browser: puppeteer.Browser) {
  const output: IGetRateData = {
    group: "VirtualBank",
    bankName: "蚂蚁銀行",
    url: "https://www.antbank.hk/home?lang=zh_hk",
    savingsUrl: "https://www.antbank.hk/personal-banking-services?lang=zh_hk",
    depositUrl: "https://www.antbank.hk/time-deposit?lang=zh_hk",
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
    // 获取活期存款的利率信息
    const savingsPage = await browser.newPage();
    await savingsPage.goto(output.savingsUrl, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    await savingsPage.waitForSelector(".subTitle___jvNLW");
    await savingsPage.click(".subTitle___jvNLW a:last-child");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const savingsContent = await savingsPage.content();
    output.savings = getSavingsDetail(savingsContent);
    await savingsPage.close();

    // 获取定期存款的利率信息
    const depositPage = await browser.newPage();
    await depositPage.goto(output.depositUrl, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    // 蚂蚁的页面，默认就是USD
    // CNY的话，因为原始页面没有，我们就暂时不做任何处理逻辑
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const usdDepositContent = await depositPage.content();
    output.deposit = getDepositDetail(usdDepositContent);

    // 点击切换到HKD，但它的接口是异步的
    // 需要等待一会（这里预计1秒即可）
    await depositPage.click(".currencyItem___DvYPe:last-child");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const hkdDepositContent = await depositPage.content();
    output.deposit.HKD = getDepositDetail(hkdDepositContent).HKD;

    await depositPage.close();
    return output;
  } catch (error) {
    console.log("----------------GetAntBankInterestRate----------------");
    console.log(error);
    console.log("----------------GetAntBankInterestRate----------------");
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
  const tr = $("div[class*=ckbItem1]");
  const hkd = tr.eq(0).find("div").eq(2).text();
  const usd = tr.eq(1).find("div").eq(2).text();
  const cny = tr.eq(2).find("div").eq(2).text();

  return {
    HKD: ExtractPercentage(hkd),
    CNY: ExtractPercentage(cny),
    USD: ExtractPercentage(usd),
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

  const targetDom = $('[class^="rateSelectList"]');
  targetDom.children('[class^="rateSelectItem"]').each((_, row) => {
    const period = FormatPeriod($(row).find('[class^="rateItemTitle"]').text());
    const rate = $(row).find('[class^="rateItemNum"]').text();
    if (rate && period && output[period] === "") {
      output[period] = FormatRate(rate);
    }
  });

  return {
    title: "",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  return {
    title: "新资金",
    min: "",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const targetDom = $('[class^="rateSelectList"]');
  targetDom.children('[class^="rateSelectItem"]').each((_, row) => {
    const period = FormatPeriod($(row).find('[class^="rateItemTitle"]').text());
    const rate = $(row).find('[class^="rateItemNum"]').text();
    if (rate && period && output[period] === "") {
      output[period] = FormatRate(rate);
    }
  });

  return {
    title: "新资金",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}
