#!/usr/bin/env node

/**
 * 微信读书 MCP 服务器
 * 基于微信读书API，提供书籍与笔记相关功能
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WeReadApi } from "./WeReadApi.js";

/**
 * 创建MCP服务器，只提供tools能力
 */
const server = new Server(
  {
    name: "mcp-server-weread",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 列出可用的工具
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_bookshelf",
        description: "Get all books in the user's bookshelf",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "search_books",
        description: "Search for books in the user's bookshelf by keywords and return matching books with details and reading progress",
        inputSchema: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "Search keyword to match book title, author, translator or category"
            },
            exact_match: {
              type: "boolean",
              description: "Whether to use exact matching, default is fuzzy matching",
              default: false
            },
            include_details: {
              type: "boolean",
              description: "Whether to include detailed information",
              default: true
            },
            max_results: {
              type: "integer",
              description: "Maximum number of results to return",
              default: 5
            }
          },
          required: ["keyword"]
        }
      },
      {
        name: "get_book_notes_and_highlights",
        description: "Get all highlights and notes for a specific book, organized by chapter",
        inputSchema: {
          type: "object",
          properties: {
            book_id: {
              type: "string",
              description: "Book ID"
            },
            include_chapters: {
              type: "boolean",
              description: "Whether to include chapter information",
              default: true
            },
            organize_by_chapter: {
              type: "boolean",
              description: "Whether to organize by chapter",
              default: true
            },
            highlight_style: {
              type: ["integer", "null"],
              description: "Highlight style filter, null means all",
              default: null
            }
          },
          required: ["book_id"]
        }
      }
    ]
  };
});

/**
 * 工具调用处理
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const wereadApi = new WeReadApi();

    switch (request.params.name) {
      // 获取书架
      case "get_bookshelf": {
        // 获取书架信息不需要从缓存中读取，直接调用API
        const bookshelfData = await wereadApi.getBookshelf();
        
        const books = [];
        if (bookshelfData.books) {
          for (const book of bookshelfData.books) {
            // 提取书籍分类信息
            let category = "";
            if (book.book?.categories && book.book.categories.length > 0) {
              category = book.book.categories[0].title || "";
            }
            
            books.push({
              bookId: book.bookId || "",
              title: book.book?.title || "",
              author: book.book?.author || "",
              translator: book.book?.translator || "",
              category: category,
              finished: book.book?.finished === 1, // 1表示已完成，其他值表示未完成
              updateTime: book.sort ? new Date(book.sort * 1000).toISOString() : "", // 转换为ISO格式日期
              noteCount: book.noteCount || 0,
              reviewCount: book.reviewCount || 0,
              bookmarkCount: book.bookmarkCount || 0
            });
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ books }, null, 2)
          }]
        };
      }

      // 通过关键词检索用户书架上的书籍
      case "search_books": {
        const keyword = String(request.params.arguments?.keyword || "");
        const exactMatch = Boolean(request.params.arguments?.exact_match || false);
        const includeDetails = Boolean(request.params.arguments?.include_details !== false);
        const maxResults = Number(request.params.arguments?.max_results || 5);
        
        if (!keyword) {
          throw new Error("搜索关键词不能为空");
        }
        
        // 1. 获取书架信息（所有书籍）
        const bookshelfData = await wereadApi.getBookshelf();
        const allBooks = bookshelfData.books || [];
        
        // 2. 根据关键词筛选
        const keywordLower = keyword.toLowerCase();
        const matchedBooks = allBooks.filter((book: any) => {
          const title = (book.book?.title || "").toLowerCase();
          const author = (book.book?.author || "").toLowerCase();
          const translator = (book.book?.translator || "").toLowerCase();
          
          // 添加对类别的检索
          let categoryMatch = false;
          if (book.book?.categories && book.book.categories.length > 0) {
            categoryMatch = book.book.categories.some((cat: any) => 
              (cat.title || "").toLowerCase().includes(keywordLower)
            );
          }
          
          if (exactMatch) {
            return title === keywordLower || author === keywordLower || 
                   translator === keywordLower || categoryMatch;
          } else {
            return title.includes(keywordLower) || author.includes(keywordLower) || 
                   translator.includes(keywordLower) || categoryMatch;
          }
        }).slice(0, maxResults);
        
        // 3. 获取详细信息
        const booksWithDetails = [];
        
        if (includeDetails) {
          for (const matchedBook of matchedBooks) {
            const bookId = matchedBook.bookId;
            
            // 3.1 获取书籍详情
            const bookInfo = await wereadApi.getBookinfo(bookId);
            
            // 3.2 获取阅读进度
            const progressInfo = await wereadApi.getReadInfo(bookId);
            
            // 3.3 获取分类信息
            let category = "";
            if (matchedBook.book?.categories && matchedBook.book.categories.length > 0) {
              category = matchedBook.book.categories[0].title || "";
            } else if (bookInfo.category) {
              category = bookInfo.category;
            }
            
            // 3.4 整合信息
            booksWithDetails.push({
              book_id: bookId,
              title: matchedBook.book?.title || "",
              author: matchedBook.book?.author || "",
              translator: matchedBook.book?.translator || bookInfo.translator || "",
              category: category,
              publish_info: `${bookInfo.publisher || ""} ${bookInfo.publishTime ? bookInfo.publishTime.substring(0, 7) : ""}`,
              reading_status: {
                progress: progressInfo.book?.progress || 0,
                reading_time: progressInfo.book?.readingTime || 0,
                last_read_time: progressInfo.book?.updateTime ? new Date(progressInfo.book.updateTime * 1000).toISOString() : "",
                note_count: matchedBook.noteCount || 0,
                bookmark_count: matchedBook.bookmarkCount || 0,
                review_count: matchedBook.reviewCount || 0
              },
              book_info: {
                word_count: bookInfo.totalWords || 0,
                rating: bookInfo.newRating ? (bookInfo.newRating / 100) : 0,
                rating_count: bookInfo.newRatingCount || 0,
                description: bookInfo.intro || ""
              }
            });
          }
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                total_matches: booksWithDetails.length,
                books: booksWithDetails
              }, null, 2)
            }]
          };
        } else {
          // 简化版返回结果
        return {
          content: [{
            type: "text",
              text: JSON.stringify({
                total_matches: matchedBooks.length,
                books: matchedBooks.map((book: any) => ({
                  book_id: book.bookId,
                  title: book.book?.title || "",
                  author: book.book?.author || "",
                  translator: book.book?.translator || "",
                  note_count: book.noteCount || 0,
                  bookmark_count: book.bookmarkCount || 0,
                  review_count: book.reviewCount || 0
                }))
              }, null, 2)
            }]
          };
        }
      }
        
      // 获取指定书籍的所有划线和笔记
      case "get_book_notes_and_highlights": {
        const bookId = String(request.params.arguments?.book_id || "");
        const includeChapters = Boolean(request.params.arguments?.include_chapters !== false);
        const organizeByChapter = Boolean(request.params.arguments?.organize_by_chapter !== false);
        
        // 解析highlight_style参数
        let highlightStyle = null;
        if (request.params.arguments?.highlight_style !== undefined &&
            request.params.arguments?.highlight_style !== null) {
          highlightStyle = Number(request.params.arguments.highlight_style);
        }
        
        if (!bookId) {
          throw new Error("书籍ID不能为空");
        }
        
        // 1. 获取书籍信息
        const bookInfo = await wereadApi.getBookinfo(bookId);
        const bookTitle = bookInfo.title || "";
        
        // 2. 获取章节信息
        const chapterInfo = await wereadApi.getChapterInfo(bookId);
        
        // 3. 获取划线数据
        const bookmarkResponse = await wereadApi.getBookmarkList(bookId);
        
        // 确认从响应中获取正确的划线数组
        const highlights = Array.isArray(bookmarkResponse) 
          ? bookmarkResponse 
          : ((bookmarkResponse as any)?.updated || []);
        
        // 4. 获取笔记列表
        const reviews = await wereadApi.getReviewList(bookId);
        
        // 组织数据结构
        const result: any = {
          book_id: bookId,
          book_title: bookTitle,
          total_highlights: highlights.length,
          total_notes: reviews.length,
          last_updated: new Date().toISOString()
        };
        
        // 处理未分类的内容
        if (organizeByChapter) {
          result.uncategorized = {
            highlights: [],
            notes: []
          };
        } else {
          result.highlights = [];
          result.notes = [];
        }
        
        // 如果需要按章节组织
        if (includeChapters && organizeByChapter) {
          // 第一步：创建所有章节映射 - 从原始数据
          const chapterMap: Record<string, any> = {};
          
          // 将API返回的章节信息转换为我们需要的格式
          const originalChapters = Object.values(chapterInfo);
          
          // 创建基本章节对象 - 简化结构，不保留index和level字段
          originalChapters.forEach((chapter: any) => {
            // 确保chapterUid被转换为字符串
            const chapterUidStr = String(chapter.chapterUid);
            chapterMap[chapterUidStr] = {
              uid: chapter.chapterUid,
              title: chapter.title,
              // 只在构建过程中使用level和index
              _level: chapter.level,
              _index: chapter.chapterIdx,
              children: [],
              highlights: [],
              notes: []
            };
          });
          
          // 第二步：构建章节层级关系
          const rootChapters: any[] = [];
          const chapterLevels: Record<number, any[]> = {};
          
          // 按level分组
          Object.values(chapterMap).forEach(chapter => {
            if (!chapterLevels[chapter._level]) {
              chapterLevels[chapter._level] = [];
            }
            chapterLevels[chapter._level].push(chapter);
          });
          
          // 获取可用的level并排序
          const levels = Object.keys(chapterLevels).map(Number).sort();
          
          // 第一级作为根节点
          if (levels.length > 0) {
            const topLevel = levels[0];
            rootChapters.push(...chapterLevels[topLevel].sort((a, b) => a._index - b._index));
            
            // 从第二级开始，找父章节
            for (let i = 1; i < levels.length; i++) {
              const currentLevel = levels[i];
              
              // 对当前级别的每个章节
              chapterLevels[currentLevel].sort((a, b) => a._index - b._index).forEach(chapter => {
                // 找到前一级别中最近的章节作为父章节
                const prevLevel = levels[i-1];
                const prevLevelChapters = chapterLevels[prevLevel].sort((a, b) => a._index - b._index);
                
                let parent = null;
                for (let j = prevLevelChapters.length - 1; j >= 0; j--) {
                  if (prevLevelChapters[j]._index < chapter._index) {
                    parent = prevLevelChapters[j];
                    break;
                  }
                }
                
                // 如果找到父章节，添加到其children中
                if (parent) {
                  parent.children.push(chapter);
                } else {
                  // 如果找不到父章节，直接添加到根
                  rootChapters.push(chapter);
                }
              });
            }
          }
          
          // 设置结果
          result.chapters = rootChapters;
          
          // 第三步：处理划线数据 - 根据chapterUid分配到对应章节
          let highlightsAddedCount = 0;
          let uncategorizedCount = 0;
          
          highlights.forEach((highlight: any) => {
            // 确保所有必要的字段都存在
            if (!highlight.markText) {
              return;
            }
            
            const chapterUid = highlight.chapterUid;
            if (!chapterUid) {
              return;
            }
            
            if (highlightStyle !== null && highlight.colorStyle !== highlightStyle) {
              return; // 跳过不匹配的划线样式
            }
            
            const highlightData = {
              text: highlight.markText,
              style: highlight.colorStyle || highlight.style || 0,
              create_time: new Date(highlight.createTime * 1000).toISOString()
            };
            
            // 查找对应章节 - 直接以字符串形式查找
            const chapterUidStr = String(chapterUid);
            const chapter = chapterMap[chapterUidStr];
            
            if (chapter) {
              chapter.highlights.push(highlightData);
              highlightsAddedCount++;
            } else {
              result.uncategorized.highlights.push(highlightData);
              uncategorizedCount++;
            }
          });
          
          // 第四步：处理笔记数据 - 根据chapterUid分配到对应章节
          reviews.forEach((review: any) => {
            // 确保所有必要的字段都存在
            if (!review.content) {
              return;
            }
            
            const chapterUid = review.chapterUid;
            if (!chapterUid) {
              return;
            }
            
            const noteData = {
              content: review.content,
              highlight_text: review.abstract || "",
              create_time: new Date(review.createTime * 1000).toISOString()
            };
            
            // 查找对应章节 - 直接以字符串形式查找
            const chapterUidStr = String(chapterUid);
            const chapter = chapterMap[chapterUidStr];
            
            if (chapter) {
              chapter.notes.push(noteData);
            } else {
              result.uncategorized.notes.push(noteData);
            }
          });
          
          // 第五步：清理不必要的字段并递归移除空章节
          const cleanAndRemoveEmpty = (chapters: any[]): any[] => {
            return chapters.filter(chapter => {
              // 先清理章节对象中用于构建的临时字段
              delete chapter._level;
              delete chapter._index;
              
              // 递归处理子章节
              if (chapter.children && chapter.children.length > 0) {
                chapter.children = cleanAndRemoveEmpty(chapter.children);
              }
              
              // 章节不为空的条件：有划线、有笔记或有非空子章节
              return (
                (chapter.highlights && chapter.highlights.length > 0) ||
                (chapter.notes && chapter.notes.length > 0) ||
                (chapter.children && chapter.children.length > 0)
              );
            });
          };
          
          result.chapters = cleanAndRemoveEmpty(result.chapters);
        } else if (!organizeByChapter) {
          // 非按章节组织模式
          highlights.forEach((highlight: any) => {
            if (!highlight.markText || !highlight.chapterUid) return;
            if (highlightStyle !== null && highlight.colorStyle !== highlightStyle) return;
            
            result.highlights.push({
              text: highlight.markText,
              style: highlight.colorStyle || highlight.style || 0,
              create_time: new Date(highlight.createTime * 1000).toISOString(),
              chapter_uid: highlight.chapterUid,
              chapter_title: chapterInfo[highlight.chapterUid]?.title || "未知章节"
            });
          });
          
          reviews.forEach((review: any) => {
            if (!review.content || !review.chapterUid) return;
            
            result.notes.push({
              content: review.content,
              highlight_text: review.abstract || "",
              create_time: new Date(review.createTime * 1000).toISOString(),
              chapter_uid: review.chapterUid,
              chapter_title: chapterInfo[review.chapterUid]?.title || "未知章节"
            });
          });
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      default:
        throw new Error(`未知的工具: ${request.params.name}`);
    }
  } catch (error: any) {
    return {
      error: {
        message: error.message
      }
    };
  }
});

/**
 * 启动服务器
 */
async function main() {
  try {
    // 处理可能来自Claude传递的环境变量
    processClaudeArgs();
    
    // 创建标准IO传输层
    const transport = new StdioServerTransport();
    
    // 启动服务器
    await server.connect(transport);
    
    console.error("[微信读书MCP服务器] 服务启动成功...");
  } catch (error) {
    console.error("[微信读书MCP服务器] 启动失败:", error);
    process.exit(1);
  }
}

/**
 * 处理Claude传递的环境变量参数
 * Claude可以通过环境变量传递配置信息，格式如下:
 * {
 *   "command": "node",
 *   "args": ["path/to/index.js"],
 *   "env": {
 *     "CC_URL": "...",
 *     "CC_ID": "...",
 *     "CC_PASSWORD": "..."
 *   }
 * }
 */
function processClaudeArgs(): void {
  try {
    // 获取环境变量中可能存在的Claude配置
    const ccUrl = process.env.CC_URL;
    const ccId = process.env.CC_ID;
    const ccPassword = process.env.CC_PASSWORD;
    const wereadCookie = process.env.WEREAD_COOKIE;
    
    if ((ccUrl && ccId && ccPassword) || wereadCookie) {
      // 构建命令行参数
      const args: Record<string, string> = {};
      
      if (ccUrl) args.CC_URL = ccUrl;
      if (ccId) args.CC_ID = ccId;
      if (ccPassword) args.CC_PASSWORD = ccPassword;
      if (wereadCookie) args.WEREAD_COOKIE = wereadCookie;
      
      // 将环境变量作为命令行参数传递给WeReadApi
      process.argv.push('--args');
      process.argv.push(JSON.stringify(args));
    }
  } catch (error) {
    console.error("[微信读书MCP服务器] 处理Claude参数时出错:", error);
  }
}

main().catch(error => {
  console.error("[微信读书MCP服务器] 运行时错误:", error);
  process.exit(1);
});
