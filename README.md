# 微信读书 MCP Server

一个为微信读书提供MCP（Model Context Protocol）服务的工具，支持将微信读书的书籍、笔记和划线数据提供给支持MCP的大语言模型客户端，如Claude Desktop。

## 功能特点

- 从微信读书获取书架信息
- 搜索书架中的图书
- 获取图书的笔记和划线
- 支持按章节组织笔记和划线
- 与支持MCP协议的LLM客户端无缝集成

## 主要工具

1. **get_bookshelf** - 获取用户书架上所有书籍
   - 返回书籍基本信息，包括书名、作者、译者和分类等

2. **search_books** - 通过关键词检索用户书架上的书籍
   - 支持模糊匹配和精确匹配
   - 可选是否包含详细信息
   - 可设置最大结果数量

3. **get_book_notes_and_highlights** - 获取指定书籍的所有划线和笔记
   - 支持按章节组织结果
   - 支持筛选划线样式
   - 返回结构化的数据以便于LLM理解

## 安装与使用

### 先决条件

- Node.js 16.x 或更高版本
- 微信读书账号和有效的Cookie

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/your-username/mcp-server-weread.git
   cd mcp-server-weread
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建.env文件，并添加微信读书Cookie（二选一）：
   ```
   # 直接使用Cookie
   WEREAD_COOKIE=your_weread_cookie_here
   
   # 或者使用Cookie Cloud(推荐)
   CC_URL=your_cookie_cloud_url
   CC_ID=your_cookie_cloud_id
   CC_PASSWORD=your_cookie_cloud_password
   ```

4. 构建项目：
   ```bash
   npm run build
   ```

5. 启动服务器：
   ```bash
   npm start
   ```

### 与Claude Desktop集成

有两种方式可以与Claude Desktop集成：

#### 方式一：基本集成（需要.env文件配置）

1. 打开Claude Desktop
2. 进入设置 -> MCP配置
3. 添加工具，命令行参数为：
   ```
   ./node_modules/.bin/mcp-server-weread
   ```
4. 保存配置并重启Claude Desktop
5. 现在可以在对话中使用微信读书的相关功能了

#### 方式二：直接在Claude配置中提供环境变量（推荐）

1. 打开Claude Desktop
2. 进入设置 -> MCP配置
3. 添加工具，使用以下JSON配置：
   ```json
   {
     "mcp-server-weread": {
       "command": "node",
       "args": [
         "您的路径/build/index.js"  // 替换为实际路径
       ],
       "env": {
         // 方式1：使用Cookie Cloud（推荐）
         "CC_URL": "https://cc.chenge.ink",  // Cookie Cloud的URL
         "CC_ID": "您的ID",                   // Cookie Cloud的ID
         "CC_PASSWORD": "您的密码"            // Cookie Cloud的密码
         
         // 或方式2：直接提供Cookie
         // "WEREAD_COOKIE": "您的微信读书Cookie"
       }
     }
   }
   ```
4. 保存配置并重启Claude Desktop
5. 现在可以在对话中使用微信读书的相关功能了

> 提示：直接在Claude配置中提供环境变量的方式更加方便，无需设置.env文件，推荐使用。

## CookieCloud 配置说明
为了解决 Cookie 频繁过期，需要重新获取并更新环境变量的问题。本项目支持 [CookieCloud](https://github.com/easychen/CookieCloud) 服务来自动同步和更新 Cookie。CookieCloud 是一个开源的跨浏览器 Cookie 同步工具，支持自建服务器。

### 配置步骤：
安装浏览器插件
Edge商店：[CookieCloud for Edge](https://microsoftedge.microsoft.com/addons/detail/cookiecloud/bffenpfpjikaeocaihdonmgnjjdpjkeo)
Chrome商店：[CookieCloud for Chrome](https://chromewebstore.google.com/detail/cookiecloud/ffjiejobkoibkjlhjnlgmcnnigeelbdl)

### 配置 CookieCloud 插件
服务器地址：使用默认服务器 https://cc.chenge.ink 或填入自建服务器地址
点击 "自动生成密码"
同步域名关键词中填入 "weread.qq.com"
点击"保存" ，然后点击 "手动同步"确保配置生效
[可选] 如果需要插件自动保活，可以在保活中填入 https://weread.qq.com，插件会自动刷新 Cookie

在MCP Json中配置CookieCloud变量：
CC_URL=你的CookieCloud服务器地址 （或使用我的默认服务器地址 https://cc.chenge.ink ）
CC_ID=你的CookieCloud用户UUID
CC_PASSWORD=你的CookieCloud密码
注意：配置 CookieCloud 后，系统会优先使用 CookieCloud 获取 Cookie，获取失败才会使用 WEREAD_COOKIE 环境变量的值。

## Cookie获取方法
微信读书的Cookie可以通过以下步骤获取：
1. 使用Chrome浏览器登录[微信读书网页版](https://weread.qq.com/)
2. 按F12打开开发者工具，切换到Network标签页
3. 刷新页面，在请求列表中找到weread.qq.com的请求
4. 在Headers中找到Cookie字段，复制其完整内容
5. 将复制的内容添加到MCP Json 或 .env文件的WEREAD_COOKIE变量中

## 使用示例
以下是一些与LLM对话的示例：

**获取书架信息**
```
用户: 帮我查看我的微信读书书架
LLM: 我将获取您的微信读书书架信息。
[LLM调用get_bookshelf工具]
我从您的微信读书书架获取到了208本书籍。以下是部分书籍：
1. 《隐藏的自我》- 大卫·伊格曼
2. 《思考，快与慢》- 丹尼尔·卡尼曼
3. 《人类简史》- 尤瓦尔·赫拉利
...
```

**搜索特定书籍**
```
用户: 帮我找关于心理学的书
LLM: 我将搜索您书架上与心理学相关的书籍。
[LLM调用search_books工具，参数为keyword="心理学"]
在您的书架上，我找到了3本与心理学相关的书籍：
1. 《思考，快与慢》- 丹尼尔·卡尼曼（进度：75%）
2. 《乌合之众》- 古斯塔夫·勒庞（进度：50%）
3. 《心理学与生活》- 理查德·格里格（进度：30%）
您想了解哪一本书的更多信息？
```

**获取笔记和划线**
```
用户: 帮我整理《思考，快与慢》这本书的笔记
LLM: 我将获取《思考，快与慢》的笔记和划线。
[LLM调用search_books工具，找到书籍ID]
[LLM调用get_book_notes_and_highlights工具]
以下是您在《思考，快与慢》中的笔记和划线（按章节组织）：

第一章：系统1和系统2
- 划线：「系统1的运行是无意识且快速的，不怎么费脑力，没有感觉，完全处于自主控制状态。」
- 您的笔记：「系统1负责直觉和快速判断，系统2负责缓慢的理性思考。」

第三章：锚定效应
- 划线：「锚定效应指的是在不确定情境下进行数字估计时，会过度受到事先接触的不相干数字的影响。」
...
```

## 许可证

MIT

## 贡献

欢迎提交Pull Request或Issue来改进此项目。