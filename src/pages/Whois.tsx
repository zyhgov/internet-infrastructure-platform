import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getWhoisInfo } from '@/services/api';
import { WhoisResponse } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiMagnifyingGlass,
  HiClipboardDocument,
  HiGlobeAlt,
  HiInformationCircle
} from 'react-icons/hi2';

const Whois: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [format, setFormat] = useState<'text' | 'json'>('json');
  const [loading, setLoading] = useState(false);
  const [whoisData, setWhoisData] = useState<WhoisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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
    if (whoisData && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'opacity,y,transform',
        }
      );
    }
  }, [whoisData]);

  // 查询 WHOIS 信息
  const handleQuery = async () => {
    if (!domain.trim()) {
      setError('请输入域名');
      return;
    }

    setLoading(true);
    setError(null);
    setWhoisData(null);

    try {
      const data = await getWhoisInfo(domain.trim(), format);
      console.log('WHOIS 查询结果:', data); // 调试日志
      setWhoisData(data);
    } catch (err: any) {
      const errorMsg = err.message || '查询失败，请稍后重试';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  // 判断是否为 JSON 格式
  const isJsonFormat = (data: WhoisResponse): boolean => {
    return typeof data.whois === 'object' && !Array.isArray(data.whois);
  };

  // ✅ 格式化值的辅助函数
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '无数据';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      // 如果是对象，格式化为 JSON 字符串
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // ✅ 渲染嵌套对象的组件
  const renderNestedObject = (obj: any, depth: number = 0): React.ReactNode => {
    if (obj === null || obj === undefined) {
      return <span className="text-gray-400 text-sm">无数据</span>;
    }

    if (Array.isArray(obj)) {
      return (
        <div className="space-y-1">
          {obj.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-sm text-apple-text break-all">{String(item)}</span>
            </div>
          ))}
        </div>
      );
    }

    if (typeof obj === 'object') {
      return (
        <div className={`space-y-2 ${depth > 0 ? 'ml-4 pl-4 border-l-2 border-gray-200' : ''}`}>
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-medium text-gray-500">{key}</p>
              {typeof value === 'object' ? (
                renderNestedObject(value, depth + 1)
              ) : (
                <p className="text-sm text-apple-text break-all">{String(value)}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-sm text-apple-text break-all">{String(obj)}</span>;
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
            <HiMagnifyingGlass className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            WHOIS 查询
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            查询域名的注册信息，包括注册商、注册时间、到期时间等详细数据
          </p>
        </div>

        {/* 查询表单 */}
        <div 
          className="rounded-2xl p-8 shadow-sm border border-gray-100 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="space-y-6">
            {/* 域名输入 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                域名
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <HiGlobeAlt 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    style={{ fontSize: '20px' }}
                  />
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="例如：google.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                    style={{ fontSize: '15px' }}
                  />
                </div>
                <button
                  onClick={handleQuery}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ backgroundColor: '#0071e3' }}
                >
                  {loading ? '查询中...' : '查询'}
                </button>
              </div>
            </div>

            {/* 格式选择 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                返回格式
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormat('json')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    format === 'json'
                      ? 'border-apple-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: format === 'json' ? 'rgba(0, 113, 227, 0.05)' : '#ffffff'
                  }}
                >
                  <div className="text-left">
                    <h4 className="font-semibold text-apple-text mb-1">
                      JSON 格式
                    </h4>
                    <p className="text-xs text-gray-600">
                      结构化数据，易于阅读和处理
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setFormat('text')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    format === 'text'
                      ? 'border-apple-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: format === 'text' ? 'rgba(0, 113, 227, 0.05)' : '#ffffff'
                  }}
                >
                  <div className="text-left">
                    <h4 className="font-semibold text-apple-text mb-1">
                      原始文本
                    </h4>
                    <p className="text-xs text-gray-600">
                      完整的原始 WHOIS 信息
                    </p>
                  </div>
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
                  <p>
                    输入要查询的域名（如 google.com），选择返回格式后点击查询。
                    JSON 格式会将 WHOIS 信息解析为结构化数据，原始文本则返回完整的 WHOIS 记录。
                  </p>
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
            <LoadingSpinner message="正在查询 WHOIS 信息..." />
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
                查询失败
              </h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* 查询结果 */}
        {!loading && !error && whoisData && (
          <div 
            ref={resultRef}
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-apple-text">
                  查询结果
                </h3>
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }}
                >
                  {format === 'json' ? 'JSON 格式' : '原始文本'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(
                  typeof whoisData.whois === 'string' 
                    ? whoisData.whois 
                    : JSON.stringify(whoisData.whois, null, 2)
                )}
                className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: '#0071e3' }}
              >
                <HiClipboardDocument className="w-4 h-4" />
                <span>复制结果</span>
              </button>
            </div>

            {/* ✅ JSON 格式显示 - 使用嵌套渲染 */}
            {isJsonFormat(whoisData) && (
              <div className="space-y-3">
                {Object.entries((whoisData as any).whois).map(([key, value]) => (
                  <div 
                    key={key}
                    className="rounded-xl p-5 border border-gray-100"
                    style={{ backgroundColor: '#f5f5f8' }}
                  >
                    <p className="text-sm font-semibold text-apple-text mb-3 capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      {renderNestedObject(value)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 原始文本显示 */}
            {!isJsonFormat(whoisData) && (
              <div 
                className="rounded-xl p-6 border border-gray-100 overflow-auto"
                style={{ backgroundColor: '#f5f5f8', maxHeight: '600px' }}
              >
                <pre className="text-xs text-apple-text whitespace-pre-wrap break-all font-mono">
                  {(whoisData as any).whois}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Whois;