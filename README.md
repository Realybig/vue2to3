# Vue2 代码转 Vue3 代码

> Vue2 代码转 vue3 script setup 语法

#### 直接复制 Vue2 代码即可

**注意：**

1. ref 命名请勿和 data 中的变量冲突。
2. data 中引用函数和变量的需要先注释，如果引入了 methods 的方法，会转为去掉 this 的字符串形式，转完在手动修改回来。
3. style 代码不会拼接。

## 安装

```bash
npm install @realybig/vue2to3 -g
```

## 使用方法

单文件转换：
vue2to3 [path]/[filename] [-m mode]

示例：
vue2to3 src/components/HelloWorld.vue

批量转换：
vue2to3 [path] [-m mode]

示例：
vue2to3 src/components/

默认模式转换后会在文件目录下生成一个 vue3 文件夹，转换后的文件会存放到这个文件夹下

overwrite 模式会直接覆盖原文件

## 路线图

- [x] 测试基本安装及命令执行
- [x] 测试单文件转换
- [x] 测试批量转换
- [x] 支持批量转换两种模式，选择覆盖模式(-m overwrite)还是在目录下新建 vue3 文件夹模式(默认模式)
- [ ] 支持批量转换目录及子目录下所有文件
- [ ] 支持将文件名写入 script name 中
- [ ] 支持转换前命令行选择 js/ts 类型，函数的参数加上 any 类型
- [ ] 支持 ruoyi 系统 vue2 转换
