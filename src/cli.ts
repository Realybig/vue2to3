#!/usr/bin/env node

import { Command } from "commander";
import { promises as fs } from "fs";
import { join, dirname, resolve } from "path";
import { toVue3Code } from "./index";
const packageJson = require("../package.json");
const program = new Command();

// 定义命令和选项
program
  .version(packageJson.version)
  .description("Vue 2 to Vue 3 converter tool")
  .argument("<path>", "path of file or directory")
  .option("-d, --debug", "enable debug mode")
  .option(
    "-m, --mode <type>",
    "output mode: 'overwrite' to overwrite the original files, 'newdir' to create a vue3 directory",
    "newdir"
  )
  .action(async (path, options) => {
    try {
      const stats = await fs.lstat(path);
      if (stats.isFile()) {
        // 单个文件转换
        await convertSingleFile(path, options.debug, options.mode);
      } else if (stats.isDirectory()) {
        // 批量文件转换
        await convertDirectory(path, options.debug, options.mode);
      } else {
        console.error(`Invalid path: ${path}`);
      }
    } catch (error: any) {
      console.error(`Error processing path: ${error.message}`);
    }
  });

program.parse(process.argv);

// 转换单个文件
async function convertSingleFile(
  filePath: string,
  isDebug: boolean,
  mode: string
) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    let transformedContent;
    try {
      transformedContent = toVue3Code(content); // 假设这是你的转换函数
    } catch (error: any) {
      // 捕获转换错误
      console.error(`Error converting file ${filePath}: ${error.message}`);
      // 跳过未定义错误
      transformedContent = content; // 如果转换失败，保留原始代码
    }

    // 生成输出路径
    const outputPath = getOutputFilePath(filePath, mode);

    // 确保目标目录存在（如果是新目录模式）
    if (mode === "newdir") {
      await fs.mkdir(dirname(outputPath), { recursive: true });
    }

    await fs.writeFile(outputPath, transformedContent, "utf-8");
    console.log(`File converted and saved to: ${outputPath}`);

    if (isDebug) {
      console.log(`Original content:\n${content}`);
      console.log(`Transformed content:\n${transformedContent}`);
    }
  } catch (error) {
    // 捕获文件读取或写入错误
    console.error(
      `Error processing file ${filePath}: ${(error as Error).message}`
    );
  }
}

// 批量转换目录下的所有 .vue 文件
async function convertDirectory(
  directoryPath: string,
  isDebug: boolean,
  mode: string
) {
  try {
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      const fullPath = join(directoryPath, file);
      const stats = await fs.lstat(fullPath);
      if (stats.isFile() && file.endsWith(".vue")) {
        try {
          await convertSingleFile(fullPath, isDebug, mode);
        } catch (error) {
          console.error(
            `Error converting file ${fullPath}: ${(error as Error).message}`
          );
          // 捕获单个文件的错误，但不影响其他文件
        }
      }
    }
    console.log(`All .vue files in ${directoryPath} have been processed.`);
  } catch (error) {
    console.error(
      `Error processing directory ${directoryPath}: ${(error as Error).message}`
    );
  }
}

// 生成输出文件路径
function getOutputFilePath(filePath: string, mode: string): string {
  if (mode === "overwrite") {
    return filePath; // 覆盖模式下，返回原路径
  } else {
    // 新目录模式下，生成 vue3 目录并放入新文件
    const newDir = join(dirname(filePath), "vue3");
    const fileName = filePath.split("/").pop() || "converted.vue";
    return join(newDir, fileName);
  }
}
