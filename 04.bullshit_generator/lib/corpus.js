import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import moment from "moment";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 加载语料库
export function loadCorpus(src) {
  const path = resolve(__dirname, "..", src);
  const data = readFileSync(path, { encoding: "utf-8" });
  return JSON.parse(data);
}
// 保存生成的语料
export function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, "..", "output");
  const time = moment().format(" - YYYYMMDDHHmmss");
  const outputFile = resolve(outputDir, `${title}${time}.txt`);
  // 判断目录是否存在，如果不存在，则创建目录
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  const text = `${title}\n\n    ${article.join("\n    ")}`;
  writeFileSync(outputFile, text, { encoding: "utf-8" });
  return outputFile;
}
