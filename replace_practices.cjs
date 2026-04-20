const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ 缺少 Supabase 环境变量配置");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const authors = ['资深架构师', '高级产品经理', '数据科学家', '增长黑客', '顶级设计师', '资深HR', '销售总监', '全栈工程师', 'AI提示词专家', '资深数据分析师'];
const tags = ['产品', '开发', '运营', '设计', '职场办公', '人事', '销售', '数据分析', 'Prompt工程', '自动化'];

// 构建50个高质量的复杂 Prompt
const highQualityPractices = [
  {
    title: "前端架构级代码 Review 与重构（基于 SOLID 原则）",
    tag: "开发",
    content: "让大模型以资深前端架构师的视角，对你的 React/Vue 代码进行深度审查，从性能优化、可维护性、安全性等多维度提供重构建议。",
    prompt: "你是一位拥有 15 年经验的资深前端架构师。请对以下代码进行深度 Code Review。\\n\\n你的审查标准必须包括：\\n1. **SOLID 原则**：代码是否符合单一职责、开闭原则等。\\n2. **性能优化**：是否存在不必要的渲染（如 React 缺少 memo、滥用 useEffect）、内存泄漏风险。\\n3. **安全性**：是否存在 XSS 注入风险、敏感信息硬编码等。\\n4. **可维护性**：变量命名是否语义化、组件粒度是否合理、是否缺乏必要的类型定义（TypeScript）。\\n\\n请按照以下格式输出：\\n- **【存在的问题】**：分点列出代码缺陷，并解释原因。\\n- **【重构思路】**：说明你将如何重构这段代码。\\n- **【重构后的代码】**：提供完整的、带有详细注释的最佳实践代码。\\n\\n待审查代码如下：\\n[在此处粘贴你的代码]"
  },
  {
    title: "全结构化商业级产品需求文档 (PRD) 生成",
    tag: "产品",
    content: "输入简单的想法，AI 帮你产出包含背景、用户故事、业务流程图（Mermaid）、数据字典、埋点需求在内的完整 PRD。",
    prompt: "你是一位顶级的产品总监，擅长将模糊的想法转化为严谨、可执行的商业级产品需求文档 (PRD)。\\n\\n背景信息：[请用一两句话描述你的产品想法]\\n目标受众：[目标用户群体]\\n\\n请为我生成一份详细的 PRD，必须包含以下模块：\\n1. **项目概述**：产品愿景、业务价值、成功指标 (Metrics)。\\n2. **用户故事 (User Stories)**：按照格式“作为一个 [角色]，我希望 [目标]，以便于 [收益]”列出至少 5 个核心用户故事，并标记优先级（P0/P1/P2）。\\n3. **核心业务流程**：请使用 Mermaid 语法输出产品核心主链路的流程图。\\n4. **功能需求说明**：以表格形式详细描述功能点、前置条件、正常流程、异常处理、业务规则。\\n5. **数据与埋点需求**：需要追踪的关键事件（Event）及属性（Properties）。\\n6. **非功能性需求**：性能、兼容性、安全性要求。\\n\\n请确保语言极其专业、无废话，直接输出 Markdown 格式文档。"
  },
  {
    title: "SQL 性能调优与复杂查询解析专家",
    tag: "数据分析",
    content: "不仅仅是写 SQL，更让 AI 为你分析查询执行计划、设计索引、避免全表扫描，生成企业级的高性能 SQL 脚本。",
    prompt: "你是一位资深的 DBA（数据库管理员）和数据科学家。我的数据库类型是 [MySQL / PostgreSQL / Oracle]。\\n\\n以下是我的表结构（DDL）：\\n[粘贴你的表结构 CREATE TABLE 语句，包含索引信息]\\n\\n我的业务需求是：\\n[详细描述你需要查询的数据，例如：统计过去 30 天每个部门销售额排名前 3 的员工，且排除离职员工。]\\n\\n请你为我完成以下任务：\\n1. **编写 SQL**：写出最优的 SQL 语句。必须使用标准、易读的格式（如 CTE 公用表表达式、窗口函数）。\\n2. **性能分析**：解释这段 SQL 的执行逻辑，是否会命中现有索引？\\n3. **优化建议**：指出潜在的性能瓶颈（如全表扫描、Filesort），并提供创建最优索引的 `CREATE INDEX` 语句。\\n4. **边界情况处理**：如何处理数据倾斜、Null 值或者海量数据下的分页问题？"
  },
  {
    title: "小红书/抖音高爆款网感文案与脚本拆解",
    tag: "运营",
    content: "利用成熟的钩子法则（Hook）、情绪价值拉满的文案结构，批量生成爆款社交媒体内容。",
    prompt: "你是一个深谙流量密码的新媒体运营总监，精通小红书、抖音的算法推荐机制和用户心理学。\\n\\n我的产品/主题是：[在此输入主题，例如：职场新人如何高效使用 AI 工具]\\n我的目标用户是：[在此输入目标受众]\\n\\n请为我生成一套高爆款的内容方案，包含：\\n1. **5个极致诱惑的爆款标题**：要求使用“情绪词+痛点+数字/反差”结构，字数控制在 20 字以内。\\n2. **正文内容（小红书风格）**：\\n   - 【黄金前三行】：设置悬念或痛点共鸣，留住用户。\\n   - 【干货正文】：逻辑清晰，多用 Emoji，每段不超过 3 行，提供情绪价值。\\n   - 【互动结尾】：设置具有争议性或强互动性的问题，引导评论和收藏。\\n3. **封面图建议**：描述封面的视觉构图、大字报文案，吸引点击。\\n4. **标签(Tags)**：提供 10 个高流量的长尾话题标签。"
  },
  {
    title: "B2B 高转化率冷拓客(Cold Email)七步法模板",
    tag: "销售",
    content: "告别千篇一律的推销信，利用 AIDA 漏斗和个性化痛点挖掘，生成客户无法拒绝的 B2B 开发信。",
    prompt: "你是一位世界级的 B2B 销售大师，精通客户心理学和高转化率开发信写作技巧。\\n\\n背景信息：\\n- 我的公司及产品价值主张：[输入产品优势]\\n- 目标客户画像及职位：[输入客户职位，如 CTO、HRD]\\n- 客户可能面临的最大痛点：[输入客户痛点]\\n\\n请为我撰写一套 B2B Cold Email 序列（包含 3 封邮件：首次触达、跟进、最后通牒），必须遵循以下原则：\\n1. **标题(Subject Line)**：简短、引发好奇，避免被判定为垃圾邮件，不超过 6 个词。\\n2. **个性化开场(Icebreaker)**：从客户公司的近期新闻或行业痛点切入，不要一上来就推销。\\n3. **价值传递(Value Proposition)**：用 1 句话讲清我们能如何解决他们的痛点，带上具体数据或客户案例（Social Proof）。\\n4. **明确的 CTA(Call to Action)**：请求一次无压力的 15 分钟简短交流，只给出一个选项。\\n\\n邮件语言要求：专业、自信、极简主义，消除一切冗词赘句。"
  },
  {
    title: "Midjourney V6 极致商业摄影级 Prompt 框架",
    tag: "设计",
    content: "使用好莱坞级别的摄影参数（焦段、光圈、灯光阵列、胶片材质），让 AI 生成毫无 AI 味的顶级摄影图。",
    prompt: "你是一位好莱坞级别的摄影指导（Director of Photography）和 Midjourney V6 提示词工程专家。\\n\\n我想生成一张关于 [输入你的核心画面主体，例如：一位穿着赛博朋克风格风衣的女性在东京霓虹街头喝咖啡] 的图像。\\n\\n请按照以下严格的公式为我编写 3 个不同风格的 Midjourney 英文提示词（Prompt）：\\n[主体描述] + [环境背景] + [光线布置] + [摄影机与镜头参数] + [胶片材质/渲染引擎] + [风格修饰词] + [--ar 比例 --style raw --v 6.0]\\n\\n要求：\\n1. **镜头语言**：精确使用焦距（如 35mm, 85mm, 200mm）和光圈（如 f/1.2, f/8）。\\n2. **灯光设计**：使用专业的布光术语（如 Rembrandt lighting, cinematic rim light, neon backlighting, soft volumetric light）。\\n3. **材质感**：指定胶片类型（如 Kodak Portra 400, Fujifilm Superia）或渲染引擎（Unreal Engine 5, Octane Render）。\\n\\n输出时，请先用中文解析每个提示词的视觉意境，然后给出可以直接复制的纯英文 Prompt 代码块。"
  },
  {
    title: "全维度 API 接口设计与 OpenAPI 规范生成",
    tag: "开发",
    content: "输入简单的实体模型，AI 自动为你设计 RESTful API 路由、请求参数、状态码，并输出 Swagger/OpenAPI YAML 文档。",
    prompt: "你是一位资深的后端架构师，精通 RESTful API 设计规范和微服务架构。\\n\\n我需要为以下业务实体设计 API：\\n实体名称：[例如：订单 Order / 用户 User]\\n实体包含的字段及业务逻辑：[例如：包含订单号、用户ID、金额、状态(待支付、已支付、已发货)；需要支持分页查询和状态流转]\\n\\n请为我完成：\\n1. **API 路由设计**：列出符合 RESTful 规范的端点（GET, POST, PUT, PATCH, DELETE），路径要求语义化。\\n2. **状态码与错误处理**：列出每个接口可能返回的 HTTP 状态码（200, 201, 400, 401, 403, 404, 500）及对应的 JSON 错误格式规范。\\n3. **OpenAPI (Swagger) 文档**：请直接输出标准的 OpenAPI 3.0 YAML 格式代码，必须包含 `components/schemas` 定义、详细的请求体（RequestBody）、响应体（Responses）以及 mock 示例数据。"
  },
  {
    title: "基于 STAR 原则的年终绩效/晋升答辩自述",
    tag: "职场办公",
    content: "把流水账般的工作记录，利用 AI 结构化重塑为充满数据支撑、展现领导力和业务价值的高级汇报材料。",
    prompt: "你是一位拥有 10 年世界 500 强企业管理经验的 HR 兼高管教练。\\n\\n我正在准备我的【年终绩效评估 / 晋升答辩】。\\n我目前的职位是：[输入你的职位]\\n我今年的流水账工作成绩如下：\\n[输入你这一年做过的事情，越详细越好]\\n\\n请帮我将这些流水账重写为极具说服力的汇报材料。必须遵循以下要求：\\n1. **应用 STAR 原则**：将每项工作拆解为情境 (Situation)、任务 (Task)、行动 (Action)、结果 (Result)。\\n2. **数据化表达**：提炼和强调可量化的业务成果（如效率提升百分比、节省成本、增加营收等）。\\n3. **能力维度升华**：不要只写“做了什么”，要提炼出背后的核心能力（如：跨部门协同领导力、架构前瞻性、复杂问题解决能力）。\\n4. **输出格式**：\\n   - 一句话核心贡献总结（Elevator Pitch）\\n   - 核心业绩一（包含 STAR 拆解）\\n   - 核心业绩二（包含 STAR 拆解）\\n   - 个人成长与明年规划（展现自我驱动力）\\n语言风格要求：客观、专业、自信，避免谦卑或夸大。"
  },
  {
    title: "AI 辅助的大型代码库项目结构初始化方案",
    tag: "开发",
    content: "面对新项目不知如何规划目录？让 AI 为你生成基于 Domain-Driven Design (DDD) 或整洁架构的最佳目录树结构及配置文件模板。",
    prompt: "你是一位卓越的软件架构师，精通大型复杂项目的工程化配置与目录结构设计（尤其是 DDD 领域驱动设计和 Clean Architecture）。\\n\\n我即将开启一个新项目，技术栈为：[例如：Next.js, TypeScript, TailwindCSS, Prisma / Spring Boot, Java, MySQL]\\n业务场景是：[例如：一个支持多租户的 B2B SaaS 电商平台]\\n\\n请为我设计该项目的文件目录结构，并详细说明：\\n1. **目录树结构**：使用 ASCII 字符画出树形结构，层级清晰。\\n2. **各目录职责说明**：解释为什么这样分层（例如 infrastructure, domain, application, presentation 层的各自职责）。\\n3. **依赖流向**：说明架构中各层之间的引用关系，确保符合依赖倒置原则。\\n4. **核心配置文件模板**：提供项目必须的基础配置（如 tsconfig.json 的路径别名配置、ESLint/Prettier 核心规则）的建议。"
  },
  {
    title: "竞品深度分析与商业画布 (Business Model Canvas)",
    tag: "产品",
    content: "一键获取包含市场定位、商业模式画布、SWOT 分析和核心功能差异化对比的高端竞品调研框架。",
    prompt: "你是一位顶级商业分析师和产品战略专家，精通市场调研与商业模式设计。\\n\\n我要分析的竞品是：[输入竞品名称或行业，例如：Notion 与 印象笔记]\\n我的产品/想法是：[输入你的产品定位]\\n\\n请为我输出一份极具深度的竞品分析报告框架，必须包含以下模块：\\n1. **精简版商业模式画布 (Business Model Canvas)**：针对该竞品，分析其客户细分、价值主张、渠道通路、客户关系、收入来源、核心资源、关键业务、重要合作、成本结构。\\n2. **SWOT 深度剖析**：基于当前市场环境，分析其优势 (S)、劣势 (W)、机会 (O)、威胁 (T)。\\n3. **核心用户路径对比**：推演其核心 Aha Moment（顿悟时刻）的转化漏斗。\\n4. **差异化破局策略**：基于上述分析，为我的产品提供 3 条“以小博大”或“错位竞争”的战略建议。\\n语言要求：洞察深刻、使用专业商业术语、逻辑极其严密。"
  }
];

// 自动生成扩展到50个复杂提示词，使用生成算法来构建，确保每一个都有极高的质量
const techStacks = ['React', 'Vue', 'Node.js', 'Python', 'Go', 'Rust', 'Java', 'Flutter', 'Swift', 'Kotlin'];
const roles = ['资深专家', '架构师', '总监', '首席分析师', '高级顾问', '金牌讲师', '顶级设计师', '黑客', '战略家', '优化师'];
const tasks = [
  { action: "系统性能瓶颈排查与压测", target: "高并发微服务系统", benefit: "实现 QPS 万级突破", tag: "开发" },
  { action: "用户留存率分析与增长模型建立", target: "SaaS 订阅制产品", benefit: "降低流失率，提升 LTV", tag: "运营" },
  { action: "自动化测试框架搭建与用例生成", target: "核心交易链路", benefit: "实现 90% 以上的测试覆盖率", tag: "开发" },
  { action: "OKR 战略拆解与执行追踪", target: "跨部门协作团队", benefit: "确保公司战略在基层落地", tag: "职场办公" },
  { action: "基于行为面试法(BDI)的招聘题库", target: "高级研发/管理岗位", benefit: "精准识别候选人真实能力", tag: "人事" },
  { action: "SEO 关键词聚类与内容矩阵规划", target: "独立站/内容博客", benefit: "获取源源不断的自然搜索流量", tag: "运营" },
  { action: "复杂数据看板(Dashboard)指标体系设计", target: "管理层决策报表", benefit: "实现数据驱动决策", tag: "数据分析" },
  { action: "公关危机回应与声明撰写", target: "品牌负面舆情事件", benefit: "化解信任危机，重塑品牌形象", tag: "运营" },
  { action: "微前端架构改造方案设计", target: "巨石应用(Monolith)", benefit: "实现团队独立部署与技术栈解耦", tag: "开发" },
  { action: "法律合规与用户隐私协议(GDPR)审查", target: "全球化出海产品", benefit: "规避数百万美元的合规罚款风险", tag: "产品" }
];

let generatedPractices = [...highQualityPractices];

let idCounter = 1;
// 赋 ID 和基础数据
generatedPractices = generatedPractices.map(p => ({
  id: idCounter++,
  title: p.title,
  author: authors[Math.floor(Math.random() * authors.length)],
  views: Math.floor(Math.random() * 10000) + 1000,
  likes: Math.floor(Math.random() * 2000) + 200,
  tags: [p.tag, '专家级', '复杂工作流', 'AI驱动'],
  content: p.content,
  prompt: p.prompt
}));

// 补充剩下的 40 个以达到 50 个
for (let i = generatedPractices.length; i < 50; i++) {
  const task = tasks[i % tasks.length];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const tech = techStacks[Math.floor(Math.random() * techStacks.length)];
  const isDev = task.tag === '开发';
  
  generatedPractices.push({
    id: idCounter++,
    title: `${task.action}专家指南：${task.target}`,
    author: authors[Math.floor(Math.random() * authors.length)],
    views: Math.floor(Math.random() * 8000) + 500,
    likes: Math.floor(Math.random() * 1000) + 100,
    tags: [task.tag, '高级指南', isDev ? tech : '方法论'],
    content: `结合行业顶尖的实践方法，让 AI 扮演${role}，为你提供针对【${task.target}】的【${task.action}】全套解决方案，最终帮助你${task.benefit}。`,
    prompt: `你是一位在行业内享有盛誉的${role}，拥有超过10年的实战经验。\\n\\n我当前面临的挑战是：【${task.action}】\\n目标对象/场景是：【${task.target}】\\n我期望达成的最终结果是：【${task.benefit}】\\n${isDev ? '\\n我当前使用的核心技术栈是：' + tech + '\\n' : ''}\\n请你为我输出一份具备极高可执行性的专业方案。方案必须包含以下几个结构化维度：\\n\\n1. **【现状诊断与根本原因分析】**：利用专业框架（如 5Why, SWOT, 或系统架构分析），深度剖析目前可能存在的核心痛点和隐患。\\n2. **【破局策略与核心方法论】**：给出 3-5 条关键性的解决思路，不要泛泛而谈，必须具体到策略层面（例如，如果是开发，请指出具体的设计模式或架构调整；如果是运营，请指出具体的转化漏斗优化）。\\n3. **【Step-by-Step 落地执行路径】**：按照时间轴（如 Day 1, Week 1, Month 1）或优先级（P0, P1, P2）拆解具体的行动步骤。每一步必须明确：做什么、怎么做、衡量标准是什么。\\n4. **【风险预案与避坑指南】**：列举在执行该方案时最容易踩的 3 个坑，并给出预防措施。\\n\\n请确保你的回答极其专业，使用行业黑话和专业术语，逻辑严密，并以 Markdown 格式排版，多用粗体和列表以提升可读性。`
  });
}

async function runReplace() {
  try {
    console.log('🗑️ 正在清空 Supabase 中的旧数据...');
    // Delete all records (requires RLS policy to allow or using Service Role Key which bypasses RLS)
    const { error: deleteError } = await supabase
      .from('best_practices')
      .delete()
      .neq('id', 0); // Hack to delete all rows

    if (deleteError) {
      console.error('❌ 删除旧数据失败:', deleteError.message);
      return;
    }
    
    console.log('✅ 旧数据已清空。');
    
    // Remove id before insert to let DB auto-increment or handle it
    const supabaseData = generatedPractices.map(({id, ...rest}) => rest);
    
    console.log(`🚀 正在插入 ${supabaseData.length} 条极其复杂的专家级 Prompt...`);
    const { data, error: insertError } = await supabase
      .from('best_practices')
      .insert(supabaseData)
      .select();
      
    if (insertError) {
      console.error('❌ 插入新数据失败:', insertError.message);
      return;
    }
    
    console.log(`🎉 成功写入 ${data.length} 条高质量数据到 Supabase！`);
    
    // 更新本地 fallback
    const fileContent = `export interface Practice {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  tags: string[];
  content: string;
  prompt: string;
}

export const practices: Practice[] = ${JSON.stringify(generatedPractices, null, 2)};
`;
    fs.writeFileSync('./src/data/bestPractices.ts', fileContent);
    console.log('✅ 本地 fallback 数据 src/data/bestPractices.ts 已同步更新！');
    
  } catch (err) {
    console.error('❌ 发生异常:', err);
  }
}

runReplace();
