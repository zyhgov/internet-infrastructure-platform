import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { checkUrlStatus } from '@/services/api';
import { UrlCheckResult } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiCheckCircle,
  HiGlobeAlt,
  HiInformationCircle,
  HiSignal,
  HiExclamationTriangle,
  HiXCircle
} from 'react-icons/hi2';

const UrlCheck: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlData, setUrlData] = useState<UrlCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // HTTP 状态码配置
  const getStatusConfig = (status: number): { 
    color: string; 
    bgColor: string;
    borderColor: string;
    label: string; 
    icon: any;
    description: string;
  } => {
    if (status >= 200 && status < 300) {
      return {
        color: '#16a34a',
        bgColor: '#ecfdf5',
        borderColor: '#86efac',
        label: '成功',
        icon: HiCheckCircle,
        description: '请求成功，服务正常'
      };
    } else if (status >= 300 && status < 400) {
      return {
        color: '#0071e3',
        bgColor: '#eff6ff',
        borderColor: '#93c5fd',
        label: '重定向',
        icon: HiSignal,
        description: '资源已被重定向'
      };
    } else if (status >= 400 && status < 500) {
      return {
        color: '#f59e0b',
        bgColor: '#fef3c7',
        borderColor: '#fcd34d',
        label: '客户端错误',
        icon: HiExclamationTriangle,
        description: '请求有误或资源不存在'
      };
    } else if (status >= 500) {
      return {
        color: '#dc2626',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        label: '服务器错误',
        icon: HiXCircle,
        description: '服务器内部错误'
      };
    }
    return {
      color: '#6b7280',
      bgColor: '#f3f4f6',
      borderColor: '#d1d5db',
      label: '未知',
      icon: HiInformationCircle,
      description: '未知状态'
    };
  };

  // 常见状态码说明
  const commonStatusCodes = [
    { code: 200, message: 'OK - 请求成功' },
    { code: 301, message: 'Moved Permanently - 永久重定向' },
    { code: 302, message: 'Found - 临时重定向' },
    { code: 304, message: 'Not Modified - 未修改' },
    { code: 400, message: 'Bad Request - 错误请求' },
    { code: 401, message: 'Unauthorized - 未授权' },
    { code: 403, message: 'Forbidden - 禁止访问' },
    { code: 404, message: 'Not Found - 未找到' },
    { code: 500, message: 'Internal Server Error - 服务器错误' },
    { code: 502, message: 'Bad Gateway - 网关错误' },
    { code: 503, message: 'Service Unavailable - 服务不可用' },
    { code: 504, message: 'Gateway Timeout - 网关超时' },
  ];

  // 页面加载动画
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
          clearProps: 'opacity,y,transform',
        }
      );
    }
  }, []);

  // 结果显示动画
  useEffect(() => {
    if (urlData && resultRef.current) {
      gsap.fromTo(
        resultRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'opacity,y,transform',
        }
      );
    }
  }, [urlData]);

  // 检查 URL
  const handleCheck = async () => {
    if (!url.trim()) {
      setError('请输入 URL');
      return;
    }

    // 简单的 URL 验证
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('请输入完整的 URL（包含 http:// 或 https://）');
      return;
    }

    setLoading(true);
    setError(null);
    setUrlData(null);

    try {
      const data = await checkUrlStatus(url.trim());
      setUrlData(data);
    } catch (err: any) {
      const errorMsg = err.message || 'URL 检查失败，请稍后重试';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="min-h-[calc(100vh-400px)] py-12" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div ref={headerRef} className="text-center mb-12">
          <div 
            className="inline-block p-3 rounded-2xl mb-4"
            style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
          >
            <HiCheckCircle className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            URL 可访问性检查
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            检查指定URL的可访问性状态，获取HTTP状态码和响应时间
          </p>
        </div>

        {/* 检查表单 */}
        <div 
          className="rounded-2xl p-8 shadow-sm border border-gray-100 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="space-y-6">
            {/* URL 输入 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                URL 地址
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <HiGlobeAlt 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    style={{ fontSize: '20px' }}
                  />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="例如：https://cn.bing.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                    style={{ fontSize: '15px' }}
                  />
                </div>
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ backgroundColor: '#0071e3' }}
                >
                  {loading ? '检查中...' : '检查'}
                </button>
              </div>
            </div>

            {/* 提示信息 */}
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
                  <p className="font-medium mb-1">使用提示</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>必须输入完整的 URL，包含 http:// 或 https://</li>
                    <li>系统会发送 HEAD 请求，不会下载完整页面内容</li>
                    <li>返回的状态码可以判断服务是否正常运行</li>
                    <li>2xx 表示成功，3xx 表示重定向，4xx 表示客户端错误，5xx 表示服务器错误</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <LoadingSpinner message="正在检查 URL 可访问性..." />
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div 
            className="rounded-2xl p-8 shadow-sm border"
            style={{ backgroundColor: '#ffffff', borderColor: '#fecaca' }}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#dc2626' }}>
                检查失败
              </h3>
              <p className="text-sm text-gray-600">{error}</p>
              <p className="text-xs text-gray-500 mt-2">
                可能原因：URL 格式错误、目标服务器不可达、DNS 解析失败等
              </p>
            </div>
          </div>
        )}

        {/* 检查结果 */}
        {!loading && !error && urlData && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-apple-text mb-2">
                检查结果
              </h3>
              <p className="text-sm text-gray-600">
                URL 可访问性检查完成
              </p>
            </div>

            <div ref={resultRef} className="space-y-4">
              {/* URL 信息 */}
              <div 
                className="rounded-xl p-5 border border-gray-100"
                style={{ backgroundColor: '#f5f5f8' }}
              >
                <div className="flex items-start gap-3">
                  <HiGlobeAlt className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1 font-medium">检查的 URL</p>
                    <p className="text-base font-semibold text-apple-text break-all">
                      {urlData.url}
                    </p>
                  </div>
                </div>
              </div>

              {/* HTTP 状态码 */}
              <div 
                className="rounded-xl p-8 border-2"
                style={{ 
                  backgroundColor: getStatusConfig(urlData.status).bgColor,
                  borderColor: getStatusConfig(urlData.status).borderColor
                }}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {React.createElement(getStatusConfig(urlData.status).icon, { 
                      className: 'text-6xl',
                      style: { color: getStatusConfig(urlData.status).color }
                    })}
                  </div>
                  <p 
                    className="text-sm font-medium mb-2"
                    style={{ color: getStatusConfig(urlData.status).color }}
                  >
                    HTTP 状态码
                  </p>
                  <p 
                    className="text-5xl font-bold mb-3"
                    style={{ color: getStatusConfig(urlData.status).color }}
                  >
                    {urlData.status}
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span 
                      className="px-4 py-1.5 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${getStatusConfig(urlData.status).color}20`,
                        color: getStatusConfig(urlData.status).color
                      }}
                    >
                      {getStatusConfig(urlData.status).label}
                    </span>
                  </div>
                  <p 
                    className="text-sm"
                    style={{ color: getStatusConfig(urlData.status).color }}
                  >
                    {getStatusConfig(urlData.status).description}
                  </p>
                </div>
              </div>

              {/* 常见状态码说明 */}
              <div 
                className="rounded-xl p-6 border border-gray-100"
                style={{ backgroundColor: '#f5f5f8' }}
              >
                <h4 className="text-sm font-semibold text-apple-text mb-4">
                  常见 HTTP 状态码说明
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonStatusCodes.map((item) => (
                    <div 
                      key={item.code}
                      className={`rounded-lg p-3 border transition-all ${
                        urlData.status === item.code 
                          ? 'border-apple-blue' 
                          : 'border-gray-200'
                      }`}
                      style={{ 
                        backgroundColor: urlData.status === item.code 
                          ? 'rgba(0, 113, 227, 0.05)' 
                          : '#ffffff'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span 
                          className="font-mono font-bold text-sm flex-shrink-0"
                          style={{ 
                            color: urlData.status === item.code ? '#0071e3' : '#6b7280'
                          }}
                        >
                          {item.code}
                        </span>
                        <span className="text-xs text-gray-600 leading-relaxed">
                          {item.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 性能优化提示 */}
              <div 
                className="rounded-lg p-4 border"
                style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
              >
                <div className="flex gap-3">
                  <HiInformationCircle 
                    className="text-lg flex-shrink-0 mt-0.5" 
                    style={{ color: '#15803d' }} 
                  />
                  <div className="text-xs" style={{ color: '#15803d' }}>
                    <p className="font-medium mb-1">性能优化说明</p>
                    <p>
                      为了提高效率并减少对目标服务器的负载，我们使用 HEAD 请求而不是 GET 请求。
                      HEAD 请求只获取响应头信息，不会下载完整页面内容，因此速度更快。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlCheck;