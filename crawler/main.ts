import * as puppeteer from "puppeteer";
import { GetAirStarBankInterestRate } from "./interest-Airstar";
import { GetHaseBankInterestRate } from "./interest-HASE";
import { GetHsbcBankInterestRate } from "./interest-HSBC";
import { GetLiviBankInterestRate } from "./interest-Livi";

export async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
    ],
  });

  // const fusionBank = await GetFusionBankInterestRate(browser);
  // console.log(fusionBank);
  // console.log("----------------fusionBank----------------");

  // const zaBank = await GetZaBankInterestRate(browser);
  // console.log(zaBank);
  // console.log("----------------zaBank----------------");

  // const airStarBank = await GetAirStarBankInterestRate(browser);
  // console.log(JSON.stringify(airStarBank, null, 2));
  // console.log("----------------airStarBank----------------");

  // const haseBank = await GetHaseBankInterestRate(browser);
  // console.log(JSON.stringify(haseBank, null, 2));
  // console.log("----------------haseBank----------------");

  // const hsbcBank = await GetHsbcBankInterestRate(browser);
  // console.log(JSON.stringify(hsbcBank, null, 2));
  // console.log("----------------hsbcBank----------------");

  const liviBank = await GetLiviBankInterestRate(browser);
  console.log(JSON.stringify(liviBank, null, 2));
  console.log("----------------liviBank----------------");

  await browser.close();
}
main();
