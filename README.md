# 微信读书 MCP 服务器

微信读书MCP服务器是一个桥接微信读书数据和Claude Desktop的轻量级服务器，使您可以在Claude中无缝访问微信读书的笔记和阅读数据。

## 安装和使用

### 环境准备

1. 确保您的系统已安装 Node.js (v16+)
2. 克隆本仓库：`git clone https://github.com/yourusername/mcp-server-weread.git`
3. 进入项目目录：`cd mcp-server-weread`
4. 安装依赖：`npm install`

### 获取微信读书Cookie

1. 在浏览器中登录微信读书网页版: https://weread.qq.com/
2. 打开浏览器开发者工具（F12或右键检查）
3. 切换到"应用程序"或"Application"标签
4. 在左侧"存储"下找到"Cookies"
5. 选择"https://weread.qq.com"
6. 找到并复制所有cookie（可以全选然后复制所有值）

### 配置环境变量

1. 在项目根目录下，编辑`.env`文件
2. 设置微信读书Cookie：`WEREAD_COOKIE=你复制的cookie值`

### 启动服务器

1. 编译代码：`npm run build`
2. 启动服务器：`node build/index.js`

### 在MCP客户端中配置

以Cursor AI为例，在`~/.cursor/mcp.json`文件中添加：

```json
{
  "mcpServers": {
    "mcp-server-weread": {
      "command": "node",
      "args": ["/path/to/mcp-server-weread/build/index.js"],
      "env": {
        "WEREAD_COOKIE": "你的微信读书cookie"
      }
    }
  }
}
```

替换`/path/to/mcp-server-weread`为实际安装路径，并设置正确的cookie值。

## 支持的功能

服务器提供以下工具：

1. **get_bookshelf** - 获取用户的完整书架信息
2. **get_notebooks** - 获取带有笔记的书籍列表
3. **get_book_notes** - 获取特定书籍的所有笔记内容
4. **get_book_info** - 获取书籍的详细信息
5. **search_notes** - 搜索所有笔记中包含特定关键词的内容
6. **get_recent_reads** - 获取用户最近阅读的书籍和相关数据

## 使用示例

在支持MCP的AI客户端（如Claude Desktop）中，您可以：

1. 请求："帮我查看我的书架上有哪些书"
2. 请求："我想看看《思考，快与慢》这本书的笔记"
3. 请求："帮我找一下我笔记中关于'认知偏差'的内容"
4. 请求："获取我最近读过的书籍"

---

# 微信读书 MCP 服务器设计方案

## 产品定位与目标

**产品名称**: WeRead MCP Server

**产品定位**: 作为微信读书与Claude Desktop之间的桥梁，实现阅读笔记与AI深度交互的轻量级服务器。

**核心目标**:
1. 实现微信读书数据的实时获取与格式化
2. 通过MCP协议与Claude Desktop无缝集成
3. 支持基于读书笔记的深度对话与知识提取
4. 构建完整的"输入-整理-沉淀"知识工作流

**价值主张**:
- 将碎片化的阅读笔记转化为系统化的知识体系
- 通过AI辅助深化对阅读内容的理解与应用
- 减少知识管理的复杂性，实现轻量级知识沉淀
- 提升阅读效率与阅读质量

## 系统架构

```
+---------------+      +-----------------+      +------------------+
|               |      |                 |      |                  |
| 微信读书服务器 | <-->  | WeRead MCP 服务器 | <--> | Claude Desktop |
|               |      |                 |      |                  |
+---------------+      +-----------------+      +------------------+
```

### 特点
- 轻量级设计：无本地数据库，实时API调用
- 按需获取数据：仅在用户请求时调用相关API
- 无状态服务：不维护复杂的会话状态
- 安全性：通过环境变量管理Cookie，避免明文存储

## 功能与使用场景

### 核心功能

1. **书籍与笔记浏览**
   - 获取用户书架信息
   - 获取带笔记的书籍列表
   - 获取特定书籍的详细信息

2. **笔记内容获取与处理**
   - 获取特定书籍的所有笔记（划线、评论）
   - 按章节组织笔记内容
   - 基于关键词搜索笔记内容

3. **阅读数据获取**
   - 获取最近阅读记录
   - 获取阅读进度信息

4. **AI 辅助分析**
   - 通过Claude分析笔记内容
   - 提取关键观点与见解
   - 关联不同书籍的相关概念

### 使用场景

#### 场景一：深度阅读分析与讨论

1. **开始对话**：用户打开Claude Desktop，开始一个新对话
2. **选择书籍**：用户请求："帮我查看我最近在读的书籍"
3. **获取笔记**：用户说："我想讨论《思考快与慢》这本书的笔记"
4. **深入讨论**：Claude展示笔记后，用户可以请求："帮我分析这些笔记中关于认知偏差的主要观点"
5. **关联思考**：用户可以进一步请求："将这些观点与我在《超越智商》一书中的笔记做对比"

#### 场景二：主题式笔记整合

1. **主题搜索**：用户说："查找我所有笔记中关于'领导力'的内容"
2. **跨书整合**：系统找到多本书中的相关笔记后，用户可以请求："帮我整合这些不同来源的观点，找出共同点和差异"
3. **知识地图**：用户说："基于这些笔记，帮我构建一个领导力的知识框架"

#### 场景三：写作与创作辅助

1. **素材收集**：用户说："我正在写关于'团队建设'的文章，找出我所有相关的读书笔记"
2. **结构梳理**：获取笔记后，用户可以说："帮我将这些素材组织成一个逻辑清晰的文章大纲"
3. **内容扩展**：用户说："基于这个大纲和我的笔记，帮我扩展第二部分的内容"

## MCP Tools 实现清单

### 1. 获取书架工具 (get_bookshelf)

### 2. 获取笔记本列表工具 (get_notebooks)

### 3. 获取书籍笔记工具 (get_book_notes)

### 4. 获取书籍详情工具 (get_book_info)

### 5. 搜索笔记工具 (search_notes)

### 6. 最近阅读工具 (get_recent_reads)


## 技术实现注意事项

1. **环境变量管理**
   - 使用.env文件或系统环境变量管理敏感信息(Cookie)
   - 支持 CookieCloud 服务获取最新 Cookie
   
   ### CookieCloud 配置说明
   为了解决 Cookie 频繁过期，需要重新获取并更新环境变量的问题。本项目支持 [CookieCloud](https://github.com/easychen/CookieCloud) 服务来自动同步和更新 Cookie。CookieCloud 是一个开源的跨浏览器 Cookie 同步工具，支持自建服务器。

   #### 配置步骤：
   1. **安装浏览器插件**
      - Edge商店：[CookieCloud for Edge](https://microsoftedge.microsoft.com/addons/detail/cookiecloud/bffenpfpjikaeocaihdonmgnjjdpjkeo)
      - Chrome商店：[CookieCloud for Chrome](https://chromewebstore.google.com/detail/cookiecloud/ffjiejobkoibkjlhjnlgmcnnigeelbdl)

   2. **配置 CookieCloud 插件**
      - 服务器地址：使用默认服务器 `https://cookiecloud.malinkang.com` 或填入自建服务器地址
      - 获取用户 ID 和密码
      - 点击"手动同步"确保配置生效
      - [可选] 如果需要插件自动保活，可以在保活中填入 `https://weread.qq.com`，插件会自动刷新 Cookie

   3. **配置环境变量**
      在项目根目录创建 `.env` 文件（参考 `.env.example`），添加以下配置：
      ```
      CC_URL=你的CookieCloud服务器地址
      CC_ID=你的CookieCloud用户UUID
      CC_PASSWORD=你的CookieCloud密码
      ```

   **注意**：配置 CookieCloud 后，系统会优先使用 CookieCloud 获取 Cookie，获取失败才会使用 `WEREAD_COOKIE` 环境变量的值。

2. **错误处理**
   - 完善的异常处理机制，特别是API调用失败情况
   - Cookie过期提醒与自动刷新机制

3. **性能优化**
   - 控制API调用频率，避免触发限制
   - 考虑短期缓存机制，减少重复调用

4. **MCP协议适配**
   - 确保工具输入输出符合Claude Desktop的MCP规范
   - 提供清晰的工具描述和使用示例

## 后续拓展方向

1. **增加笔记导出功能**
   - 支持Markdown、JSON等多种格式导出
   - 便于知识沉淀与分享

2. **添加笔记统计分析**
   - 提供阅读与笔记行为的数据可视化
   - 帮助用户了解自己的阅读模式

3. **个性化推荐**
   - 基于用户阅读历史和笔记内容推荐相关书籍或文章
   - 帮助用户拓展知识网络

4. **知识图谱构建**
   - 自动构建用户阅读内容的知识关联网络
   - 可视化展示不同概念和书籍之间的联系

5. **多平台整合**
   - 接入其他阅读平台的数据(如Kindle、豆瓣等)
   - 构建统一的阅读笔记管理系统