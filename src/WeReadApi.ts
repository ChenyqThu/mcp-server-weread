import * as crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// API URL常量
const WEREAD_URL = "https://weread.qq.com/";
const WEREAD_NOTEBOOKS_URL = "https://weread.qq.com/api/user/notebook";
const WEREAD_BOOK_INFO_URL = "https://weread.qq.com/api/book/info";
const WEREAD_BOOKMARKLIST_URL = "https://weread.qq.com/web/book/bookmarklist";
const WEREAD_CHAPTER_INFO_URL = "https://weread.qq.com/web/book/chapterInfos";
const WEREAD_REVIEW_LIST_URL = "https://weread.qq.com/api/review/list";
const WEREAD_READ_INFO_URL = "https://weread.qq.com/web/book/getProgress";

interface ChapterInfo {
  chapterUid: number;
  chapterIdx: number;
  updateTime: number;
  readAhead: number;
  title: string;
  level: number;
}

// 获取命令行参数
interface CommandArgs {
  WEREAD_COOKIE?: string;
  CC_URL?: string; 
  CC_ID?: string;
  CC_PASSWORD?: string;
}

export class WeReadApi {
  private cookie: string = "";
  private axiosInstance: any;
  private initialized: boolean = false;
  private commandArgs: CommandArgs = {};

  constructor() {
    this.parseCommandArgs();
    this.initAsync().catch(error => {
      console.error("初始化WeReadApi失败:", error);
    });
  }

  // 解析命令行参数
  private parseCommandArgs(): void {
    try {
      const args = process.argv;
      const argsIndex = args.findIndex(arg => arg === '--args');
      
      if (argsIndex !== -1 && argsIndex + 1 < args.length) {
        try {
          this.commandArgs = JSON.parse(args[argsIndex + 1]);
        } catch (error) {
          console.error("解析命令行参数失败:", error);
        }
      }
    } catch (error) {
      console.error("处理命令行参数时出错:", error);
    }
  }

  private async initAsync(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.cookie = await this.getCookie();
      this.axiosInstance = axios.create({
        headers: {
          'Cookie': this.cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        },
        timeout: 60000  // 设置60秒超时
      });
      this.initialized = true;
    } catch (error) {
      console.error("初始化失败:", error);
      throw error;
    }
  }

  private async tryGetCloudCookie(url: string, id: string, password: string): Promise<string | null> {
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    const reqUrl = `${url}/get/${id}`;
    const data = { password };
    
    try {
      const response = await axios.post(reqUrl, data, { timeout: 30000 });
      
      if (response.status === 200) {
        const responseData = response.data;
        const cookieData = responseData.cookie_data;
        
        if (cookieData && "weread.qq.com" in cookieData) {
          const cookieItems = [];
          for (const key in cookieData["weread.qq.com"]) {
            const cookie = cookieData["weread.qq.com"][key];
            cookieItems.push(`${cookie.name}=${cookie.value}`);
          }
          
          if (cookieItems.length > 0) {
            return cookieItems.join("; ");
          }
        }
      }
      console.warn("从Cookie Cloud获取数据成功，但未找到微信读书Cookie");
    } catch (error) {
      console.error("从Cookie Cloud获取Cookie失败:", error);
    }
    
    return null;
  }

  private async getCookie(): Promise<string> {
    // 优先级：
    // 1. 命令行参数中的WEREAD_COOKIE
    // 2. 命令行参数中的Cookie Cloud配置
    // 3. 环境变量中的Cookie Cloud配置
    // 4. 环境变量中的WEREAD_COOKIE
    
    let cookie: string | null = null;
    
    // 1. 检查命令行参数中的直接Cookie
    if (this.commandArgs.WEREAD_COOKIE) {
      return this.commandArgs.WEREAD_COOKIE;
    }
    
    // 2. 检查命令行参数中的Cookie Cloud配置
    if (this.commandArgs.CC_URL && this.commandArgs.CC_ID && this.commandArgs.CC_PASSWORD) {
      try {
        cookie = await this.tryGetCloudCookie(
          this.commandArgs.CC_URL,
          this.commandArgs.CC_ID,
          this.commandArgs.CC_PASSWORD
        );
        if (cookie) {
          return cookie;
        }
      } catch (error) {
        console.warn("使用命令行参数中的Cookie Cloud配置获取Cookie失败");
      }
    }
    
    // 3. 尝试环境变量中的Cookie Cloud配置
    const envUrl = process.env.CC_URL;
    const envId = process.env.CC_ID;
    const envPassword = process.env.CC_PASSWORD;
    
    if (envUrl && envId && envPassword) {
      try {
        cookie = await this.tryGetCloudCookie(envUrl, envId, envPassword);
        if (cookie) {
          return cookie;
        }
      } catch (error) {
        console.warn("使用环境变量中的Cookie Cloud配置获取Cookie失败");
      }
    }
    
    // 4. 回退到环境变量中的直接Cookie
    const envCookie = process.env.WEREAD_COOKIE;
    if (!envCookie || !envCookie.trim()) {
      throw new Error("没有找到cookie，请按照文档填写cookie或配置Cookie Cloud");
    }
    
    return envCookie;
  }

  private handleErrcode(errcode: number): void {
    if (errcode === -2012 || errcode === -2010) {
      console.error("微信读书Cookie过期了，请参考文档重新设置。");
    }
  }

  private async retry<T>(func: () => Promise<T>, maxAttempts = 3, waitMs = 5000): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await func();
      } catch (error: any) {
        if (error.response) {
          console.error(`响应状态: ${error.response.status}`);
        }
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        const randomWait = waitMs + Math.floor(Math.random() * 3000);
        console.warn(`第${attempt}次尝试失败，${randomWait}ms后重试...`);
        await new Promise(resolve => setTimeout(resolve, randomWait));
      }
    }
    throw new Error("所有重试都失败了");
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initAsync();
    }
  }

  private getStandardHeaders(): Record<string, string> {
    return {
      'Cookie': this.cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'Connection': 'keep-alive',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'upgrade-insecure-requests': '1'
    };
  }

  private async visitHomepage(): Promise<void> {
    try {
      await axios.get(WEREAD_URL, { 
        headers: this.getStandardHeaders(),
        timeout: 30000
      });
    } catch (error: any) {
      console.error("访问主页失败:", error.message);
    }
  }

  private async makeApiRequest<T>(
    url: string, 
    method: 'get' | 'post' = 'get', 
    params: Record<string, any> = {}, 
    data: any = null
  ): Promise<T> {
    await this.ensureInitialized();
    
    // 向所有GET请求添加时间戳避免缓存
    if (method === 'get') {
      params._ = new Date().getTime();
    }
    
    try {
      let response;
      
      if (method === 'get') {
        response = await this.axiosInstance.get(url, { params });
      } else {
        response = await this.axiosInstance.post(url, data, { params });
      }
      
      if (response.data.errcode !== undefined && response.data.errcode !== 0) {
        this.handleErrcode(response.data.errcode);
        throw new Error(`API返回错误: ${response.data.errmsg || 'Unknown error'} (code: ${response.data.errcode})`);
      }
      
      return response.data;
    } catch (error: any) {
      console.error(`API请求失败 (${url}):`, error.message);
      throw error;
    }
  }

  // 获取书架信息（存在笔记的书籍）
  public async getBookshelf(): Promise<any> {
    await this.ensureInitialized();
    return this.retry(async () => {
      const data = await this.makeApiRequest<any>(WEREAD_NOTEBOOKS_URL, "get");
      return data;
    });
  }

  // 获取笔记本列表
  public async getNotebooklist(): Promise<any[]> {
    await this.ensureInitialized();
    return this.retry(async () => {
      const data = await this.makeApiRequest<any>(WEREAD_NOTEBOOKS_URL, "get");
      return data.books || [];
    });
  }

  // 获取书籍信息
  public async getBookinfo(bookId: string): Promise<any> {
    await this.ensureInitialized();
    return this.retry(async () => {
      return await this.makeApiRequest<any>(WEREAD_BOOK_INFO_URL, "get", { bookId });
    });
  }

  // 获取书籍的划线记录
  public async getBookmarkList(bookId: string): Promise<any[]> {
    await this.ensureInitialized();
    return this.retry(async () => {
      const data = await this.makeApiRequest<any>(WEREAD_BOOKMARKLIST_URL, "get", { bookId });
      let bookmarks = data.updated || [];
      // 确保每个划线对象格式一致
      bookmarks = bookmarks.filter((mark: any) => mark.markText && mark.chapterUid);
      return bookmarks;
    });
  }

  // 获取阅读进度
  public async getReadInfo(bookId: string): Promise<any> {
    await this.ensureInitialized();
    return this.retry(async () => {
      return await this.makeApiRequest<any>(WEREAD_READ_INFO_URL, "get", { bookId });
    });
  }

  // 获取笔记/想法列表
  public async getReviewList(bookId: string): Promise<any[]> {
    await this.ensureInitialized();
    return this.retry(async () => {
      const data = await this.makeApiRequest<any>(WEREAD_REVIEW_LIST_URL, "get", {
        bookId,
        listType: 11,
        mine: 1,
        syncKey: 0
      });
      
      let reviews = data.reviews || [];
      // 转换成正确的格式
      reviews = reviews.map((x: any) => x.review);
      
      // 为书评添加chapterUid
      reviews = reviews.map((x: any) => {
        if (x.type === 4) {
          return { chapterUid: 1000000, ...x };
        }
        return x;
      });
      
      return reviews;
    });
  }

  // 获取章节信息
  public async getChapterInfo(bookId: string): Promise<Record<string, ChapterInfo>> {
    await this.ensureInitialized();
    return this.retry(async () => {
      try {
        // 1. 首先访问主页，确保会话有效
        await this.visitHomepage();
        
        // 2. 获取笔记本列表，进一步初始化会话
        await this.getNotebooklist();
        
        // 3. 添加随机延迟，模拟真实用户行为
        const delay = 1000 + Math.floor(Math.random() * 2000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 4. 请求章节信息
        const body = {
          bookIds: [bookId]
        };
        
        // 添加随机参数避免缓存
        const params: Record<string, any> = {
          _: new Date().getTime(),
          r: Math.random().toString().substring(2, 8)
        };
        
        const data = await this.makeApiRequest<any>(WEREAD_CHAPTER_INFO_URL, "post", params, body);
        
        // 5. 处理结果
        if (data.data && data.data.length === 1 && data.data[0].updated) {
          const update = data.data[0].updated;
          // 添加点评章节
          update.push({
            chapterUid: 1000000,
            chapterIdx: 1000000,
            updateTime: 1683825006,
            readAhead: 0,
            title: "点评",
            level: 1
          });
          
          // 确保chapterUid始终以字符串形式作为键
          const result = update.reduce((acc: Record<string, ChapterInfo>, curr: ChapterInfo) => {
            // 显式转换为字符串
            const chapterUidStr = String(curr.chapterUid);
            acc[chapterUidStr] = curr;
            return acc;
          }, {});
          
          return result;
        } else if (data.errCode) {
          this.handleErrcode(data.errCode);
          throw new Error(`API返回错误: ${data.errMsg || 'Unknown error'} (code: ${data.errCode})`);
        } else {
          throw new Error(`获取章节信息失败，返回格式不符合预期`);
        }
      } catch (error: any) {
        console.error(`获取章节信息失败:`, error.message);
        throw error;
      }
    });
  }
}