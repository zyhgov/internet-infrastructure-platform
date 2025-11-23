import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { checkWechatDomain } from '@/services/api';
import { WechatDomainResult } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiChatBubbleLeftRight,
  HiGlobeAlt,
  HiInformationCircle,
  HiCheckCircle,
  HiExclamationTriangle,
  HiXCircle,
  HiShieldCheck
} from 'react-icons/hi2';

const WechatCheck: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [wechatData, setWechatData] = useState<WechatDomainResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 获取状态配置
  const getStatusConfig = (type: string, title: string): {
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
    icon: any;
    isSafe: boolean;
  } => {
    // 根据 title 或 type 判断状态
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('正常') || titleLower.includes('可以访问') || type === '1') {
      return {
        color: '#16a34a',
        bgColor: '#ecfdf5',
        borderColor: '#86efac',
        label: '正常访问',
        icon: HiCheckCircle,
        isSafe: true
      };
    } else if (titleLower.includes('警告') || titleLower.includes('风险')) {
      return {
        color: '#f59e0b',
        bgColor: '#fef3c7',
        borderColor: '#fcd34d',
        label: '存在风险',
        icon: HiExclamationTriangle,
        isSafe: false
      };
    } else if (titleLower.includes('封禁') || titleLower.includes('拦截') || titleLower.includes('已停止访问')) {
      return {
        color: '#dc2626',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        label: '已被封禁',
        icon: HiXCircle,
        isSafe: false
      };
    } else {
      // 默认为警告状态
      return {
        color: '#6b7280',
        bgColor: '#f3f4f6',
        borderColor: '#d1d5db',
        label: '状态未知',
        icon: HiInformationCircle,
        isSafe: false
      };
    }
  };

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
    if (wechatData && resultRef.current) {
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
  }, [wechatData]);

  // 检查域名
  const handleCheck = async () => {
    if (!domain.trim()) {
      setError('请输入域名');
      return;
    }

    setLoading(true);
    setError(null);
    setWechatData(null);

    try {
      const data = await checkWechatDomain(domain.trim());
      setWechatData(data);
    } catch (err: any) {
      const errorMsg = err.message || '检查失败，请稍后重试';
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
            <HiChatBubbleLeftRight className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            微信访问检测
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            检查域名在微信中的访问状态，判断是否被拦截或限制
          </p>
        </div>

        {/* 检查表单 */}
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
                    placeholder="例如：qq.com"
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

            {/* 功能说明 */}
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
                  <p className="font-medium mb-1">功能说明</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>检查域名在微信内置浏览器中是否可以正常访问</li>
                    <li>适用于微信生态推广前的域名检测</li>
                    <li>如果域名被封禁，在微信中分享将无法打开</li>
                    <li>建议定期检查，避免影响推广效果</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 微信图标展示 */}
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#07c160' }}
                >
                  <HiChatBubbleLeftRight className="text-3xl text-white" />
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border-2"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <HiGlobeAlt className="text-3xl text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                检测域名在微信中的可访问性
              </p>
            </div>
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <LoadingSpinner message="正在检查域名在微信中的状态..." />
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
                可能原因：域名格式错误、上游服务暂时不可用
              </p>
            </div>
          </div>
        )}

        {/* 检查结果 */}
        {!loading && !error && wechatData && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-apple-text mb-2">
                检测结果
              </h3>
              <p className="text-sm text-gray-600">
                域名在微信中的访问状态检测完成
              </p>
            </div>

            <div ref={resultRef} className="space-y-4">
              {/* 域名信息 */}
              <div 
                className="rounded-xl p-5 border border-gray-100"
                style={{ backgroundColor: '#f5f5f8' }}
              >
                <div className="flex items-start gap-3">
                  <HiGlobeAlt className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 font-medium">检测的域名</p>
                    <p className="text-base font-semibold text-apple-text break-all">
                      {wechatData.domain}
                    </p>
                  </div>
                </div>
              </div>

              {/* 访问状态 */}
              <div 
                className="rounded-xl p-8 border-2"
                style={{ 
                  backgroundColor: getStatusConfig(wechatData.type, wechatData.title).bgColor,
                  borderColor: getStatusConfig(wechatData.type, wechatData.title).borderColor
                }}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {React.createElement(getStatusConfig(wechatData.type, wechatData.title).icon, { 
                      className: 'text-6xl',
                      style: { color: getStatusConfig(wechatData.type, wechatData.title).color }
                    })}
                  </div>
                  <p 
                    className="text-sm font-medium mb-2"
                    style={{ color: getStatusConfig(wechatData.type, wechatData.title).color }}
                  >
                    访问状态
                  </p>
                  <p 
                    className="text-3xl font-bold mb-3"
                    style={{ color: getStatusConfig(wechatData.type, wechatData.title).color }}
                  >
                    {getStatusConfig(wechatData.type, wechatData.title).label}
                  </p>
                  <p 
                    className="text-base mb-4"
                    style={{ color: getStatusConfig(wechatData.type, wechatData.title).color }}
                  >
                    {wechatData.title}
                  </p>
                  <div className="flex justify-center">
                    <span 
                      className="px-4 py-1.5 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${getStatusConfig(wechatData.type, wechatData.title).color}20`,
                        color: getStatusConfig(wechatData.type, wechatData.title).color
                      }}
                    >
                      状态码: {wechatData.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* 建议信息 */}
              {getStatusConfig(wechatData.type, wechatData.title).isSafe ? (
                <div 
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
                >
                  <div className="flex gap-3">
                    <HiShieldCheck 
                      className="text-lg flex-shrink-0 mt-0.5" 
                      style={{ color: '#15803d' }} 
                    />
                    <div className="text-xs" style={{ color: '#15803d' }}>
                      <p className="font-medium mb-1">✅ 状态良好</p>
                      <p>
                        该域名在微信中可以正常访问，您可以放心在微信生态中推广使用。
                        建议定期检查域名状态，确保推广效果不受影响。
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5' }}
                >
                  <div className="flex gap-3">
                    <HiExclamationTriangle 
                      className="text-lg flex-shrink-0 mt-0.5" 
                      style={{ color: '#b91c1c' }} 
                    />
                    <div className="text-xs" style={{ color: '#b91c1c' }}>
                      <p className="font-medium mb-1">⚠️ 存在问题</p>
                      <div className="space-y-1">
                        <p>该域名在微信中可能无法正常访问。建议采取以下措施：</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>检查网站内容是否符合微信平台规范</li>
                          <li>如被误判，可通过微信官方渠道申诉</li>
                          <li>考虑更换域名或使用其他推广方式</li>
                          <li>避免违规内容和诱导分享行为</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 使用建议 */}
              <div 
                className="rounded-lg p-4 border"
                style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}
              >
                <div className="flex gap-3">
                  <HiInformationCircle 
                    className="text-lg flex-shrink-0 mt-0.5" 
                    style={{ color: '#1e40af' }} 
                  />
                  <div className="text-xs" style={{ color: '#1e40af' }}>
                    <p className="font-medium mb-1">使用建议</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>在微信推广前务必检查域名状态</li>
                      <li>遵守微信平台的内容规范和推广政策</li>
                      <li>避免诱导分享、虚假宣传等违规行为</li>
                      <li>定期监测域名状态，及时发现和处理问题</li>
                      <li>准备备用域名，降低推广风险</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 微信生态说明 */}
              <div 
                className="rounded-xl p-6 border border-gray-100"
                style={{ backgroundColor: '#f5f5f8' }}
              >
                <h4 className="text-sm font-semibold text-apple-text mb-3 flex items-center gap-2">
                  <HiChatBubbleLeftRight style={{ color: '#07c160' }} />
                  <span>关于微信域名检测</span>
                </h4>
                <div className="text-xs text-gray-600 space-y-2">
                  <p>
                    微信会对在其平台内分享的域名进行安全检测，对于存在安全风险、违规内容或诱导分享的域名，
                    可能会进行拦截或限制访问。
                  </p>
                  <p>
                    <strong>常见被封原因：</strong>恶意网站、诱导分享、虚假信息、侵权内容、
                    违规营销等。如需申诉，请访问微信安全中心官方网站。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WechatCheck;