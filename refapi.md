# 获取有阅读笔记的书籍清单，其中sort 是该本书最后笔记更新时间。
Request:https://weread.qq.com/api/user/notebook
Response:
{
  "synckey": 1743773721,
  "totalBookCount": 208,
  "noBookReviewCount": 0,
  "books": [
    {
      "bookId": "27416212",
      "book": {
        "bookId": "27416212",
        "title": "隐藏的自我",
        "author": "大卫·伊格曼　",
        "translator": "钱静",
        "cover": "https://cdn.weread.qq.com/weread/cover/83/YueWen_27416212/s_YueWen_27416212.jpg",
        "version": 56464877,
        "format": "epub",
        "type": 0,
        "price": 39.9,
        "originalPrice": 0,
        "soldout": 0,
        "bookStatus": 1,
        "payingStatus": 2,
        "payType": 1048577,
        "centPrice": 3990,
        "finished": 1,
        "free": 0,
        "mcardDiscount": 0,
        "ispub": 1,
        "extra_type": 1,
        "cpid": 4789723,
        "publishTime": "2019-12-19 00:00:00",
        "categories": [
          {
            "categoryId": 1500000,
            "subCategoryId": 1500003,
            "categoryType": 0,
            "title": "科学技术-科学科普"
          }
        ],
        "hasLecture": 1,
        "lastChapterIdx": 58,
        "paperBook": {
          "skuId": "12610905"
        },
        "copyrightChapterUids": [2],
        "blockSaveImg": 0,
        "language": "zh",
        "isTraditionalChinese": false,
        "hideUpdateTime": false,
        "isEPUBComics": 0,
        "isVerticalLayout": 0,
        "isShowTTS": 1,
        "webBookControl": 0,
        "selfProduceIncentive": false,
        "isAutoDownload": 1
      },
      "reviewCount": 4,
      "reviewLikeCount": 0,
      "reviewCommentCount": 0,
      "noteCount": 42,
      "bookmarkCount": 0,
      "sort": 1743738132
    },
    ... //其他book信息
    ]
}

# 获取书籍详情 （似乎没什么用）
Request:https://weread.qq.com/api/book/info?bookId=27416212
Response:
{"bookId":"27416212","title":"隐藏的自我","author":"大卫·伊格曼　","translator":"钱静","cover":"https://cdn.weread.qq.com/weread/cover/83/YueWen_27416212/s_YueWen_27416212.jpg","version":56464877,"format":"epub","type":0,"price":39.9,"originalPrice":0,"soldout":0,"bookStatus":1,"payingStatus":2,"payType":1048577,"intro":"为什么在意识到前方有危险之前，你的脚已经踩上了刹车？ 为什么我们总喜欢在晚上发一些感性的文字？为什么有些人更容易发生婚外恋？所有这些问题都与你对自己的认知有关，而实际上，你并没有想象中那么了解自己。卡尔·荣格说：“每个人的内心之中都有另一个自己不认识的人”。《隐藏的自我》从脑科学的角度，为你揭示人类行为、决策背后的大脑运行机制，帮你重新认识“我是谁”。《隐藏的自我》是提高自我认知的一本绝佳读物。作者大卫·伊格曼以进化的眼光，用丰富的实验、经典案例、前沿科技，辅以哲学性的思考，循序渐进，逐步深入，带我们一窥人体中复杂又重要的器官——大脑。我们的希望、梦想、 恐惧、灵感、迷恋、幽默感和欲望，都源于大脑这个奇怪的器官，当它改变时，我们也会随之改变。这本书帮我们认识到我们所看、所听、所想的局限甚至谬误，从而帮我们开辟更广阔的认知进阶空间。","centPrice":3990,"finished":1,"maxFreeChapter":10,"maxFreeInfo":{"maxFreeChapterIdx":10,"maxFreeChapterUid":10,"maxFreeChapterRatio":9},"free":0,"mcardDiscount":0,"ispub":1,"extra_type":1,"cpid":4789723,"publishTime":"2019-12-19 00:00:00","category":"科学技术-科学科普","categories":[{"categoryId":1500000,"subCategoryId":1500003,"categoryType":0,"title":"科学技术-科学科普"}],"hasLecture":1,"lastChapterIdx":58,"paperBook":{"skuId":"12610905"},"copyrightChapterUids":[2],"hasKeyPoint":true,"blockSaveImg":0,"language":"zh","hideUpdateTime":false,"isEPUBComics":0,"isVerticalLayout":0,"isShowTTS":1,"webBookControl":0,"selfProduceIncentive":false,"isAutoDownload":1,"chapterSize":58,"updateTime":1722521808,"onTime":1577702240,"unitPrice":0.05,"marketType":0,"isbn":"9787553690957","publisher":"浙江教育出版社","totalWords":140657,"publishPrice":62.9,"bookSize":552235,"recommended":0,"lectureRecommended":0,"follow":0,"secret":0,"offline":0,"lectureOffline":0,"finishReading":0,"hideReview":0,"hideFriendMark":0,"blacked":0,"bookplateId":"kexuejishu","bookplateText":"科学的精神是怀疑、质疑和追求真理，而不是盲目相信或绝对信仰。","isAutoPay":0,"availables":0,"paid":1,"showLectureButton":1,"isHideTTSButton":0,"shouldHideTTS":0,"wxtts":1,"star":82,"ratingCount":372,"ratingDetail":{"one":8,"two":1,"three":36,"four":37,"five":290,"recent":2},"newRating":826,"newRatingCount":337,"deepVRating":841,"showDeepVRatingLabel":0,"newRatingDetail":{"good":278,"fair":52,"poor":7,"recent":2,"deepV":44,"myRating":"","title":""},"ranklist":{},"copyrightInfo":{"id":4789723,"name":"湛庐CHEERS","userVid":0,"role":0,"avatar":"","cpType":0},"authorSeg":[{"words":"大卫·伊格曼","highlight":1,"authorId":"284897"},{"words":"　","highlight":0}],"translatorSeg":[{"words":"钱静","highlight":1,"authorId":"51208"}],"coverBoxInfo":{"blurhash":"KfGAkmj]9GW-kDac4Xax%K","colors":[{"key":"6/4","hex":"#6f9aa9"},{"key":"4/4","hex":"#396678"},{"key":"3/4","hex":"#1b4d60"},{"key":"3/6","hex":"#004f6c"},{"key":"3/8","hex":"#005178"},{"key":"2/4","hex":"#033547"},{"key":"2/6","hex":"#003753"},{"key":"2/8","hex":"#00395f"},{"key":"1/4","hex":"#002033"},{"key":"1/6","hex":"#00223d"},{"key":"1/8","hex":"#002449"},{"key":"6/6","hex":"#539db6"},{"key":"4/6","hex":"#126883"},{"key":"9/2","hex":"#d3e6ed"},{"key":"4/10","hex":"#006d9c"},{"key":"5/10","hex":"#0087b5"},{"key":"5/4","hex":"#548090"},{"key":"8/4","hex":"#a0cfde"},{"key":"5/8","hex":"#0085a9"},{"key":"6/8","hex":"#259fc3"},{"key":"8/6","hex":"#85d3ec"},{"key":"7/8","hex":"#4abadd"},{"key":"3/12","hex":"#005590"},{"key":"9/12","hex":"#00fbff"},{"key":"1/100","hex":"#259fc3"},{"key":"2/100","hex":"#4abadd"},{"key":"3/100","hex":"#ffffff"},{"key":"4/100","hex":"#E5F2F3"},{"key":"5/100","hex":"#E5F2F3"},{"key":"6/100","hex":"#002722"}],"dominate_color":{"hex":"#6dd0ef","hsv":[194.175868841066,54.514882727092,93.6025144106539]},"custom_cover":"https://weread-1258476243.file.myqcloud.com/bookalphacover/212/27416212/s_27416212.jpg","custom_rec_cover":"https://weread-1258476243.file.myqcloud.com/bookreccover/212/27416212/s_27416212.jpg"},"skuInfo":{"miniProgramId":"gh_78fd80800407","path":"/pages/product/product?pid=28499113&unionid=P-136100358m"},"shortTimeRead":{"active":0},"askAIBook":0,"aiBookButtonType":0,"AISummary":"本书从脑科学的角度揭示了人类行为、决策背后的大脑运行机制。\n\n通过丰富的实验、经典案例和前沿科技，作者大卫·伊格曼带领读者深入探讨意识与无意识、本能与生理限制、大脑系统间的竞争与决策等复杂主题。\n\n书中不仅揭示了大脑对世界的构建过程，还探讨了无意识如何影响我们的行为决策。\n\n通过对自由意志的质疑，作者帮助读者重新审视自我认知，理解大脑在行为控制中的多重角色。\n\n本书适合对心理学、认知科学及人类行为感兴趣的读者，帮助他们在理解大脑运作机制的过程中提升自我认知。"}

# 获取指定书籍的划线记录  synckey为最新划线的时间戳
Request: https://weread.qq.com/web/book/bookmarklist?bookId=27416212
Response:
{
  "synckey": 1745909123,
  "updated": [
    {
      "bookId": "27416212",
      "style": 2,
      "bookVersion": 56464877,
      "range": "1227-1255",
      "markText": "基因组的作用只有在与环境相互作用的情况下才能真正被理解。",
      "colorStyle": 3,
      "type": 1,
      "chapterUid": 57,
      "createTime": 1745909123,
      "bookmarkId": "27416212_57_1227-1255"
    },
    {
      "bookId": "27416212",
      "style": 2,
      "bookVersion": 56464877,
      "range": "4819-4907",
      "markText": "由于我们的大脑会出现异常的波动，有时候会发现自己更为急躁、幽默、健谈、平静、有活力，或者思维更清晰。我们的内在环境和外在行为受到生物基础的引导，既不能直接接触，也不能直接认识。",
      "colorStyle": 3,
      "type": 1,
      "chapterUid": 56,
      "createTime": 1745892075,
      "bookmarkId": "27416212_56_4819-4907"
    },
    ...//其他划线
  ]
}

# 获取指定书籍的想法记录  synckey为该书最新笔记的时间，每条review下方的create time就是该review的创建时间。
Request: https://weread.qq.com/api/review/list?bookId=27416212&listType=11&syncKey=0&mine=1
Response: 
{
  "synckey": 1745892132,
  "totalCount": 14,
  "reviews": [
    {
      "reviewId": "82355925_7ZLpqbTrm",
      "review": {
        "bookId": "27416212",
        "content": "人的性格，情绪，状态波动其实也源于大脑状态的改变。但大脑的状态对\"自我意识\"而言是不可知的",
        "bookVersion": 56464877,
        "range": "4819-4907",
        "abstract": "由于我们的大脑会出现异常的波动，有时候会发现自己更为急躁、幽默、健谈、平静、有活力，或者思维更清晰。我们的内在环境和外在行为受到生物基础的引导，既不能直接接触，也不能直接认识。",
        "type": 1,
        "chapterUid": 56,
        "reviewId": "82355925_7ZLpqbTrm",
        "userVid": 82355925,
        "topics": [],
        "createTime": 1745892132,
        "isLike": 0,
        "isReposted": 0,
        "book": {
          "bookId": "27416212",
          "format": "epub",
          "version": 56464877,
          "soldout": 0,
          "bookStatus": 1,
          "type": 0,
          "cover": "https://cdn.weread.qq.com/weread/cover/83/YueWen_27416212/s_YueWen_27416212.jpg",
          "title": "隐藏的自我",
          "author": "大卫·伊格曼　",
          "translator": "钱静",
          "payType": 1048577
        },
        "chapterIdx": 56,
        "chapterTitle": "我们是否拥有脱离物理生物基础的灵魂",
        "author": {
          "userVid": 82355925,
          "name": "陈源泉",
          "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELXybYx6OXE3ZAbU2USVCibTyWLZYINDFxDnHCFmSicb7CibPLjkBn01sDmIS5dwZZ3v8wKKkTSDs3wxrJ3RDIJjbeFpHKHibX5wu7nZYGP6icIxkQ/132",
          "isFollowing": 1,
          "isFollower": 1,
          "isBlacking": 0,
          "isBlackBy": 0,
          "isHide": 0,
          "isV": 0,
          "roleTags": [],
          "followPromote": "",
          "isDeepV": true,
          "deepVTitle": "资深会员",
          "signature": "近城远山，皆是人间。https://chenge.ink",
          "medalInfo": {
            "id": "M6-0-3000",
            "desc": "收到的赞",
            "title": "收到的赞",
            "levelIndex": 3000
          }
        }
      }
    },
    {...},...
  ]
}

# 获取指定书籍的阅读状态详情
Request: https://weread.qq.com/web/book/getProgress?bookId=27416212
Response:
{
  "bookId": "27416212",
  "book": {
    "appId": "wb182564874663h1484727348",
    "bookVersion": 56464877,
    "reviewId": "",
    "chapterUid": 57,
    "chapterOffset": 7602,
    "chapterIdx": 57,
    "updateTime": 1746100898,
    "synckey": 1480012580,
    "summary": "就的模式。世界各地的实验室正在努力弄清楚",
    "repairOffsetTime": 0,
    "readingTime": 72917,  // 阅读时长，秒
    "progress": 96,   // 阅读进度，百分比
    "isStartReading": 1,
    "ttsTime": 0,
    "startReadingTime": 1740815642,
    "installId": "",
    "recordReadingTime": 0
  },
  "canFreeRead": 0,
  "timestamp": 1746100909
}

# 获取指定书籍的章节信息
Request: Post https://weread.qq.com/web/book/chapterInfos  with Payload {"bookIds":["27416212"]}
Response: 
{"data":[{"bookId":"27416212","soldOut":0,"clearAll":0,"chapterUpdateTime":1722521808,"updated":[{"chapterUid":1,"chapterIdx":1,"updateTime":0,"readAhead":0,"title":"封面","wordCount":1,"price":0,"paid":0,"isMPChapter":0,"level":1,"files":["Text/coverpage.xhtml"]},{"chapterUid":2,"chapterIdx":2,"updateTime":1659067784,"readAhead":0,"title":"版权信息","wordCount":150,"price":0,"paid":0,"isMPChapter":0,"level":1,"files":["Text/copyright.xhtml"]},{"chapterUid":3,"chapterIdx":3,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_3","title":"文前插图","wordCount":1485,"price":0,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0001.xhtml"]},{"chapterUid":4,"chapterIdx":4,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_4","title":"测一测 关于意识，你了解多少？","wordCount":494,"price":0,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0003.xhtml"]},{"chapterUid":5,"chapterIdx":5,"updateTime":0,"readAhead":0,"title":"01 大脑通常是以隐藏模式运行的","wordCount":1020,"price":0,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0005.xhtml"]},{"chapterUid":6,"chapterIdx":6,"updateTime":0,"readAhead":0,"title":"什么是意识","wordCount":4263,"price":0,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0006.xhtml"]},{"chapterUid":7,"chapterIdx":7,"updateTime":0,"readAhead":0,"title":"人类认识大脑之旅","wordCount":1919,"price":0,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0006_0001.xhtml"]},{"chapterUid":8,"chapterIdx":8,"updateTime":0,"readAhead":0,"title":"人类认识意识之旅","wordCount":4446,"price":0,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0006_0002.xhtml"]},{"chapterUid":9,"chapterIdx":9,"updateTime":0,"readAhead":0,"title":"02 我们感知的世界都是由大脑构建的","wordCount":148,"price":0,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0008.xhtml"]},{"chapterUid":10,"chapterIdx":10,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_10","title":"马赫带现象：为什么会忽视明显的事物","wordCount":1381,"price":0,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0009.xhtml"]},{"chapterUid":11,"chapterIdx":11,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_11","title":"变化盲视：为什么眼见不一定为实","wordCount":5608,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0009_0001.xhtml"]},{"chapterUid":12,"chapterIdx":12,"updateTime":0,"readAhead":0,"title":"运动后效：大脑也会犯错吗","wordCount":1839,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0009_0002.xhtml"]},{"chapterUid":13,"chapterIdx":13,"updateTime":0,"readAhead":0,"title":"为什么“看”也需要学习","wordCount":1152,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0009_0003.xhtml"]},{"chapterUid":14,"chapterIdx":14,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_14","title":"不同的感觉可以相互代替吗","wordCount":2738,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0009_0004.xhtml"]},{"chapterUid":15,"chapterIdx":15,"updateTime":0,"readAhead":0,"title":"大脑内部隐藏着哪些不为人知的活动","wordCount":4177,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0009_0005.xhtml"]},{"chapterUid":16,"chapterIdx":16,"updateTime":0,"readAhead":0,"title":"我们看到的世界一定是真实的吗","wordCount":1886,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0009_0006.xhtml"]},{"chapterUid":17,"chapterIdx":17,"updateTime":0,"readAhead":0,"title":"03 我们的大多数行为是由无意识决定的","wordCount":193,"price":-1,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0011.xhtml"]},{"chapterUid":18,"chapterIdx":18,"updateTime":0,"readAhead":0,"title":"内隐记忆：为什么意识无法获取大脑所有的知识","wordCount":1014,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0012.xhtml"]},{"chapterUid":19,"chapterIdx":19,"updateTime":0,"readAhead":0,"title":"我们与世界的互动是无意识的吗","wordCount":1406,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0012_0001.xhtml"]},{"chapterUid":20,"chapterIdx":20,"updateTime":0,"readAhead":0,"title":"内隐偏见：能否从个人的行为了解其真正的想法","wordCount":1353,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0012_0002.xhtml"]},{"chapterUid":21,"chapterIdx":21,"updateTime":0,"readAhead":0,"title":"内隐自我主义：我们为什么喜欢与自己相似的事物","wordCount":1835,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0012_0003.xhtml"]},{"chapterUid":22,"chapterIdx":22,"updateTime":0,"readAhead":0,"title":"大脑可以被无意识地操作吗","wordCount":1332,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0012_0004.xhtml"]},{"chapterUid":23,"chapterIdx":23,"updateTime":0,"readAhead":0,"title":"预感到底准不准","wordCount":1948,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0012_0005.xhtml"]},{"chapterUid":24,"chapterIdx":24,"updateTime":0,"readAhead":0,"title":"大脑能学习所有的知识吗","wordCount":3126,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0012_0006.xhtml"]},{"chapterUid":25,"chapterIdx":25,"updateTime":0,"readAhead":0,"title":"04 我们体验事物的本能受生理限制","wordCount":1021,"price":-1,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0014.xhtml"]},{"chapterUid":26,"chapterIdx":26,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_26","title":"大脑是主动构建还是被动记录现实","wordCount":6754,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0015.xhtml"]},{"chapterUid":27,"chapterIdx":27,"updateTime":0,"readAhead":0,"title":"为什么我们意识不到自己在做什么","wordCount":2128,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0015_0001.xhtml"]},{"chapterUid":28,"chapterIdx":28,"updateTime":0,"readAhead":0,"title":"我们对美的感知是无意识的吗","wordCount":4604,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0015_0002.xhtml"]},{"chapterUid":29,"chapterIdx":29,"updateTime":0,"readAhead":0,"title":"行为倾向是天生的还是后天形成的","wordCount":2279,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0015_0003.xhtml"]},{"chapterUid":30,"chapterIdx":30,"updateTime":0,"readAhead":0,"title":"05 我们的行为是大脑不同系统竞争的结果","wordCount":208,"price":-1,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0017.xhtml"]},{"chapterUid":31,"chapterIdx":31,"updateTime":0,"readAhead":0,"title":"大脑中有多少个“自我”","wordCount":4685,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018.xhtml"]},{"chapterUid":32,"chapterIdx":32,"updateTime":0,"readAhead":0,"title":"两党制：大脑是理性的还是情绪化的","wordCount":2761,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0001.xhtml"]},{"chapterUid":33,"chapterIdx":33,"updateTime":0,"readAhead":0,"title":"电车困境：我们的理性和情绪如何平衡","wordCount":2535,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0002.xhtml"]},{"chapterUid":34,"chapterIdx":34,"updateTime":0,"readAhead":0,"title":"偏好逆转：为什么大脑会与“魔鬼”交易","wordCount":2127,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0003.xhtml"]},{"chapterUid":35,"chapterIdx":35,"updateTime":0,"readAhead":0,"title":"尤利西斯合约：为什么我们甘愿受约束","wordCount":2738,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0004.xhtml"]},{"chapterUid":36,"chapterIdx":36,"updateTime":0,"readAhead":0,"title":"左右脑是合作关系，还是竞争关系","wordCount":2978,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0005.xhtml"]},{"chapterUid":37,"chapterIdx":37,"updateTime":0,"readAhead":0,"title":"大脑真能分成不同功能的区域吗","wordCount":2009,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0006.xhtml"]},{"chapterUid":38,"chapterIdx":38,"updateTime":0,"readAhead":0,"title":"斯特鲁普干扰：大脑中存在哪些未知的冲突","wordCount":1538,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0007.xhtml"]},{"chapterUid":39,"chapterIdx":39,"updateTime":0,"readAhead":0,"title":"解释器：大脑“编故事”是一种自我保护吗","wordCount":4659,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0008.xhtml"]},{"chapterUid":40,"chapterIdx":40,"updateTime":0,"readAhead":0,"title":"为什么我们会有意识","wordCount":2735,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0009.xhtml"]},{"chapterUid":41,"chapterIdx":41,"updateTime":0,"readAhead":0,"title":"为什么保守秘密不利于大脑健康","wordCount":1267,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0010.xhtml"]},{"chapterUid":42,"chapterIdx":42,"updateTime":0,"readAhead":0,"title":"会不会出现“聪明的”机器人","wordCount":1851,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0018_0011.xhtml"]},{"chapterUid":43,"chapterIdx":43,"updateTime":0,"readAhead":0,"title":"06 对大脑所做的决策进行“问责”不可取","wordCount":96,"price":-1,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0020.xhtml"]},{"chapterUid":44,"chapterIdx":44,"updateTime":0,"readAhead":0,"title":"为什么不是所有人都能自主选择","wordCount":3769,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021.xhtml"]},{"chapterUid":45,"chapterIdx":45,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_45","title":"为什么男性容易犯罪","wordCount":1605,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0001.xhtml"]},{"chapterUid":46,"chapterIdx":46,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_46","title":"我们是否拥有自由意志","wordCount":7378,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0002.xhtml"]},{"chapterUid":47,"chapterIdx":47,"updateTime":0,"readAhead":0,"title":"从责备到科学：我们到底受什么控制","wordCount":1541,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0003.xhtml"]},{"chapterUid":48,"chapterIdx":48,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_48","title":"为什么追究责任归属不可取","wordCount":2055,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0004.xhtml"]},{"chapterUid":49,"chapterIdx":49,"updateTime":0,"readAhead":0,"title":"我们能否建立更完善的法律体系","wordCount":2740,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0005.xhtml"]},{"chapterUid":50,"chapterIdx":50,"updateTime":0,"readAhead":0,"title":"如何训练大脑的冲动控制能力","wordCount":2817,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0006.xhtml"]},{"chapterUid":51,"chapterIdx":51,"updateTime":0,"readAhead":0,"title":"为什么说生而不平等有利于人类进化","wordCount":1218,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0007.xhtml"]},{"chapterUid":52,"chapterIdx":52,"updateTime":0,"readAhead":0,"title":"如何更妥当地处罚罪犯","wordCount":2793,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0021_0008.xhtml"]},{"chapterUid":53,"chapterIdx":53,"updateTime":0,"readAhead":0,"title":"07 大脑不是决定自我的唯一参与者","wordCount":217,"price":-1,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0023.xhtml"]},{"chapterUid":54,"chapterIdx":54,"updateTime":0,"readAhead":0,"title":"废黜自我意味着什么","wordCount":3509,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0024.xhtml"]},{"chapterUid":55,"chapterIdx":55,"updateTime":0,"readAhead":0,"title":"我们真能认识自我吗","wordCount":1952,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0024_0001.xhtml"]},{"chapterUid":56,"chapterIdx":56,"updateTime":0,"readAhead":0,"title":"我们是否拥有脱离物理生物基础的灵魂","wordCount":5114,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0024_0002.xhtml"]},{"chapterUid":57,"chapterIdx":57,"updateTime":0,"readAhead":0,"tar":"https://res.weread.qq.com/wrco/tar_27416212_57","title":"为什么说大脑不是决定自我的唯一因素","wordCount":8703,"price":-1,"paid":0,"isMPChapter":0,"level":2,"files":["Text/chapter0024_0003.xhtml"]},{"chapterUid":58,"chapterIdx":58,"updateTime":0,"readAhead":0,"title":"译者后记","wordCount":1358,"price":-1,"paid":0,"isMPChapter":0,"level":1,"files":["Text/chapter0025.xhtml"]}],"removed":[],"synckey":56464877,"copyRightSynckey":1,"book":{"bookId":"27416212","version":56464877,"format":"epub","cover":"https://cdn.weread.qq.com/weread/cover/83/YueWen_27416212/s_YueWen_27416212.jpg","title":"隐藏的自我","author":"大卫·伊格曼　","price":39.9,"type":0}}]}
