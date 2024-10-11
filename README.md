# Vue2 代码转 Vue3 代码

Vue2 代码转 vue3 script setup 语法

#### 直接复制 Vue2 代码即可

**注意：**

1. ref 命名请勿和 data 中的变量冲突。
2. data 中引用函数和变量的需要先注释，如果引入了 methods 的方法，会转为去掉 this 的字符串形式，转完在手动修改回来。
3. style 代码不会拼接。
