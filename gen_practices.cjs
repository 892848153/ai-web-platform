const fs = require('fs');

const categories = ['产品', '开发', '运营', '设计', '职场办公', '人事', '销售', '数据分析'];
const authors = ['产品经理小王', '前端开发老李', '运营专员小张', '设计师Momo', '全栈工程师Dave', 'HR主管Lisa', '销售总监Jack', '数据分析师Sam', '架构师Tom'];

const templates = [
  { title: "使用 AI 撰写高质量产品需求文档 (PRD)", tag: "产品", content: "通过分步骤的 Prompt 模板，让大模型帮你快速生成结构完整、逻辑清晰的 PRD 文档。" },
  { title: "前端开发：从设计图到 React 组件代码", tag: "开发", content: "结合视觉大模型和代码大模型，快速将 UI 设计图转换为基于 Tailwind CSS 的 React 组件代码。" },
  { title: "一键生成周报与月度总结", tag: "职场办公", content: "将一周的工作流水账喂给 AI，利用特定的角色设定和输出格式要求，瞬间生成老板爱看的汇报文档。" },
  { title: "小红书爆款文案生成器", tag: "运营", content: "采用'吸引眼球的标题 + 痛点引入 + 价值提供 + 互动引导'的结构，快速批量产出小红书网感文案。" },
  { title: "代码 Review 与重构建议", tag: "开发", content: "让 AI 扮演资深架构师，对提交的代码进行安全、性能、可读性等多维度的审查并给出重构代码。" },
  { title: "快速生成 SQL 复杂查询语句", tag: "数据分析", content: "用自然语言描述表结构和查询需求，AI 瞬间输出包含 JOIN、子查询、窗口函数的高级 SQL。" },
  { title: "英文商务邮件润色与润色", tag: "职场办公", content: "把中式英语或者生硬的翻译交给 AI，设定为'地道、专业、礼貌的商务英语'，提升沟通专业度。" },
  { title: "Midjourney 摄影级提示词模板", tag: "设计", content: "包含相机型号、镜头、光线、渲染引擎等专业参数的结构化提示词，生成逼真摄影级图像。" },
  { title: "面试官：自动生成结构化面试题库", tag: "人事", content: "输入岗位 JD，让 AI 根据能力模型自动生成初试、复试的专业问题及考察点评分标准。" },
  { title: "高转化率的冷拓客(Cold Email)模板", tag: "销售", content: "基于 AIDA 法则，利用 AI 针对不同行业的潜在客户定制个性化、高打开率的开发信。" },
  { title: "竞品分析报告结构生成", tag: "产品", content: "一键获取包含市场定位、功能对比、优劣势分析（SWOT）的竞品分析报告大纲和研究思路。" },
  { title: "正则表达式解释与生成", tag: "开发", content: "彻底告别正则噩梦！用人话描述需求，AI 帮你写出精确的正则表达式并附带详细原理解释。" },
  { title: "短视频脚本分镜头设计", tag: "运营", content: "输入核心主题，AI 自动为你拆解出带画面描述、台词、音效、时长的标准分镜头脚本。" },
  { title: "用户体验(UX)研究问卷设计", tag: "设计", content: "针对特定产品功能，让 AI 设计包含定量与定性问题的用户调研问卷，避免诱导性提问。" },
  { title: "Excel VBA 宏与复杂公式编写", tag: "数据分析", content: "不会写 VBA？只需描述你的表格处理逻辑，AI 直接输出可运行的 VBA 代码和复杂嵌套公式。" },
  { title: "年度绩效自评与答辩思路", tag: "职场办公", content: "将全年的零散成绩输入给 AI，应用 STAR 原则，生成重点突出、数据详实的绩效自评小作文。" },
  { title: "自动生成项目甘特图排期", tag: "产品", content: "列出项目里程碑，AI 帮你预估工期、识别依赖关系，并输出适合导入 Mermaid 的图表代码。" },
  { title: "RESTful API 接口文档生成", tag: "开发", content: "给 AI 提供简单的功能描述或数据模型，一键生成符合 OpenAPI 规范的 Markdown 格式接口文档。" },
  { title: "公众号/知乎深度长文大纲规划", tag: "运营", content: "告别写作卡壳，让 AI 根据热点话题生成包含引言、核心论点、案例支撑和总结的爆款大纲。" },
  { title: "产品 Logo 灵感与设计方向推演", tag: "设计", content: "输入品牌调性和目标受众，AI 输出 5 种不同设计流派的 Logo 创意概念和配色方案建议。" }
];

// Generate remaining up to 50
const actions = ["自动生成", "快速编写", "一键解析", "深度优化", "结构化提取", "智能总结", "全方位分析", "从零搭建", "精准匹配", "高效产出"];
const targets = ["用户画像", "测试用例", "公关软文", "架构图", "OKR指标", "商业计划书", "错误日志", "法律合同条款", "活动策划方案", "社群运营SOP"];
const benefits = ["提升效率", "解放双手", "告别加班", "降本增效", "增强说服力", "避免低级错误", "突破创意瓶颈", "精准获客"];

const generatedTemplates = [];
let idCounter = 1;

// Add base templates
for (let t of templates) {
  generatedTemplates.push({
    id: idCounter++,
    title: t.title,
    author: authors[Math.floor(Math.random() * authors.length)],
    views: Math.floor(Math.random() * 5000) + 500,
    likes: Math.floor(Math.random() * 1000) + 100,
    tags: [t.tag, 'Prompt', '效率'],
    content: t.content,
    prompt: `你是一个资深的${t.tag}专家。请帮我处理以下任务：\n[在此输入你的具体需求]\n要求：专业、清晰、直接给出结果。`
  });
}

// Generate the rest to reach 50
while (generatedTemplates.length < 50) {
  const action = actions[Math.floor(Math.random() * actions.length)];
  const target = targets[Math.floor(Math.random() * targets.length)];
  const benefit = benefits[Math.floor(Math.random() * benefits.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  generatedTemplates.push({
    id: idCounter++,
    title: `${action}${target}，${benefit}`,
    author: authors[Math.floor(Math.random() * authors.length)],
    views: Math.floor(Math.random() * 3000) + 200,
    likes: Math.floor(Math.random() * 500) + 50,
    tags: [category, '工作流', 'AI工具'],
    content: `使用先进的 AI 模型，针对业务场景定制化${action}${target}。不仅能${benefit}，还能确保输出质量对标行业资深专家水平。`,
    prompt: `作为一名拥有10年经验的${category}专家，请为我${action}一份${target}。\n背景信息：[输入背景]\n目标受众：[输入受众]\n输出格式：Markdown 结构化文本。`
  });
}

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertData(dataToInsert) {
  console.log(`正在导入 ${dataToInsert.length} 条基础数据到 Supabase...`);
  const { data, error } = await supabase
    .from('best_practices')
    .insert(dataToInsert)
    .select();
    
  if (error) {
    console.error('❌ 导入失败:', error.message);
  } else {
    console.log(`✅ 成功导入 ${data.length} 条基础最佳实践数据！`);
  }
}

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

export const practices: Practice[] = ${JSON.stringify(generatedTemplates, null, 2)};
`;

fs.writeFileSync('./src/data/bestPractices.ts', fileContent);
console.log('Successfully generated 50 best practices in src/data/bestPractices.ts');

// Remove id for supabase insertion
const supabaseData = generatedTemplates.map(({id, ...rest}) => rest);
insertData(supabaseData);