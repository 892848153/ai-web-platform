import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  // 设置CORS头
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed"
      }),
      {
        status: 405,
        headers,
      }
    )
  }

  try {
    const { messages, model = "qwen-plus" } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Messages array is required"
        }),
        {
          status: 400,
          headers,
        }
      )
    }

    // 从环境变量获取API密钥
    const apiKey = Deno.env.get("VITE_QWEN_API_KEY")
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "API key not configured"
        }),
        {
          status: 500,
          headers,
        }
      )
    }

    console.log("收到聊天请求，发送到通义千问API...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

    const apiResponse = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "User-Agent": "AI-Web-Platform/1.0",
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    console.log("通义千问API响应状态:", apiResponse.status)

    // 首先获取响应文本以进行调试
    const responseText = await apiResponse.text()
    console.log("通义千问API响应长度:", responseText.length)

    if (!apiResponse.ok) {
      console.error("通义千问API错误:", apiResponse.status, responseText)
      return new Response(
        JSON.stringify({
          success: false,
          error: `通义千问 API错误: ${apiResponse.status}`,
          details: responseText.substring(0, 200),
        }),
        {
          status: apiResponse.status,
          headers,
        }
      )
    }

    // 尝试解析JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("JSON解析错误:", parseError.message)
      console.error("响应文本:", responseText.substring(0, 500))
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON response from Qwen API",
          details: "响应格式错误",
        }),
        {
          status: 500,
          headers,
        }
      )
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("无效的响应格式:", data)
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid response format from Qwen API",
          details: "响应格式不符合预期",
        }),
        {
          status: 500,
          headers,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          content: data.choices[0].message.content,
          role: data.choices[0].message.role,
        },
      }),
      {
        status: 200,
        headers,
      }
    )
  } catch (error) {
    console.error("API函数错误:", error)

    if (error.name === "AbortError") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "请求超时",
          details: "通义千问 API请求超时",
        }),
        {
          status: 504,
          headers,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "服务器内部错误",
        details: error.message,
      }),
      {
        status: 500,
        headers,
      }
    )
  }
})