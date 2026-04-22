import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Supabase 配置
const supabaseUrl = 'https://hzbrgdaudidzokewdpwz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YnJnZGF1ZGlkem9rZXdkcHd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY2MzY4OCwiZXhwIjoyMDkyMjM5Njg4fQ.mA74ceiyrf6oJVA-152ZJwWzsQ-s_OMdHa03-2UnhtQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyMigration() {
  console.log('🔧 正在应用数据库迁移...');

  try {
    // 读取迁移文件
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', 'create_demands.sql');
    const sqlContent = readFileSync(migrationPath, 'utf8');

    console.log('📄 读取迁移文件:', migrationPath);

    // 检查当前数据库状态
    console.log('\n🔍 检查当前数据库状态...');

    // 检查 demands 表
    const { error: demandsError } = await supabase
      .from('demands')
      .select('id')
      .limit(1);

    if (demandsError && demandsError.code === '42P01') {
      console.log('❌ demands 表不存在，需要创建');
    } else if (!demandsError) {
      console.log('✅ demands 表已存在');
    }

    // 检查 demand_applications 表
    const { error: applicationsError } = await supabase
      .from('demand_applications')
      .select('id')
      .limit(1);

    if (applicationsError && applicationsError.code === '42P01') {
      console.log('❌ demand_applications 表不存在，需要创建');
    } else if (!applicationsError) {
      console.log('✅ demand_applications 表已存在');
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
    console.log('6. 执行完成后，重新测试需求发布功能');

    // 验证迁移内容
    console.log('\n📋 迁移文件内容验证:');
    if (sqlContent.includes('CREATE TABLE public.demands')) {
      console.log('✅ 包含 demands 表创建语句');
    }
    if (sqlContent.includes('CREATE TABLE public.demand_applications')) {
      console.log('✅ 包含 demand_applications 表创建语句');
    }
    if (sqlContent.includes('ALTER TABLE') && sqlContent.includes('ROW LEVEL SECURITY')) {
      console.log('✅ 包含行级安全策略');
    }
    if (sqlContent.includes('CREATE POLICY')) {
      console.log('✅ 包含访问策略');
    }

  } catch (error) {
    console.error('❌ 应用迁移时出错:', error.message);
  }
}

applyMigration();