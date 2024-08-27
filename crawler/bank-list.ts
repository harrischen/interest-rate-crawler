import * as fs from "fs";
import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";

interface CellContent {
  bankName: string;
  bankLink: string | null;
}

async function fetchPageContent(url: string): Promise<string> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const htmlContent = await page.content();
    await browser.close();
    return htmlContent;
  } catch (error) {
    console.error(`Error fetching the page: ${error}`);
    throw error;
  }
}

function parseHtmlContent(html: string): CellContent[] {
  const $ = cheerio.load(html);
  const cellContents: CellContent[] = [];

  $(".cell-body").each((index, element) => {
    const bankName = $(element).text().trim();
    const bankLink = $(element).find("a").attr("href") || null;

    if (bankName && bankLink) {
      cellContents.push({ bankName, bankLink });
    }
  });

  return cellContents;
}

function saveToJsonFile(data: CellContent[], filename: string): void {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
}

async function main() {
  const url = "https://flo.uri.sh/visualisation/13625330/embed?auto=1";
  try {
    const htmlContent = await fetchPageContent(url);
    const parsedContent = parseHtmlContent(htmlContent);
    saveToJsonFile(parsedContent, "bank-list.json");
    console.log("Data has been saved to bank-list.json");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
