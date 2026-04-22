/**
 * 功能测试脚本
 * 用于验证新实现的Agent工作流、推荐系统和Prompt优化功能
 */

import { WorkflowEngine } from './lib/agents/WorkflowEngine';
import { RecommendationEngine } from './lib/recommendation/RecommendationEngine';
import { PromptEngine } from './lib/prompt/PromptEngine';

// 测试Agent工作流功能
async function testWorkflowEngine() {
  console.log('🧪 测试 Agent 工作流引擎...');

  const engine = new WorkflowEngine();

  try {
    // 创建工作流
    const workflow = await engine.createWorkflow(
      '分析当前AI技术的发展趋势，并制定一个学习计划',
      'AI技术学习规划'
    );

    console.log('✅ 工作流创建成功:', workflow.title);
    console.log('📋 包含任务数:', workflow.tasks.length);
    console.log('📝 任务列表:', workflow.tasks.map(t => t.title));

    // 执行工作流（模拟）
    console.log('🚀 开始执行工作流...');
    // 注意：实际执行需要真实API，这里只是演示结构
    console.log('✅ 工作流执行完成（演示模式）');

    return true;
  } catch (error) {
  console.log('❌ 工作流测试失败:', error);
  return false;
  }
}

// 测试推荐系统
async function testRecommendationEngine() {
  console.log('\n🧪 测试推荐系统...');

  const engine = new RecommendationEngine();

  try {
    // 模拟用户行为
    engine.trackUserBehavior('user1', '1', 'practice', 'view', 120);
    engine.trackUserBehavior('user1', '2', 'practice', 'like', 300);
    engine.trackUserBehavior('user1', '3', 'practice', 'complete', 600);

    console.log('✅ 用户行为跟踪成功');

    // 获取推荐
    const recommendations = await engine.getRecommendations('user1');
    console.log('✅ 推荐生成成功，数量:', recommendations.length);
    console.log('📊 推荐示例:', recommendations.slice(0, 3).map(r => ({
      title: r.title,
      score: r.score,
      reason: r.reason
    })));

    return true;
  } catch (error) {
    console.log('❌ 推荐系统测试失败:', error);
    return false;
  }
}

// 测试Prompt优化
async function testPromptEngine() {
  console.log('\n🧪 测试 Prompt 优化引擎...');

  const engine = new PromptEngine();

  try {
    const originalPrompt = '分析AI技术的发展趋势';
    const context = {
      taskType: 'analysis',
      userLevel: 'intermediate' as const,
      domain: 'AI技术'
    };

    const optimized = await engine.optimizePrompt(originalPrompt, context);

    console.log('✅ Prompt优化成功');
    console.log('📝 原始Prompt:', optimized.originalPrompt);
    console.log('✨ 优化后Prompt长度:', optimized.optimizedPrompt.length);
    console.log('🎯 使用模板:', optimized.template.name);
    console.log('📊 质量评分:', (optimized.estimatedQuality * 100).toFixed(1) + '%');
    console.log('💡 改进点:', optimized.improvements);

    return true;
  } catch (error) {
    console.log('❌ Prompt优化测试失败:', error);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始功能测试...\n');

  const results = {
    workflow: await testWorkflowEngine(),
    recommendation: await testRecommendationEngine(),
    prompt: await testPromptEngine()
  };

  console.log('\n📊 测试结果汇总:');
  console.log('Agent工作流:', results.workflow ? '✅ 通过' : '❌ 失败');
  console.log('推荐系统:', results.recommendation ? '✅ 通过' : '❌ 失败');
  console.log('Prompt优化:', results.prompt ? '✅ 通过' : '❌ 失败');

  const allPassed = Object.values(results).every(r => r);
  console.log('\n🎯 总体结果:', allPassed ? '✅ 所有测试通过' : '❌ 部分测试失败');

  return allPassed;
}

// 导出测试函数
export { testWorkflowEngine, testRecommendationEngine, testPromptEngine, runAllTests };

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}