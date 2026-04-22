import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Supabase 配置
const supabaseUrl = 'https://hzbrgdaudidzokewdpwz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YnJnZGF1ZGlkem9rZXdkcHd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsIklhdCI6MTc3NjY2MzY4OCwiZXhwIjoyMDkyMjM5Njg4fQ.mA74ceiyrf6oJVA-152ZJwWzsQ-s_OMdHa03-2UnhtQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyWorkflowsMigration() {
  console.log('🔧 正在应用工作流数据库迁移...');

  try {
    // 读取迁移文件
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', 'create_workflows.sql');
    const sqlContent = readFileSync(migrationPath, 'utf8');

    console.log('📄 读取迁移文件:', migrationPath);

    // 检查当前数据库状态
    console.log('\n🔍 检查当前数据库状态...');

    // 检查 workflows 表
    const { error: workflowsError } = await supabase
      .from('workflows')
      .select('id')
      .limit(1);

    if (workflowsError && workflowsError.code === '42P01') {
      console.log('❌ workflows 表不存在，需要创建');
    } else if (!workflowsError) {
      console.log('✅ workflows 表已存在');
    }

    // 检查 workflow_tasks 表
    const { error: tasksError } = await supabase
      .from('workflow_tasks')
      .select('id')
      .limit(1);

    if (tasksError && tasksError.code === '42P01') {
      console.log('❌ workflow_tasks 表不存在，需要创建');
    } else if (!tasksError) {
      console.log('✅ workflow_tasks 表已存在');
    }

    console.log('\n💡 解决方案:');
    console.log('由于无法通过API直接执行SQL，请按照以下步骤手动应用迁移:');
    console.log('');
    console.log('1. 打开 Supabase 控制台: https://hzbrgdaudidzokewdpwz.supabase.co');
    console.log('2. 导航到 "SQL Editor"');
    console.log('3. 创建新的SQL查询');
    console.log('4. 复制以下内容到SQL编辑器中:');
    console.log('');
    console.log('='.repeat(60));
    console.log(sqlContent);
    console.log('='.repeat(60));
    console.log('');
    console.log('5. 点击 "运行" 按钮执行SQL');
    console.log('6. 执行完成后，重新测试工作流功能');

    // 验证迁移内容
    console.log('\n📋 迁移文件内容验证:');
    if (sqlContent.includes('CREATE TABLE public.workflows')) {
      console.log('✅ 包含 workflows 表创建语句');
    }
    if (sqlContent.includes('CREATE TABLE public.workflow_tasks')) {
      console.log('✅ 包含 workflow_tasks 表创建语句');
    }
    if (sqlContent.includes('ALTER TABLE') && sqlContent.includes('ROW LEVEL SECURITY')) {
      console.log('✅ 包含行级安全策略');
    }
    if (sqlContent.includes('CREATE POLICY')) {
      console.log('✅ 包含访问策略');
    }
    if (sqlContent.includes('CREATE INDEX')) {
      console.log('✅ 包含性能优化索引');
    }

  } catch (error) {
    console.error('❌ 应用迁移时出错:', error.message);
  }
}

applyWorkflowsMigration();