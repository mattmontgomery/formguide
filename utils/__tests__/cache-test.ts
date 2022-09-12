import { compressString, decompressString, getStringSize } from "../cache";

import { randomBytes } from "crypto";

const generateRandomString = (myLength: number): string => {
  return randomBytes(myLength).toString();
};

test("Compress string actually compresses and returns a compressed string", async () => {
  const initialValue = generateRandomString(1000000);
  const compressedValue = await compressString(initialValue);

  expect(getStringSize(compressedValue)).toBeLessThan(
    getStringSize(initialValue)
  );
});
test("Can compress then decompress", async () => {
  //   const initialValue = generateRandomString(100);
  const initialValue = "a test string!!!!";
  const compressedValue = await compressString(initialValue);
  const decompressedValue = await decompressString(compressedValue);

  expect(decompressedValue).toEqual(initialValue);
});
