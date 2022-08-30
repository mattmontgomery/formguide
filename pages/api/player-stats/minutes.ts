import { NextApiRequest, NextApiResponse } from "next";

import { parse } from "csv";

import { readFile } from "node:fs/promises";
import path from "path";

export default async function playerStats(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const csvFilePath = path.resolve("mls-data/", "20220830_playerStats.csv");

    const parser = parse({
      columns: true,
      cast: true,
    });
    try {
      const csvData = await readFile(csvFilePath, "utf8");
      parser.write(csvData, "utf8", (e) => {
        if (e) {
          console.error(e);
          res.json({
            errors: [{ message: e }],
          });

          throw e;
        }
      });
    } catch (e) {
      console.error(e);
      res.json({
        errors: [{ message: e }],
      });
      reject();
      return;
    }
    parser.end();
    const records: unknown[] = [];
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    parser.on("error", function (err) {
      console.error(err.message);
      res.json({
        errors: [{ message: err.message }],
      });
      reject();
    });
    parser.on("end", () => {
      res.json({
        data: records,
      });
      resolve();
    });
  });
}
