import path from "path";
import dayjs from "dayjs";
import * as puppeteer from "puppeteer";
import { GetRateFileContent, SaveToJsonFile } from "./common";
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
    defaultViewport: {
      width: 1920,
      height: 1080
    },
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
      "--disable-blink-features=AutomationControlled",
      `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36`,
      "--window-size=1920,1080",
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
  const targetContent: IGetRateResp = {
    start,
    end: "",
    list: [],
  };

  // 并发控制函数
  async function batchProcess(tasks: typeof promises, batchSize: number) {
    const results: any[] = [];
    
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}, size: ${batch.length}`);
      
      const batchPromises = batch.map(async (task, index) => {
        try {
          const browser = await puppeteer.launch(browserOptions);
          // 添加重试机制
          let retries = 3;
          let result = null;
          
          while (retries > 0) {
            try {
              result = await task(browser);
              break;
            } catch (error) {
              retries--;
              if (retries === 0) throw error;
              console.log(`Retrying task ${i + index}, attempts left: ${retries}`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          
          await browser.close();
          return result;
        } catch (error) {
          console.error(`Error in task ${i + index}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null));
      
      // 批次间增加短暂延迟，避免触发反爬
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  // 使用 batchProcess 处理所有任务，这里设置并发数为 3
  const results = await batchProcess(promises, 5);
  targetContent.list = results;
  
  targetContent.end = new Date().getTime().toString();
  const targetDir = path.join(__dirname, `../public/`);

  // 先将存量的早文件内容拷贝出来
  // const yesterday = dayjs().add(-1, "day").format("YYYYMMDD");
  const oldRatePath = path.join(targetDir, `bank-rates.json`);
  const oldContent = GetRateFileContent(oldRatePath);
  const oldFilePath = path.join(targetDir, `bank-rates__old.json`);

  // 按日期存储
  const today = dayjs().format("YYYYMMDD");
  const dailyFilePath = path.join(targetDir, `bank-rates__${today}.json`);

  // 保存三份文件，主要是为了防止某一天没有数据，但页面又需要正常展示
  // 1. 将原来的bank-rates.json另存为bank-rates__old.json
  // 2. 固定名字的文件
  // 3. 按时间命名的文件
  const bankRatesPath = path.join(targetDir, `bank-rates.json`);
  SaveToJsonFile(oldContent, oldFilePath);
  SaveToJsonFile(targetContent, bankRatesPath);
  SaveToJsonFile(targetContent, dailyFilePath);
}
main();
