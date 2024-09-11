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
  const virtualBankBrowser = await puppeteer.launch(browserOptions);
  const firstStTierBankBrowser = await puppeteer.launch(browserOptions);
  const OtherTraditionalBankBrowser = await puppeteer.launch(browserOptions);

  const promises = [
    GetFusionBankInterestRate(virtualBankBrowser),
    GetLiviBankInterestRate(virtualBankBrowser),
    GetMoxBankInterestRate(virtualBankBrowser),
    GetPaoBankInterestRate(virtualBankBrowser),
    GetWeLabBankInterestRate(virtualBankBrowser),
    GetZaBankInterestRate(virtualBankBrowser),
    GetAirStarBankInterestRate(virtualBankBrowser),
    GetAntBankInterestRate(virtualBankBrowser),

    GetHsbcBankInterestRate(firstStTierBankBrowser),
    GetHaseBankInterestRate(firstStTierBankBrowser),
    GetBocHkBankInterestRate(firstStTierBankBrowser),
    GetScBankInterestRate(firstStTierBankBrowser),

    GetDbsBankInterestRate(OtherTraditionalBankBrowser),
    GetBeaBankInterestRate(OtherTraditionalBankBrowser),
    GetWingLungBankInterestRate(OtherTraditionalBankBrowser),
    GetCiticBankInterestRate(OtherTraditionalBankBrowser),
    GetPublicBankInterestRate(OtherTraditionalBankBrowser),
    GetHkCommBankInterestRate(OtherTraditionalBankBrowser),
    GetChBankInterestRate(OtherTraditionalBankBrowser),
    GetFuBonBankInterestRate(OtherTraditionalBankBrowser),
  ];

  const start = new Date().getTime();
  const time = dayjs().format("YYYYMMDD-HH");
  const resp = await Promise.all(promises);
  const end = new Date().getTime();
  SaveToJsonFile(
    {
      start,
      end,
      list: resp,
    },
    path.join(__dirname, `../public/`, `bank-rates__${time}.json`)
  );

  console.log("----------virtualBankBrowser----------");
  console.log(virtualBankBrowser.debugInfo);

  console.log("----------firstStTierBankBrowser----------");
  console.log(firstStTierBankBrowser.debugInfo);

  console.log("----------OtherTraditionalBankBrowser----------");
  console.log(OtherTraditionalBankBrowser.debugInfo);

  await virtualBankBrowser.close();
  await firstStTierBankBrowser.close();
  await OtherTraditionalBankBrowser.close();
}
main();
