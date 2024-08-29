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
import { GetFuBonBankInterestRate } from "./interest-fubonbank";
import { GetBeaBankInterestRate } from "./interest-bea";
import { GetDbsBankInterestRate } from "./interest-dbs";
import { GetPublicBankInterestRate } from "./interest-public";
import { GetWingLungBankInterestRate } from "./interest-cmbwinglung";
import { GetDahSingBankInterestRate } from "./interest-dahsing";
import { GetChBankInterestRate } from "./interest-chbank";
import { GetShaComBankInterestRate } from "./interest-shacombank";
import { GetZaBankInterestRate } from "./interest-za";
import { GetFusionBankInterestRate } from "./interest-fusionbank";

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

  const fusionBank = await GetFusionBankInterestRate(browser);
  console.log(fusionBank);

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

  // const fuBonBank = await GetFuBonBankInterestRate(browser);
  // console.log(fuBonBank);

  // const beaBank = await GetBeaBankInterestRate(browser);
  // console.log(beaBank);

  // const dbsBank = await GetDbsBankInterestRate(browser);
  // console.log(dbsBank);

  // const publicBank = await GetPublicBankInterestRate(browser);
  // console.log(publicBank);

  // const wingLungBank = await GetWingLungBankInterestRate(browser);
  // console.log(wingLungBank);

  // const dahSingBak = await GetDahSingBankInterestRate(browser);
  // console.log(dahSingBak);

  // const chBank = await GetChBankInterestRate(browser);
  // console.log(chBank);

  // const ncbBank = await GetShaComBankInterestRate(browser);
  // console.log(ncbBank);

  // const zaBank = await GetZaBankInterestRate(browser);
  // console.log(zaBank);

  await browser.close();
}
main();
