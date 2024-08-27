import * as puppeteer from "puppeteer";
import { GetWeLabInterestRate } from "./interest-welab";

export async function main() {
  const browser = await puppeteer.launch();

  // 匯立银行
  await GetWeLabInterestRate(browser);
  browser.close();
}
main();
