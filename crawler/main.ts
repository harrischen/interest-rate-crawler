import path from "path";
import dayjs from "dayjs";
import * as puppeteer from "puppeteer";
import { SaveToJsonFile } from "./common";
import { GetAirStarBankInterestRate } from "./interest-Airstar";
import { GetHaseBankInterestRate } from "./interest-HASE";
import { GetHsbcBankInterestRate } from "./interest-HSBC";
import { GetLiviBankInterestRate } from "./interest-Livi";
import { GetAntBankInterestRate } from "./interest-Ant";
import { GetBeaBankInterestRate } from "./interest-BEA";
import { GetBocHkBankInterestRate } from "./interest-BOCHK";
import { GetHkCommBankInterestRate } from "./interest-BOCOM";
import { GetChBankInterestRate } from "./interest-ChongHing";
import { GetCiticBankInterestRate } from "./interest-CITIC";
import { GetDbsBankInterestRate } from "./interest-DBS";
import { GetFuBonBankInterestRate } from "./interest-Fubon";
import { GetFusionBankInterestRate } from "./interest-FusionBank";
import { GetMoxBankInterestRate } from "./interest-MOX";
import { GetPaoBankInterestRate } from "./interest-PAOB";
import { GetPublicBankInterestRate } from "./interest-PublicBank";
import { GetScBankInterestRate } from "./interest-SCB";
import { GetWeLabBankInterestRate } from "./interest-WeLab";
import { GetWingLungBankInterestRate } from "./interest-WingLung";
import { GetZaBankInterestRate } from "./interest-ZA";
import { IGetRateResp } from "@/type";

export async function main() {
  const browserOptions = {
    headless: true,
    timeout: 0,
    protocolTimeout: 0,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: [
      "--disable-gpu",
      "--disable-infobars",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--enable-webgl",
      "--start-maximized",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
    ],
  };

  const promises = [
    GetFusionBankInterestRate,
    GetLiviBankInterestRate,
    GetMoxBankInterestRate,
    GetPaoBankInterestRate,
    GetWeLabBankInterestRate,
    GetZaBankInterestRate,
    GetAirStarBankInterestRate,
    GetAntBankInterestRate,

    GetHsbcBankInterestRate,
    GetHaseBankInterestRate,
    GetBocHkBankInterestRate,
    GetScBankInterestRate,

    GetDbsBankInterestRate,
    GetBeaBankInterestRate,
    GetWingLungBankInterestRate,
    GetCiticBankInterestRate,
    GetPublicBankInterestRate,
    GetHkCommBankInterestRate,
    GetChBankInterestRate,
    GetFuBonBankInterestRate,
  ];

  const start = new Date().getTime().toString();
  const time = dayjs().format("YYYYMMDD");
  const targetContent: IGetRateResp = {
    start,
    end: "",
    list: [],
  };

  for (let i = 0; i < promises.length; i++) {
    const browser = await puppeteer.launch(browserOptions);
    const res = await promises[i](browser);
    console.log(`------------${i}`);
    targetContent.list.push(res);
    browser.close();
  }
  targetContent.end = new Date().getTime().toString();
  const targetDir = path.join(__dirname, `../public/`);
  // 保存两份文件，主要是为了防止某一天没有数据，但页面又需要正常展示
  // 1. 固定名字的文件
  // 2. 按时间命名的文件
  const defaultFile = path.join(targetDir, `bank-rates.json`);
  const dailyFile = path.join(targetDir, `bank-rates__${time}.json`);
  SaveToJsonFile(targetContent, dailyFile);
  SaveToJsonFile(targetContent, defaultFile);
}
main();
