// 调试需求创建功能的详细日志
export async function debugDemandCreation() {
  console.log('🔍 开始调试需求创建功能...');

  // 检查 Supabase 配置
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('🔧 Supabase 配置检查:');
  console.log('  - URL:', supabaseUrl ? '✅ 已配置' : '❌ 未配置');
  console.log('  - Key:', supabaseKey ? '✅ 已配置' : '❌ 未配置');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 配置缺失，请检查 .env 文件');
    return false;
  }

  try {
    // 测试 Supabase 连接
    console.log('\n🔗 测试 Supabase 连接...');
    const { supabase } = await import('./lib/supabase');

    // 测试表是否存在
    console.log('📊 检查数据库表...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('demands')
      .select('count(*)', { count: 'exact', head: true });

    if (tableError) {
      console.error('❌ 数据库表访问失败:', tableError.message);
      console.error('可能原因：');
      console.error('  1. demands 表不存在');
      console.error('  2. 数据库连接配置错误');
      console.error('  3. 行级安全策略限制');
      return false;
    }

    console.log('✅ 数据库表访问正常');

    // 测试创建需求
    console.log('\n📝 测试创建需求...');
    const testData = {
      title: '调试测试需求',
      description: '用于调试的需求',
      requester: '调试用户',
      department: '测试部门',
      budget: '￥500',
      deadline: '2026-12-31',
      tags: ['调试', '测试']
    };

    const { data, error } = await supabase
      .from('demands')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.error('❌ 需求创建失败:', error.message);
      console.error('错误代码:', error.code);
      console.error('错误详情:', error);
      return false;
    }

    console.log('✅ 需求创建成功!');
    console.log('📋 创建的需求ID:', data.id);

    // 测试查询
    console.log('\n🔍 测试查询功能...');
    const { data: demands, error: fetchError } = await supabase
      .from('demands')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ 查询失败:', fetchError.message);
      return false;
    }

    console.log(`✅ 成功查询到 ${demands.length} 个需求`);
    console.log('🎉 所有测试通过！');
    return true;

  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error);
    return false;
  }
}

// 暴露到全局供浏览器调试
if (typeof window !== 'undefined') {
  (window as any).debugDemandCreation = debugDemandCreation;
}