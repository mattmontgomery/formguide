import { NextApiRequest, NextApiResponse } from "next";

import { parse } from "csv";

import { readFile } from "node:fs/promises";
import path from "path";

export default async function playerStats(
  req: NextApiRequest,
  res: NextApiResponse<PlayerStats.ApiResponse<PlayerStats.Minutes[]>>
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const csvFilePath = path.resolve(
      __dirname,
      "../../../../../",
      "data/mls/20220822_playerStats.csv"
    );

    const parser = parse({
      columns: true,
      cast: true,
    });
    try {
      const csvData = await readFile(csvFilePath, "utf8");
      parser.write(csvData);
    } catch (e) {
      console.error(e);
      res.json({
        data: [],
        meta: {},
        errors: [{ message: String(e) }],
      });
      reject();
    }
    const records: PlayerStats.Minutes[] = [];
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    parser.on("error", function (err) {
      console.error(err.message);
      res.json({
        data: [],
        meta: {},
        errors: [{ message: err.message }],
      });
      reject();
    });
    parser.on("end", () => {
      res.json({
        data: records,
        errors: [],
        meta: {},
      });
      resolve();
    });
    parser.end();
  });
}
