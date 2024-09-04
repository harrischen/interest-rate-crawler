import * as puppeteer from "puppeteer";
import { GetZaBankInterestRate } from "./interest-zabank";
import { GetFusionBankInterestRate } from "./interest-fusionbank";
import { GetAirStarBankInterestRate } from "./interest-airstarbank";

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

  const airStarBank = await GetAirStarBankInterestRate(browser);
  console.log(JSON.stringify(airStarBank, null, 2));
  console.log("----------------airStarBank----------------");

  await browser.close();
}
main();
