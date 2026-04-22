// 检查环境变量配置
console.log('🔍 检查环境变量配置...');

// 模拟检查 .env 文件
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
console.log('📁 检查 .env 文件:', envPath);

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ .env 文件存在');

    // 检查关键环境变量
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingVars = [];

    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`✅ ${varName}: 已配置`);
      } else {
        console.log(`❌ ${varName}: 未配置`);
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      console.log('\n❌ 缺少必要的环境变量，需求发布功能将无法工作');
      console.log('请在 .env 文件中添加以下配置:');
      missingVars.forEach(varName => {
        console.log(`${varName}=your_${varName.toLowerCase()}_here`);
      });
    } else {
      console.log('\n✅ 所有必要的环境变量已配置');
    }

  } else {
    console.log('❌ .env 文件不存在');
    console.log('请创建 .env 文件并添加以下配置:');
    console.log('VITE_SUPABASE_URL=your_supabase_url_here');
    console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
  }
} catch (error) {
  console.error('❌ 检查环境变量时出错:', error.message);
}

// 检查数据库迁移文件
const migrationPath = path.join(__dirname, 'supabase', 'migrations', 'create_demands.sql');
console.log('\n🔍 检查数据库迁移文件...');

if (fs.existsSync(migrationPath)) {
  console.log('✅ 数据库迁移文件存在');
  const migrationContent = fs.readFileSync(migrationPath, 'utf8');

  if (migrationContent.includes('CREATE TABLE public.demands')) {
    console.log('✅ 需求表创建语句存在');
  } else {
    console.log('❌ 需求表创建语句缺失');
  }

  if (migrationContent.includes('CREATE TABLE public.demand_applications')) {
    console.log('✅ 需求申请表创建语句存在');
  } else {
    console.log('❌ 需求申请表创建语句缺失');
  }
} else {
  console.log('❌ 数据库迁移文件不存在');
}