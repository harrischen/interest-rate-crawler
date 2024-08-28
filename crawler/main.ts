import * as puppeteer from "puppeteer";
import { GetWeLabInterestRate } from "./interest-welab";
import { GetPaoBankInterestRate } from "./interest-paob";
import { GetLiviBankInterestRate } from "./interest-livibank";
import { GetHsbcBankInterestRate } from "./interest-hsbc";
import { GetBocHkBankInterestRate } from "./interest-bochk";
import { GetScBankInterestRate } from "./interest-sc";
import { GetHangSengBankInterestRate } from "./interest-hangseng";
import { GetCitiBankInterestRate } from "./interest-citibank";
import { GetCcbBankInterestRate } from "./interest-ccb";
import { GetIcbcBankInterestRate } from "./interest-icbc";
import { GetFuBonBankInterestRate } from "./interest-fubon";

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

  // const welabBank = await GetWeLabInterestRate(browser);
  // console.log(welabBank);

  // const paoBank = await GetPaoBankInterestRate(browser);
  // console.log(paoBank);

  // const liviBank = await GetLiviBankInterestRate(browser);
  // console.log(liviBank);

  // const hsbcBank = await GetHsbcBankInterestRate(browser);
  // console.log(hsbcBank);

  // const bocHkBank = await GetBocHkBankInterestRate(browser);
  // console.log(bocHkBank);

  // const scBank = await GetScBankInterestRate(browser);
  // console.log(scBank);

  // const hangSengBank = await GetHangSengBankInterestRate(browser);
  // console.log(hangSengBank);

  // const citiBank = await GetCitiBankInterestRate(browser);
  // console.log(citiBank);

  // const ccbBank = await GetCcbBankInterestRate(browser);
  // console.log(ccbBank);

  // const icbcBank = await GetIcbcBankInterestRate(browser);
  // console.log(icbcBank);

  const fuBonBank = await GetFuBonBankInterestRate(browser);
  console.log(fuBonBank);

  browser.close();
}
main();
