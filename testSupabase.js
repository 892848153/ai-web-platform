import { createClient } from '@supabase/supabase-js';

// 使用 .env 中的配置
const supabaseUrl = 'https://hzbrgdaudidzokewdpwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsIn5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YnJnZGF1ZGlkem9rZXdkcHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjM2ODgsImV4cCI6MjA5MjIzOTY4OH0.BIVBJDqv9w_wUayLopKzpObf2CsJEuFwYxDr_IJfS00';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 测试 Supabase 数据库连接...');

  try {
    // 检查 demands 表是否存在
    console.log('📊 检查 demands 表...');
    const { data, error } = await supabase
      .from('demands')
      .select('count(*)', { count: 'exact', head: true });

    if (error) {
      console.error('❌ 访问 demands 表失败:', error.message);
      console.error('错误代码:', error.code);

      if (error.code === '42P01') { // undefined_table
        console.log('\n💡 解决方案:');
        console.log('1. 登录 Supabase 控制台');
        console.log('2. 打开 SQL Editor');
        console.log('3. 运行 supabase/migrations/create_demands.sql 中的SQL语句');
        console.log('4. 重新测试');
      }

      return false;
    }

    console.log('✅ demands 表存在且可访问');

    // 检查表结构
    console.log('\n🏗️ 检查表结构...');
    const { data: structure, error: structureError } = await supabase
      .from('demands')
      .select('*')
      .limit(1);

    if (!structureError && structure) {
      console.log('✅ 表结构正常，字段:', Object.keys(structure[0] || {}));
    }

    // 测试插入数据
    console.log('\n📝 测试插入数据...');
    const testDemand = {
      title: '测试需求',
      description: '这是一个测试需求',
      requester: '测试用户',
      department: '技术部',
      budget: '￥1000',
      deadline: '2026-12-31',
      tags: ['测试']
    };

    const { data: insertData, error: insertError } = await supabase
      .from('demands')
      .insert([testDemand])
      .select()
      .single();

    if (insertError) {
      console.error('❌ 插入数据失败:', insertError.message);
      console.error('错误代码:', insertError.code);
      return false;
    }

    console.log('✅ 数据插入成功!');
    console.log('📋 插入的需求ID:', insertData.id);

    // 测试查询
    console.log('\n🔍 测试查询数据...');
    const { data: allDemands, error: fetchError } = await supabase
      .from('demands')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ 查询数据失败:', fetchError.message);
      return false;
    }

    console.log(`✅ 成功查询到 ${allDemands.length} 个需求`);
    console.log('\n🎉 所有测试通过！需求发布功能应该可以正常工作。');
    return true;

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    return false;
  }
}

testDatabase().then(success => {
  process.exit(success ? 0 : 1);
});