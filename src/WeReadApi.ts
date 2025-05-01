import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { CacheManager, BookMark as CachedBookMark, Review as CachedReview, Notebook as CachedNotebook } from './CacheManager.js';

dotenv.config();

// 更新API URL常量为refapi.md中的URL
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

interface BookMark {
  bookId: string;
  chapterUid: number;
  markText: string;
  createTime: number;
  style: number;
}

interface Review {
  bookId: string;
  chapterUid: number;
  content: string;
  createTime: number;
  type: number;
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
  public cacheManager: CacheManager;
  private commandArgs: CommandArgs = {};

  constructor() {
    this.cacheManager = new CacheManager();
    // 获取命令行参数
    this.parseCommandArgs();
    this.initAsync().catch(error => {
      console.error("初始化WeReadApi失败:", error);
    });
  }

  // 解析命令行参数
  private parseCommandArgs(): void {
    try {
      // 获取启动参数
      const args = process.argv;
      const argsIndex = args.findIndex(arg => arg === '--args');
      
      if (argsIndex !== -1 && argsIndex + 1 < args.length) {
        try {
          // 解析JSON格式的参数
          const argsJson = args[argsIndex + 1];
          this.commandArgs = JSON.parse(argsJson);
          console.error("从命令行获取到的参数:", this.commandArgs);
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
        timeout: 60000  // 设置60秒超时，避免Request timed out错误
      });
      this.initialized = true;
      console.error("WeReadApi初始化成功");
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
      console.error(`正在从Cookie Cloud获取Cookie: ${reqUrl}`);
      const response = await axios.post(reqUrl, data, { timeout: 30000 });
      
      if (response.status === 200) {
        const responseData = response.data;
        const cookieData = responseData.cookie_data;
        
        if (cookieData && "weread.qq.com" in cookieData) {
          // 从Cookie Cloud获取微信读书的cookie并使用
          console.error("从Cookie Cloud获取到微信读书Cookie");
          
          // 构建cookie字符串
          const cookieItems = [];
          for (const key in cookieData["weread.qq.com"]) {
            const cookie = cookieData["weread.qq.com"][key];
            cookieItems.push(`${cookie.name}=${cookie.value}`);
          }
          
          // 使用Cookie Cloud的数据
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
      console.error("使用命令行参数中提供的WEREAD_COOKIE");
      return this.commandArgs.WEREAD_COOKIE;
    }
    
    // 2. 检查命令行参数中的Cookie Cloud配置
    if (this.commandArgs.CC_URL && this.commandArgs.CC_ID && this.commandArgs.CC_PASSWORD) {
      try {
        console.error("正在尝试使用命令行参数中的Cookie Cloud配置");
        cookie = await this.tryGetCloudCookie(
          this.commandArgs.CC_URL,
          this.commandArgs.CC_ID,
          this.commandArgs.CC_PASSWORD
        );
        if (cookie) {
          console.error("成功使用命令行参数中的Cookie Cloud配置获取Cookie");
          return cookie;
        }
      } catch (error) {
        console.warn("使用命令行参数中的Cookie Cloud配置获取Cookie失败，尝试环境变量");
      }
    }
    
    // 3. 尝试环境变量中的Cookie Cloud配置
    const envUrl = process.env.CC_URL;
    const envId = process.env.CC_ID;
    const envPassword = process.env.CC_PASSWORD;
    
    if (envUrl && envId && envPassword) {
      try {
        console.error("正在尝试使用环境变量中的Cookie Cloud配置");
        cookie = await this.tryGetCloudCookie(envUrl, envId, envPassword);
        if (cookie) {
          console.error("成功使用环境变量中的Cookie Cloud配置获取Cookie");
          return cookie;
        }
      } catch (error) {
        console.warn("使用环境变量中的Cookie Cloud配置获取Cookie失败，尝试环境变量中的直接Cookie");
      }
    }
    
    // 4. 回退到环境变量中的直接Cookie
    const envCookie = process.env.WEREAD_COOKIE;
    if (!envCookie || !envCookie.trim()) {
      throw new Error("没有找到cookie，请按照文档填写cookie或配置Cookie Cloud");
    }
    
    console.error("使用环境变量中的WEREAD_COOKIE");
    return envCookie;
  }

  private handleErrcode(errcode: number): void {
    if (errcode === -2012 || errcode === -2010) {
      console.error("微信读书Cookie过期了，请参考文档重新设置。https://mp.weixin.qq.com/s/B_mqLUZv7M1rmXRsMlBf7A");
    }
  }

  private async retry<T>(func: () => Promise<T>, maxAttempts = 3, waitMs = 5000): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await func();
      } catch (error: any) {
        // 记录详细错误信息
        console.error(`错误详情: ${error.message || '未知错误'}`);
        if (error.response) {
          console.error(`响应状态: ${error.response.status}`);
          console.error(`响应数据: ${JSON.stringify(error.response.data || {})}`);
        }
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        // 增加随机等待时间以避免API限制
        const randomWait = waitMs + Math.floor(Math.random() * 3000);
        console.warn(`第${attempt}次尝试失败，${randomWait}ms后重试...`);
        await new Promise(resolve => setTimeout(resolve, randomWait));
      }
    }
    throw new Error("所有重试都失败了"); // This should never be reached
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

  private getApiHeaders(): Record<string, string> {
    return {
      'Cookie': this.cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'Connection': 'keep-alive',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Content-Type': 'application/json;charset=UTF-8',
      'Origin': 'https://weread.qq.com',
      'Referer': 'https://weread.qq.com/',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };
  }

  private async visitHomepage(): Promise<void> {
    try {
      const homeResponse = await axios.get(WEREAD_URL, { 
        headers: this.getStandardHeaders(),
        timeout: 30000
      });
      console.error("访问主页成功，状态码:", homeResponse.status);
    } catch (error: any) {
      console.error("访问主页失败:", error.message);
      // 即使主页访问失败，仍然继续
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
      console.error("正在获取书架信息...");
      
      const data = await this.makeApiRequest<any>(WEREAD_NOTEBOOKS_URL, "get");
      
      console.error(`获取书架信息成功，共有${data.books?.length || 0}本书`);
      return data;
    });
  }

  // 获取笔记本列表
  public async getNotebooklist(): Promise<CachedNotebook[]> {
    await this.ensureInitialized();
    return this.retry(async () => {
      console.error("正在获取笔记本列表...");
      
      const data = await this.makeApiRequest<any>(WEREAD_NOTEBOOKS_URL, "get");
      
      const books = data.books || [];
      console.error(`获取笔记本列表成功，共有${books.length}本书`);
      
      return books.map((item: any) => {
        return {
          bookId: item.bookId || "",
          title: item.book?.title || "",
          author: item.book?.author || "",
          cover: item.book?.cover || "",
          noteCount: item.noteCount || 0,
          sort: item.sort || 0,
          synckey: data.synckey || 0
        };
      });
    });
  }

  // 获取书籍信息
  public async getBookinfo(bookId: string): Promise<any> {
    await this.ensureInitialized();
    return this.retry(async () => {
      console.error(`正在获取书籍信息: ${bookId}`);
      
      const data = await this.makeApiRequest<any>(WEREAD_BOOK_INFO_URL, "get", { bookId });
      
      console.error(`获取书籍信息成功: ${data.title || bookId}`);
      return data;
    });
  }

  // 获取书籍的划线记录
  public async getBookmarkList(bookId: string): Promise<any[]> {
    await this.ensureInitialized();
    return this.retry(async () => {
      console.error(`正在获取书籍划线: ${bookId}`);
      
      const data = await this.makeApiRequest<any>(WEREAD_BOOKMARKLIST_URL, "get", { bookId });
      
      // 确保我们只处理updated字段，这是我们需要的划线数组
      let bookmarks = data.updated || [];
      
      // 打印一些调试信息
      if (bookmarks.length > 0) {
        console.error(`划线原始数据示例:`, JSON.stringify(bookmarks[0]));
      }
      
      // 确保每个划线对象格式一致
      bookmarks = bookmarks.filter((mark: any) => mark.markText && mark.chapterUid);
      
      console.error(`获取书籍划线成功，共有${bookmarks.length}条划线`);
      return bookmarks;
    });
  }

  // 获取阅读进度
  public async getReadInfo(bookId: string): Promise<any> {
    await this.ensureInitialized();
    return this.retry(async () => {
      console.error(`正在获取阅读进度: ${bookId}`);
      
      const data = await this.makeApiRequest<any>(WEREAD_READ_INFO_URL, "get", { bookId });
      
      console.error(`获取阅读进度成功: ${bookId}`);
      return data;
    });
  }

  // 获取笔记/想法列表
  public async getReviewList(bookId: string): Promise<any[]> {
    await this.ensureInitialized();
    return this.retry(async () => {
      console.error(`正在获取笔记列表: ${bookId}`);
      
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
      
      console.error(`获取笔记列表成功，共有${reviews.length}条笔记`);
      return reviews;
    });
  }

  // 获取章节信息
  public async getChapterInfo(bookId: string): Promise<Record<string, ChapterInfo>> {
    await this.ensureInitialized();
    return this.retry(async () => {
      console.error(`正在获取章节信息: ${bookId}`);
      
      try {
        // 1. 首先访问主页，确保会话有效
        await this.visitHomepage();
        
        // 2. 获取笔记本列表，进一步初始化会话
        await this.getNotebooklist();
        
        // 3. 添加随机延迟，模拟真实用户行为
        const delay = 1000 + Math.floor(Math.random() * 2000);
        console.error(`等待${delay}毫秒...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 4. 请求章节信息
        console.error(`正在请求书籍${bookId}的章节信息...`);
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
          
          console.error(`获取章节信息成功，共有${update.length}个章节`);
          return result;
        } else if (data.errCode) {
          this.handleErrcode(data.errCode);
          throw new Error(`API返回错误: ${data.errMsg || 'Unknown error'} (code: ${data.errCode})`);
        } else {
          throw new Error(`获取章节信息失败，返回格式不符合预期: ${JSON.stringify(data)}`);
        }
      } catch (error: any) {
        console.error(`获取章节信息失败:`, error.message);
        throw error;
      }
    });
  }

  // 计算书籍URL的ID
  private transformId(bookId: string): [string, string[]] {
    const idLength = bookId.length;
    
    if (/^\d*$/.test(bookId)) {
      const ary: string[] = [];
      for (let i = 0; i < idLength; i += 9) {
        ary.push(parseInt(bookId.slice(i, Math.min(i + 9, idLength)), 10).toString(16));
      }
      return ["3", ary];
    }
    
    let result = "";
    for (let i = 0; i < idLength; i++) {
      result += bookId.charCodeAt(i).toString(16);
    }
    return ["4", [result]];
  }

  // 计算书籍URL
  public calculateBookStrId(bookId: string): string {
    const md5 = crypto.createHash('md5');
    md5.update(bookId);
    const digest = md5.digest('hex');
    let result = digest.slice(0, 3);
    
    const [code, transformedIds] = this.transformId(bookId);
    result += code + "2" + digest.slice(-2);
    
    for (let i = 0; i < transformedIds.length; i++) {
      let hexLengthStr = transformedIds[i].length.toString(16);
      if (hexLengthStr.length === 1) {
        hexLengthStr = "0" + hexLengthStr;
      }
      
      result += hexLengthStr + transformedIds[i];
      
      if (i < transformedIds.length - 1) {
        result += "g";
      }
    }
    
    if (result.length < 20) {
      result += digest.slice(0, 20 - result.length);
    }
    
    const finalMd5 = crypto.createHash('md5');
    finalMd5.update(result);
    result += finalMd5.digest('hex').slice(0, 3);
    
    return result;
  }

  // 获取书籍URL
  public getUrl(bookId: string): string {
    return `https://weread.qq.com/web/reader/${this.calculateBookStrId(bookId)}`;
  }

  /**
   * 获取书签和评论数据，添加同步键
   */
  public async getBookNotesWithSynckey(bookId: string): Promise<{ synckey: number, bookmarks: CachedBookMark[], reviews: CachedReview[] }> {
    await this.ensureInitialized();
    
    // 获取书签
    const bookmarks = await this.getBookmarkList(bookId);
    
    // 获取评论
    const reviews = await this.getReviewList(bookId);
    
    // 从书签数据中提取synckey
    let synckey = 0;
    if (bookmarks && bookmarks.length > 0) {
      synckey = bookmarks[0]?.bookmarks?.synckey || 0;
    }
    
    return { synckey, bookmarks, reviews };
  }

  /**
   * 同步笔记本数据到缓存
   */
  public async syncNotebooks(): Promise<CachedNotebook[]> {
    console.error("开始同步笔记本数据...");
    
    try {
      // 获取最新笔记本列表
      const notebooks = await this.getNotebooklist();
      
      // 更新缓存
      this.cacheManager.updateNotebooks(notebooks);
      
      console.error(`笔记本数据同步成功，共 ${notebooks.length} 本书`);
      return notebooks;
    } catch (error) {
      console.error("同步笔记本数据失败:", error);
      
      // 如果出错，返回缓存中的数据
      return this.cacheManager.getNotebooks();
    }
  }
  
  /**
   * 同步指定书籍的数据到缓存
   */
  public async syncBookData(bookId: string): Promise<void> {
    console.error(`开始同步书籍 ${bookId} 的数据...`);
    
    try {
      // 获取本地缓存的synckey
      const cachedSynckey = this.cacheManager.getBookSynckey(bookId);
      
      // 获取服务器上的最新数据与synckey
      const { synckey, bookmarks, reviews } = await this.getBookNotesWithSynckey(bookId);
      
      // 检查synckey是否有变化
      if (synckey !== cachedSynckey) {
        console.error(`书籍 ${bookId} 数据有更新，从synckey ${cachedSynckey} 更新到 ${synckey}`);
        
        // 更新缓存
        this.cacheManager.updateBookData(bookId, synckey, bookmarks, reviews);
        this.cacheManager.saveCache();
      } else {
        console.error(`书籍 ${bookId} 数据无变化，synckey: ${synckey}`);
      }
    } catch (error) {
      console.error(`同步书籍 ${bookId} 数据失败:`, error);
    }
  }
  
  /**
   * 同步所有笔记数据
   */
  public async syncAllNotes(): Promise<void> {
    console.error("开始同步所有笔记数据...");
    
    try {
      // 1. 同步笔记本列表
      const notebooks = await this.syncNotebooks();
      
      // 2. 对每本书同步数据
      for (const notebook of notebooks) {
        const bookId = notebook.bookId;
        await this.syncBookData(bookId);
      }
      
      // 3. 更新最后同步时间
      this.cacheManager.updateLastSyncTime();
      
      // 4. 保存缓存
      this.cacheManager.saveCache();
      
      console.error("所有笔记数据同步完成");
    } catch (error) {
      console.error("同步所有笔记数据失败:", error);
    }
  }
  
  /**
   * 增量同步特定书籍的笔记数据
   */
  public async incrementalSyncBook(bookId: string): Promise<void> {
    await this.syncBookData(bookId);
  }
  
  /**
   * 增量同步笔记本列表
   * 仅获取笔记本列表信息，不同步每本书的详细数据
   */
  public async incrementalSyncNotebooks(): Promise<CachedNotebook[]> {
    const notebooks = await this.syncNotebooks();
    this.cacheManager.saveCache();
    return notebooks;
  }
  
  /**
   * 智能增量同步
   * 1. 首先只同步笔记本列表
   * 2. 只对需要查询的书籍做深度同步
   */
  public async smartSync(bookId?: string): Promise<void> {
    // 强制更新笔记本列表以获取最新的书籍synckey信息
    await this.incrementalSyncNotebooks();
    
    if (bookId) {
      // 如果指定了书籍ID，只同步这本书
      await this.incrementalSyncBook(bookId);
    }
  }
  
  /**
   * 使用缓存管理器搜索笔记
   */
  public searchCachedNotes(keyword: string): Array<{bookId: string, type: string, content: string, createTime: number, chapterUid: number}> {
    return this.cacheManager.searchNotes(keyword);
  }
}