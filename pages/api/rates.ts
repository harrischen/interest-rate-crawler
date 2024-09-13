import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

function getCurrentFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dateStr = getCurrentFormattedDate();
  const filePath = path.join(
    process.cwd(),
    `public/bank-rates__${dateStr}.json`
  );

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read file" });
      return;
    }

    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  });
}
