import { demandsApi } from './demands';

// Test function to verify the demands API works
export async function testDemandsApi() {
  try {
    console.log('Testing demands API...');

    // Test fetching demands (should return empty array initially)
    const demands = await demandsApi.getDemands();
    console.log('✓ getDemands works, found:', demands.length, 'demands');

    // Test creating a new demand
    const newDemand = await demandsApi.createDemand({
      title: '测试需求 - AI 助手开发',
      description: '这是一个测试需求，用于验证悬赏系统的功能是否正常。',
      requester: '测试用户',
      department: '技术部',
      budget: '￥1000',
      deadline: '2026-12-31',
      tags: ['AI', '测试', 'React']
    });
    console.log('✓ createDemand works, created demand ID:', newDemand.id);

    // Test fetching the created demand
    const fetchedDemand = await demandsApi.getDemandById(newDemand.id);
    console.log('✓ getDemandById works, fetched:', fetchedDemand.title);

    // Test applying to the demand
    const application = await demandsApi.applyToDemand({
      demand_id: newDemand.id,
      applicant_name: '张三',
      applicant_email: 'zhangsan@example.com',
      proposal: '我有丰富的 AI 开发经验，可以完成这个任务。'
    });
    console.log('✓ applyToDemand works, created application ID:', application.id);

    // Test fetching applications
    const applications = await demandsApi.getDemandApplications(newDemand.id);
    console.log('✓ getDemandApplications works, found:', applications.length, 'applications');

    console.log('🎉 All demands API tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Demands API test failed:', error);
    return false;
  }
}