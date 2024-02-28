import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

// 定义帮助的内容
const sections = [
  {
    header: "狗屁不通文章生成器",
    content: "生成随机的文章段落用于测试",
  },
  {
    header: "Options",
    optionList: [
      {
        name: "title",
        typeLabel: "{underline string}",
        description: "文章的主题。",
      },
      {
        name: "min",
        typeLabel: "{underline number}",
        description: "文章最小字数。",
      },
      {
        name: "max",
        typeLabel: "{underline number}",
        description: "文章最大字数。",
      },
    ],
  },
];
// 生成帮助文本
const usage = commandLineUsage(sections);

// 帮助配置
const optionDefinitions = [
  { name: "help" },
  { name: "title", alias: "t", type: String },
  { name: "min", type: Number },
  { name: "max", type: Number },
];
const options = commandLineArgs(optionDefinitions); // 获取命令行的输入
if ("help" in options) {
  console.log(usage);
  process.exit();
}
export { options };
