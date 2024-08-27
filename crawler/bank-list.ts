import * as cheerio from "cheerio";
import { IBankListResp } from "./type";
import * as puppeteer from "puppeteer";
import { FetchWebsiteContent, SaveToJsonFile } from "./common";

export async function GetBankList(browser: puppeteer.Browser) {
  try {
    const url = "https://flo.uri.sh/visualisation/13625330/embed?auto=1";
    const htmlContent = await FetchWebsiteContent(browser, url);
    const parsedContent = parseHtmlContent(htmlContent);
    SaveToJsonFile(parsedContent, "bank-data.json");
    return [];
  } catch (error) {
    return [];
  }
}

function parseHtmlContent(html: string): IBankListResp[] {
  const $ = cheerio.load(html);
  const output: IBankListResp[] = [];

  $(".cell-body").each((index, element) => {
    const bankName = $(element).text().trim();
    const bankLink = $(element).find("a").attr("href") || null;

    if (bankName && bankLink) {
      output.push({ bankName, bankLink });
    }
  });

  return output;
}
