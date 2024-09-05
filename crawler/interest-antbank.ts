import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
import {
  GetInterestTemplate,
  FormatInterestOutput,
  FormatPeriod,
  FetchWebsiteContent,
} from "./common";

/**
 * 获取利率信息
 * @param browser
 * @param url
 * @returns
 */
export async function GetAntBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "蚂蚁银行",
    savingsUrl: "https://www.antbank.hk/personal-banking-services?lang=zh_hk",
    depositUrl: "https://www.antbank.hk/time-deposit?lang=zh_hk",
    savings: {
      HKD: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
    },
  };
  try {
    const savingsContent = await FetchWebsiteContent(
      browser,
      output.savingsUrl
    );
    output.savings = getSavingsDetail(savingsContent);

    const page = await browser.newPage();
    await page.goto(output.depositUrl, {
      waitUntil: "networkidle2",
      timeout: 1000 * 60 * 5,
    });

    let depositContent = await page.content();
    await page.click(".currencyItem___DvYPe:last-child");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    depositContent = await page.content();
    output.deposit = getDepositDetail(depositContent);

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
  const targetDom = $(".ckbItem1___z8Nh_ div");
  return {
    HKD: targetDom.eq(1).text(),
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
  const $ = cheerio.load(html);
  const hkdOutput = GetInterestTemplate();

  // 找出指定的table
  const targetDom = $('[class^="rateSelectList"]');

  // 通过遍历tr后再遍历td的形式获取相应的存期入利率
  targetDom.children('[class^="rateSelectItem"]').each((_, row) => {
    const period = FormatPeriod($(row).find('[class^="rateItemTitle"]').text());
    const rate = $(row).find('[class^="rateItemNum"]').text();
    if (rate && period && hkdOutput[period] === "") {
      hkdOutput[period] = rate;
    }
  });

  return {
    HKD: [
      {
        title: "",
        min: "1",
        rates: FormatInterestOutput(hkdOutput),
      },
    ],
  };
}
