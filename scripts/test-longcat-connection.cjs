

/**
 * Test LongCat API Connection with your specific configuration
 * Usage: node scripts/test-longcat-connection.cjs
 */

const https = require('https');

// Your configuration
const API_KEY = 'ak_2rU2Ai02G5b04d594p8Vp6Ip5RA0s';
const ENDPOINT = 'https://longcat.chat/api/v1/chat/completions';

async function testLongCatConnection() {
  console.log('🔧 测试LongCat API连接');
  console.log('='.repeat(50));
  console.log(`端点: ${ENDPOINT}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log('='.repeat(50));

  const requestData = {
    model: 'longcat',
    messages: [
      {
        role: 'system',
        content: '你是一个专业的职场与技术AI助手，名为LongCat。你擅长解答技术问题、职场建议、编程指导等。请提供准确、有帮助、详细的回答。'
      },
      {
        role: 'user',
        content: '请介绍一下你自己'
      }
    ],
    max_tokens: 100,
    temperature: 0.7,
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestData);

    console.log('📤 发送请求...');
    console.log(`请求数据: ${JSON.stringify(requestData, null, 2)}`);

    const req = https.request(ENDPOINT, {
      method: 'POST',
      timeout: 30000, // 30秒超时
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'AI-Web-Platform/1.0',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      console.log(`\n📥 收到响应 - 状态码: ${res.statusCode}`);
      console.log(`响应头:`, res.headers);

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n📄 响应内容:`);
        console.log(data);

        try {
          const parsedData = JSON.parse(data);

          if (res.statusCode === 200) {
            console.log('\n✅ LongCat API连接成功！');
            console.log(`模型回复: ${parsedData.choices?.[0]?.message?.content || '无内容'}`);
            resolve({ success: true, data: parsedData });
          } else {
            console.log('\n❌ LongCat API连接失败');
            console.log(`错误信息: ${parsedData.error || '未知错误'}`);
            resolve({ success: false, error: parsedData, status: res.statusCode });
          }
        } catch (parseError) {
          console.log('\n❌ 响应解析失败');
          console.log(`原始响应: ${data}`);
          resolve({ success: false, error: 'Parse error', rawData: data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`\n❌ 请求失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log('\n❌ 请求超时');
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.write(postData);
    req.end();
  });
}

// Test different model configurations
async function testModelConfigurations() {
  const configs = [
    {
      model: 'longcat',
      description: '默认longcat模型'
    },
    {
      model: 'gpt-3.5-turbo',
      description: 'GPT-3.5 Turbo模型'
    },
    {
      model: 'claude-3',
      description: 'Claude 3模型'
    }
  ];

  console.log('\n🔍 测试不同模型配置');
  console.log('='.repeat(50));

  for (const config of configs) {
    console.log(`\n测试: ${config.description} (${config.model})`);

    const requestData = {
      model: config.model,
      messages: [
        {
          role: 'user',
          content: '你好，请测试连接'
        }
      ],
      max_tokens: 10
    };

    const result = await testRequest(requestData);
    console.log(`结果: ${result.success ? '✅ 成功' : '❌ 失败'}`);

    if (!result.success && result.error) {
      console.log(`错误: ${JSON.stringify(result.error).substring(0, 200)}...`);
    }
  }
}

async function testRequest(requestData) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(requestData);

    const req = https.request(ENDPOINT, {
      method: 'POST',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({
            success: res.statusCode === 200,
            data: parsedData,
            status: res.statusCode,
            error: parsedData.error
          });
        } catch {
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function main() {
  try {
    // Test main connection
    const result = await testLongCatConnection();

    if (result.success) {
      console.log('\n🎉 LongCat API配置正确，可以正常使用！');
    } else {
      console.log('\n⚠️  连接存在问题，开始详细测试...');
      await testModelConfigurations();
    }

  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

main();


