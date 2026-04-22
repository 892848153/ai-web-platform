import { demandsApi } from './lib/demands';

async function testDemandCreation() {
  try {
    console.log('🧪 测试需求创建功能...');

    // 测试创建需求
    const testDemand = {
      title: '测试需求 - 验证发布功能',
      description: '这是一个测试需求，用于验证悬赏广场的发布功能是否正常工作。',
      requester: '测试用户',
      department: '技术部',
      budget: '￥1000',
      deadline: '2026-12-31',
      tags: ['测试', 'React', '前端开发']
    };

    console.log('📝 正在创建测试需求...');
    const created = await demandsApi.createDemand(testDemand);
    console.log('✅ 需求创建成功!');
    console.log('📋 需求ID:', created.id);
    console.log('📋 需求标题:', created.title);
    console.log('📋 创建时间:', created.created_at);

    // 测试获取需求列表
    console.log('\n📊 正在获取需求列表...');
    const demands = await demandsApi.getDemands();
    console.log(`✅ 成功获取 ${demands.length} 个需求`);

    // 测试获取单个需求
    console.log('\n🔍 正在获取需求详情...');
    const fetched = await demandsApi.getDemandById(created.id);
    console.log('✅ 需求详情获取成功!');
    console.log('📋 需求状态:', fetched.status);
    console.log('📋 申请人数:', fetched.applicants_count);

    console.log('\n🎉 所有测试通过！需求发布功能正常工作。');
    return true;

  } catch (error) {
    console.error('❌ 需求创建测试失败:', error);
    console.error('错误详情:', JSON.stringify(error, null, 2));
    return false;
  }
}

// 运行测试
if (typeof window !== 'undefined') {
  // 在浏览器环境中，通过全局函数暴露
  (window as any).testDemandCreation = testDemandCreation;
} else {
  // 在Node.js环境中直接运行
  testDemandCreation().then(success => {
    if (success) {
      console.log('✅ 测试成功完成');
    } else {
      console.log('❌ 测试失败');
    }
    process.exit(success ? 0 : 1);
  });
}