import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { IInterestResp } from "./type";
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
export async function GetPublicBankInterestRate(browser: puppeteer.Browser) {
  const output = {
    bankName: "大众银行",
    savingsUrl: `https://www.publicbank.com.hk/tc/usefultools/rates/depositinterestrates`,
    depositUrl: `https://www.publicbank.com.hk/tc/usefultools/rates/depositinterestrates`,
    url: "https://www.publicbank.com.hk/tc/",
    savings: {
      HKD: "",
      USD: "",
      CNY: "",
    },
    deposit: {
      HKD: [] as IInterestResp[],
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
  const table = $('strong:contains("標準儲蓄戶口")')
    .closest("p")
    .siblings(".table");
  const tr = table.find("tbody").find("tr");
  return {
    HKD: FormatRate(tr.eq(0).find("td").eq(1).text().trim()),
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

  const nextDataScript = $("#__NEXT_DATA__");
  const jsonContent = nextDataScript.html();
  const nextData = JSON.parse(jsonContent!);
  const resp = nextData?.props?.pageProps?.apiData?.pageData?.hkdDeposit;
  const rateList = resp?.data || [];
  for (let i = 0; i < rateList.length; i++) {
    if (i === 2) {
      output["7D"] = FormatRate(rateList[i][0]);
    }
    if (i === 4) {
      output["1M"] = FormatRate(rateList[i][0]);
    }
    if (i === 6) {
      output["3M"] = FormatRate(rateList[i][0]);
    }
    if (i === 7) {
      output["6M"] = FormatRate(rateList[i][0]);
    }
    if (i === 8) {
      output["12M"] = FormatRate(rateList[i][0]);
    }
  }

  return {
    title: "",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithUSD(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const nextDataScript = $("#__NEXT_DATA__");
  const jsonContent = nextDataScript.html();
  const nextData = JSON.parse(jsonContent!);
  const resp = nextData?.props?.pageProps?.apiData?.pageData?.foreignCurrency;
  const rateList = resp?.data || [];
  for (let i = 0; i < rateList.length; i++) {
    if (i === 2) {
      output["7D"] = FormatRate(rateList[i][0]);
    }
    if (i === 4) {
      output["1M"] = FormatRate(rateList[i][0]);
    }
    if (i === 6) {
      output["3M"] = FormatRate(rateList[i][0]);
    }
    if (i === 7) {
      output["6M"] = FormatRate(rateList[i][0]);
    }
    if (i === 8) {
      output["12M"] = FormatRate(rateList[i][0]);
    }
  }

  return {
    title: "",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}

function getDetailWithCNY(html: string) {
  const $ = cheerio.load(html);
  const output = GetInterestTemplate();

  const nextDataScript = $("#__NEXT_DATA__");
  const jsonContent = nextDataScript.html();
  const nextData = JSON.parse(jsonContent!);
  const resp = nextData?.props?.pageProps?.apiData?.pageData?.foreignCurrency;
  const rateList = resp?.data || [];
  for (let i = 0; i < rateList.length; i++) {
    if (i === 2) {
      output["7D"] = FormatRate(rateList[i][7]);
    }
    if (i === 4) {
      output["1M"] = FormatRate(rateList[i][7]);
    }
    if (i === 6) {
      output["3M"] = FormatRate(rateList[i][7]);
    }
    if (i === 7) {
      output["6M"] = FormatRate(rateList[i][7]);
    }
    if (i === 8) {
      output["12M"] = FormatRate(rateList[i][7]);
    }
  }

  return {
    title: "",
    min: "1",
    rates: FormatInterestOutput(output),
  };
}
