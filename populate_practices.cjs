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

async function populate() {
  try {
    // 动态引入 es modules 的内容，如果是 commonjs 则可以直接 require，由于我们的是 ts 文件，可以用 fs + regex 简单解析
    const fs = require('fs');
    const tsContent = fs.readFileSync('./src/data/bestPractices.ts', 'utf-8');
    
    // 从 ts 提取 JSON 数组
    const match = tsContent.match(/export const practices: Practice\\[\\] = (\\[[\\s\\S]*\\]);/);
    if (!match) throw new Error("无法从 bestPractices.ts 解析 JSON 数据");
    
    const practices = JSON.parse(match[1]);
    
    // 去掉 id 字段（让 supabase 自动生成），以匹配 schema
    const dataToInsert = practices.map(({ id, ...rest }) => rest);
    
    console.log(`正在导入 ${dataToInsert.length} 条基础数据...`);
    
    const { data, error } = await supabase
      .from('best_practices')
      .insert(dataToInsert)
      .select();
      
    if (error) throw error;
    
    console.log(`✅ 成功导入 ${data.length} 条基础最佳实践数据！`);
  } catch (e) {
    console.error('❌ 导入失败:', e.message);
  }
}

populate();