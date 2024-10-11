#!/usr/bin/env node

import { Command } from "commander";
import { promises as fs } from "fs";
import { join } from "path";
import { toVue3Code } from "./index";

const program = new Command();

// 定义命令和选项
program
  .version("1.0.0")
  .description("Vue 2 to Vue 3 converter tool")
  .argument("<path>", "path of file or directory")
  .option("-d, --debug", "enable debug mode")
  .action(async (path, options) => {
    try {
      const stats = await fs.lstat(path);
      if (stats.isFile()) {
        // 单个文件转换
        await convertSingleFile(path, options.debug);
      } else if (stats.isDirectory()) {
        // 批量文件转换
        await convertDirectory(path, options.debug);
      } else {
        console.error(`Invalid path: ${path}`);
      }
    } catch (error: any) {
      console.error(`Error processing path: ${error.message}`);
    }
  });

program.parse(process.argv);

// 转换单个文件
async function convertSingleFile(filePath: string, isDebug: boolean) {
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
    const outputPath = getOutputFilePath(filePath);
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
async function convertDirectory(directoryPath: string, isDebug: boolean) {
  try {
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      const fullPath = join(directoryPath, file);
      const stats = await fs.lstat(fullPath);
      if (stats.isFile() && file.endsWith(".vue")) {
        try {
          await convertSingleFile(fullPath, isDebug);
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

// 生成输出文件路径（默认在同一目录下生成 .vue3 后缀的文件）
function getOutputFilePath(filePath: string): string {
  const ext = ".v3.vue";
  const newFilePath = filePath.replace(/\.vue$/, ext);
  return newFilePath;
}
