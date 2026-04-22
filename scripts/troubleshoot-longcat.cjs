/**
 * LongCat API Troubleshooting Script
 * Usage: node scripts/troubleshoot-longcat.cjs
 */

const dns = require('dns');
const https = require('https');
const { promisify } = require('util');

const resolveAsync = promisify(dns.resolve);

// Configuration
const API_KEY = 'ak_2rU2Ai02G5b04d594p8Vp6Ip5RA0s';
const ENDPOINTS = [
  'https://api.longcat.ai/v1/chat/completions',
  'https://longcat-api.vercel.app/api/chat',
  'https://api.longcat.ai/chat/completions',
];

async function testDNSResolution(hostname) {
  try {
    console.log(`🔍 测试DNS解析: ${hostname}`);
    const addresses = await resolveAsync(hostname);
    console.log(`✅ DNS解析成功: ${addresses.join(', ')}`);
    return true;
  } catch (error) {
    console.log(`❌ DNS解析失败: ${error.message}`);
    return false;
  }
}

async function testHTTPEndpoint(url) {
  return new Promise((resolve) => {
    console.log(`🌐 测试HTTP连接: ${url}`);

    const startTime = Date.now();

    const req = https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'AI-Web-Platform-Troubleshooter/1.0'
      }
    }, (res) => {
      const responseTime = Date.now() - startTime;
      console.log(`✅ HTTP连接成功 - 状态码: ${res.statusCode}, 响应时间: ${responseTime}ms`);
      resolve({ success: true, status: res.statusCode, responseTime });
    });

    req.on('error', (error) => {
      console.log(`❌ HTTP连接失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`❌ HTTP连接超时`);
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });
  });
}

async function testAPIAuthentication(url) {
  return new Promise((resolve) => {
    console.log(`🔐 测试API认证: ${url}`);

    const postData = JSON.stringify({
      model: 'longcat',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 10
    });

    const req = https.request(url, {
      method: 'POST',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'AI-Web-Platform-Troubleshooter/1.0',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ API认证成功 - 状态码: ${res.statusCode}`);
          resolve({ success: true, status: res.statusCode });
        } else {
          console.log(`❌ API认证失败 - 状态码: ${res.statusCode}`);
          console.log(`📄 响应: ${data.substring(0, 200)}...`);
          resolve({ success: false, status: res.statusCode, response: data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ API请求失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`❌ API请求超时`);
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔧 LongCat API 连接问题诊断工具');
  console.log('='.repeat(50));

  console.log(`\n📋 测试配置:`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`测试端点: ${ENDPOINTS.length} 个`);

  const results = [];

  for (const endpoint of ENDPOINTS) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`测试端点: ${endpoint}`);
    console.log('='.repeat(50));

    const url = new URL(endpoint);
    const endpointResult = {
      endpoint,
      hostname: url.hostname,
      dnsSuccess: false,
      httpSuccess: false,
      apiSuccess: false,
      details: {}
    };

    // Test DNS
    endpointResult.dnsSuccess = await testDNSResolution(url.hostname);

    if (endpointResult.dnsSuccess) {
      // Test HTTP connection
      const httpResult = await testHTTPEndpoint(endpoint);
      endpointResult.httpSuccess = httpResult.success;
      endpointResult.details.http = httpResult;

      if (endpointResult.httpSuccess && url.pathname.includes('/chat/completions')) {
        // Test API authentication
        const apiResult = await testAPIAuthentication(endpoint);
        endpointResult.apiSuccess = apiResult.success;
        endpointResult.details.api = apiResult;
      }
    }

    results.push(endpointResult);
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 诊断结果汇总');
  console.log('='.repeat(50));

  const workingEndpoints = results.filter(r => r.apiSuccess);
  const httpWorking = results.filter(r => r.httpSuccess);
  const dnsWorking = results.filter(r => r.dnsSuccess);

  console.log(`✅ 完全可用的端点: ${workingEndpoints.length}/${ENDPOINTS.length}`);
  console.log(`🌐 HTTP可连接的端点: ${httpWorking.length}/${ENDPOINTS.length}`);
  console.log(`🔍 DNS可解析的端点: ${dnsWorking.length}/${ENDPOINTS.length}`);

  if (workingEndpoints.length > 0) {
    console.log(`\n🎉 找到可用的LongCat API端点:`);
    workingEndpoints.forEach(ep => {
      console.log(`   ✅ ${ep.endpoint}`);
    });
  } else if (httpWorking.length > 0) {
    console.log(`\n⚠️  HTTP连接正常但API认证失败，可能原因:`);
    console.log(`   • API密钥无效或已过期`);
    console.log(`   • 需要更新API密钥`);
    console.log(`   • API访问权限受限`);
  } else if (dnsWorking.length > 0) {
    console.log(`\n⚠️  DNS解析正常但HTTP连接失败，可能原因:`);
    console.log(`   • 服务器暂时宕机`);
    console.log(`   • 防火墙或网络限制`);
    console.log(`   • 需要更新端点地址`);
  } else {
    console.log(`\n❌ 所有端点都无法访问，可能原因:`);
    console.log(`   • LongCat服务已停止运营`);
    console.log(`   • 域名已更改或过期`);
    console.log(`   • 需要新的API端点地址`);
  }

  console.log(`\n💡 建议操作:`);
  if (workingEndpoints.length === 0) {
    console.log(`1. 联系LongCat服务提供方确认API状态`);
    console.log(`2. 检查是否有新的API端点地址`);
    console.log(`3. 验证API密钥的有效性`);
    console.log(`4. 考虑使用备用的AI服务`);
  } else {
    console.log(`1. 更新应用配置使用可用的端点`);
    console.log(`2. 测试实际API功能`);
    console.log(`3. 监控API稳定性`);
  }
}

// Run the troubleshooter
main().catch(console.error);

