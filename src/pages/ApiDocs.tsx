import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { 
  HiCommandLine,
  HiInformationCircle,
  HiCodeBracket,
  HiClipboardDocument,
  HiCheckCircle
} from 'react-icons/hi2';

const ApiDocs: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          clearProps: 'opacity,y,transform', // ✅ 只清除动画相关属性
        }
      );
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.3,
          clearProps: 'opacity,y,transform', // ✅ 只清除动画相关属性
        }
      );
    }
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const apiEndpoints = [
    {
      name: '获取公网IP',
      method: 'GET',
      endpoint: '/api/v1/network/myip',
      description: '获取当前客户端的公网IP及归属信息',
      example: 'curl https://api.unhub.dpdns.org/api/v1/network/myip',
      params: [
        { name: 'source', type: 'string', required: false, description: '数据源，可选 commercial' }
      ]
    },
    {
      name: 'WHOIS查询',
      method: 'GET',
      endpoint: '/api/v1/network/whois',
      description: '查询域名的WHOIS注册信息',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/whois?domain=google.com&format=json"',
      params: [
        { name: 'domain', type: 'string', required: true, description: '要查询的域名' },
        { name: 'format', type: 'string', required: false, description: '返回格式：text 或 json' }
      ]
    },
    {
      name: 'ICP备案查询',
      method: 'GET',
      endpoint: '/api/v1/network/icp',
      description: '查询域名的ICP备案信息',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/icp?domain=baidu.com"',
      params: [
        { name: 'domain', type: 'string', required: true, description: '要查询的域名或URL' }
      ]
    },
    {
      name: 'Ping测试',
      method: 'GET',
      endpoint: '/api/v1/network/ping',
      description: '从服务器Ping指定主机',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/ping?host=cn.bing.com"',
      params: [
        { name: 'host', type: 'string', required: true, description: '目标主机（域名或IP）' }
      ]
    },
    {
      name: 'DNS解析',
      method: 'GET',
      endpoint: '/api/v1/network/dns',
      description: '执行DNS解析查询',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/dns?domain=cn.bing.com&type=A"',
      params: [
        { name: 'domain', type: 'string', required: true, description: '要查询的域名' },
        { name: 'type', type: 'string', required: false, description: 'DNS记录类型：A, AAAA, CNAME, MX, NS, TXT' }
      ]
    },
    {
      name: 'IP归属查询',
      method: 'GET',
      endpoint: '/api/v1/network/ipinfo',
      description: '查询指定IP或域名的归属信息',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/ipinfo?ip=8.8.8.8"',
      params: [
        { name: 'ip', type: 'string', required: true, description: 'IP地址或域名' },
        { name: 'source', type: 'string', required: false, description: '数据源，可选 commercial' }
      ]
    },
    {
      name: 'URL可访问性',
      method: 'GET',
      endpoint: '/api/v1/network/urlstatus',
      description: '检查URL的可访问性状态',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/urlstatus?url=https://cn.bing.com"',
      params: [
        { name: 'url', type: 'string', required: true, description: '完整的URL地址' }
      ]
    },
    {
      name: '客户端Ping',
      method: 'GET',
      endpoint: '/api/v1/network/pingmyip',
      description: '从服务器Ping客户端IP',
      example: 'curl https://api.unhub.dpdns.org/api/v1/network/pingmyip',
      params: []
    },
    {
      name: '端口扫描',
      method: 'GET',
      endpoint: '/api/v1/network/portscan',
      description: '扫描远程主机的指定端口',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/portscan?host=cn.bing.com&port=80&protocol=tcp"',
      params: [
        { name: 'host', type: 'string', required: true, description: '目标主机' },
        { name: 'port', type: 'integer', required: true, description: '端口号（1-65535）' },
        { name: 'protocol', type: 'string', required: false, description: '协议：tcp 或 udp' }
      ]
    },
    {
      name: '微信访问检测',
      method: 'GET',
      endpoint: '/api/v1/network/wxdomain',
      description: '检查域名在微信中的访问状态',
      example: 'curl "https://api.unhub.dpdns.org/api/v1/network/wxdomain?domain=qq.com"',
      params: [
        { name: 'domain', type: 'string', required: true, description: '要检测的域名' }
      ]
    }
  ];

  const errorCodes = [
    { code: 200, message: '请求成功', description: '操作成功完成' },
    { code: 400, message: '错误的请求', description: '请求参数无效或缺失' },
    { code: 404, message: '未找到', description: '请求的资源不存在' },
    { code: 429, message: '请求过于频繁', description: '触发限流，请稍后再试' },
    { code: 500, message: '服务器错误', description: '服务器内部错误' },
    { code: 502, message: '网关错误', description: '上游服务不可用' }
  ];

  return (
    <div className="min-h-[calc(100vh-400px)] py-12" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div ref={headerRef} className="text-center mb-16">
          <div 
            className="inline-block p-3 rounded-2xl mb-4"
            style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
          >
            <HiCommandLine className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-4xl font-semibold text-apple-text mb-4">
            API 文档
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            所有功能均提供 RESTful API 接口，方便集成到您的应用中
          </p>
        </div>

        <div ref={contentRef} className="space-y-8">
          {/* 基础信息 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              基础信息
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="p-4 rounded-xl border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <p className="text-sm text-gray-500 mb-1">API 基础地址</p>
                  <p className="font-mono text-sm font-semibold text-apple-text">
                    https://api.unhub.dpdns.org/api/v1
                  </p>
                </div>
                <div 
                  className="p-4 rounded-xl border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <p className="text-sm text-gray-500 mb-1">请求方法</p>
                  <p className="font-mono text-sm font-semibold text-apple-text">
                    GET
                  </p>
                </div>
                <div 
                  className="p-4 rounded-xl border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <p className="text-sm text-gray-500 mb-1">响应格式</p>
                  <p className="font-mono text-sm font-semibold text-apple-text">
                    application/json
                  </p>
                </div>
                <div 
                  className="p-4 rounded-xl border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <p className="text-sm text-gray-500 mb-1">字符编码</p>
                  <p className="font-mono text-sm font-semibold text-apple-text">
                    UTF-8
                  </p>
                </div>
              </div>

              <div 
                className="border rounded-lg p-4"
                style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}
              >
                <div className="flex gap-3">
                  <HiInformationCircle 
                    className="text-lg flex-shrink-0 mt-0.5" 
                    style={{ color: '#1e40af' }} 
                  />
                  <div className="text-xs" style={{ color: '#1e40af' }}>
                    <p className="font-medium mb-1">使用说明</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>所有 API 均为 GET 请求，参数通过 URL 查询字符串传递</li>
                      <li>返回数据格式为 JSON</li>
                      <li>建议在生产环境中实施请求频率限制</li>
                      <li>API 密钥和认证功能正在开发中</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API 端点列表 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              API 端点
            </h2>
            <div className="space-y-6">
              {apiEndpoints.map((api, index) => (
                <div 
                  key={index}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <div className="p-5" style={{ backgroundColor: '#f5f5f8' }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span 
                            className="px-2 py-1 rounded text-xs font-mono font-bold"
                            style={{ backgroundColor: '#0071e3', color: '#ffffff' }}
                          >
                            {api.method}
                          </span>
                          <h3 className="text-lg font-semibold text-apple-text">
                            {api.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {api.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono text-apple-text border border-gray-200">
                        {api.endpoint}
                      </code>
                    </div>
                  </div>

                  {api.params.length > 0 && (
                    <div className="p-5 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-apple-text mb-3">
                        请求参数
                      </h4>
                      <div className="space-y-2">
                        {api.params.map((param, pIndex) => (
                          <div key={pIndex} className="flex items-start gap-3 text-sm">
                            <code className="font-mono font-semibold text-apple-text min-w-24">
                              {param.name}
                            </code>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              param.required 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {param.required ? '必需' : '可选'}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {param.type}
                            </span>
                            <span className="text-gray-600 flex-1">
                              {param.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-5 border-t border-gray-100" style={{ backgroundColor: '#1d1d1f' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">
                        示例请求
                      </h4>
                      <button
                        onClick={() => copyToClipboard(api.example, index)}
                        className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <HiCheckCircle className="w-3 h-3" />
                            <span>已复制</span>
                          </>
                        ) : (
                          <>
                            <HiClipboardDocument className="w-3 h-3" />
                            <span>复制</span>
                          </>
                        )}
                      </button>
                    </div>
                    <code className="block text-sm text-gray-300 font-mono break-all">
                      {api.example}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 错误码说明 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              HTTP 状态码
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">状态码</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">说明</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">描述</th>
                  </tr>
                </thead>
                <tbody>
                  {errorCodes.map((error, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <code className="font-mono font-bold text-sm" style={{ 
                          color: error.code >= 200 && error.code < 300 ? '#16a34a' : 
                                 error.code >= 400 && error.code < 500 ? '#f59e0b' : '#dc2626'
                        }}>
                          {error.code}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-apple-text">
                        {error.message}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {error.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 使用限制 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              使用限制
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                为了保证服务质量和公平使用，我们对 API 调用实施以下限制：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>每个 IP 地址每分钟最多 60 次请求</li>
                <li>部分资源密集型接口可能有额外限制</li>
                <li>超过限制将返回 429 状态码</li>
                <li>建议实现请求缓存和错误重试机制</li>
              </ul>
              <div 
                className="mt-4 border rounded-lg p-4"
                style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}
              >
                <div className="flex gap-3">
                  <HiInformationCircle 
                    className="text-lg flex-shrink-0 mt-0.5" 
                    style={{ color: '#b45309' }} 
                  />
                  <div className="text-xs" style={{ color: '#b45309' }}>
                    <p className="font-medium mb-1">注意事项</p>
                    <p>
                      如需更高的请求限制或企业级支持，请联系我们获取 API 密钥。
                      所有 API 调用应遵守相关法律法规，不得用于非法用途。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;