import fs from "fs";

export const writeToFile = (filePath: string, data: string) =>
  fs.writeFileSync(filePath, data);

export const readFromFile = (filePath: string) =>
  fs.readdirSync(filePath).forEach((file) => console.log(file));
