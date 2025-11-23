import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getIcpInfo } from '@/services/api';
import { IcpInfo } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiClipboardDocumentList,
  HiGlobeAlt,
  HiInformationCircle,
  HiBuildingOffice2,
  HiIdentification,
  HiDocumentText
} from 'react-icons/hi2';

const Icp: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [icpData, setIcpData] = useState<IcpInfo | null>(null);
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
    if (icpData && resultRef.current) {
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
  }, [icpData]);

  // 查询 ICP 信息
  const handleQuery = async () => {
    if (!domain.trim()) {
      setError('请输入域名或URL');
      return;
    }

    setLoading(true);
    setError(null);
    setIcpData(null);

    try {
      const data = await getIcpInfo(domain.trim());
      setIcpData(data);
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

  return (
    <div className="min-h-[calc(100vh-400px)] py-12" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div ref={headerRef} className="text-center mb-12">
          <div 
            className="inline-block p-3 rounded-2xl mb-4"
            style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
          >
            <HiClipboardDocumentList className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            ICP 备案查询
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            查询域名在中国工信部的ICP备案信息，了解网站备案状态和主办单位信息
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
                域名或URL
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
                    placeholder="例如：baidu.com 或 https://www.baidu.com"
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

            {/* 重要提示 */}
            <div 
              className="border rounded-lg p-4"
              style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}
            >
              <div className="flex gap-3">
                <HiInformationCircle 
                  className="text-lg flex-shrink-0 mt-0.5" 
                  style={{ color: '#b45309' }} 
                />
                <div className="text-xs" style={{ color: '#b45309' }}>
                  <p className="font-medium mb-1">查询范围说明</p>
                  <p>
                    此查询仅对在<strong>中国大陆工信部进行过备案的域名</strong>有效。
                    对于国外域名或未备案的域名，将查询不到结果。
                  </p>
                </div>
              </div>
            </div>

            {/* 使用提示 */}
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
                    <li>可以输入纯域名（如 baidu.com）</li>
                    <li>也可以输入完整URL（如 https://www.baidu.com）</li>
                    <li>查询结果包含备案号、主办单位名称和性质等信息</li>
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
            <LoadingSpinner message="正在查询 ICP 备案信息..." />
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
              <p className="text-xs text-gray-500 mt-2">
                可能原因：该域名未在工信部备案，或查询接口暂时无法访问
              </p>
            </div>
          </div>
        )}

        {/* 查询结果 */}
        {!loading && !error && icpData && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-apple-text">
                备案信息
              </h3>
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: icpData.serviceLicence ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: icpData.serviceLicence ? '#16a34a' : '#dc2626'
                }}
              >
                {icpData.serviceLicence ? '已备案' : '未备案'}
              </span>
            </div>

            <div ref={resultRef} className="space-y-4">
              {/* 域名 */}
              <div 
                className="rounded-xl p-5 border border-gray-100"
                style={{ backgroundColor: '#f5f5f8' }}
              >
                <div className="flex items-start gap-3">
                  <HiGlobeAlt className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1 font-medium">查询域名</p>
                    <p className="text-base font-semibold text-apple-text break-all">
                      {icpData.domain}
                    </p>
                  </div>
                </div>
              </div>

              {/* 主办单位名称 */}
              {icpData.unitName && (
                <div 
                  className="rounded-xl p-5 border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-start gap-3">
                    <HiBuildingOffice2 className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1 font-medium">主办单位名称</p>
                      <p className="text-base font-semibold text-apple-text break-all">
                        {icpData.unitName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 主办单位性质 */}
              {icpData.natureName && (
                <div 
                  className="rounded-xl p-5 border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-start gap-3">
                    <HiIdentification className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1 font-medium">主办单位性质</p>
                      <p className="text-base font-semibold text-apple-text">
                        {icpData.natureName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ICP备案号 */}
              {icpData.serviceLicence && (
                <div 
                  className="rounded-xl p-5 border"
                  style={{ backgroundColor: '#ecfdf5', borderColor: '#86efac' }}
                >
                  <div className="flex items-start gap-3">
                    <HiDocumentText className="text-xl flex-shrink-0 mt-1" style={{ color: '#16a34a' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium" style={{ color: '#16a34a' }}>
                          ICP 备案号
                        </p>
                        <button
                          onClick={() => copyToClipboard(icpData.serviceLicence!)}
                          className="text-xs font-medium transition-opacity hover:opacity-70"
                          style={{ color: '#16a34a' }}
                        >
                          复制
                        </button>
                      </div>
                      <p className="text-lg font-bold break-all" style={{ color: '#16a34a' }}>
                        {icpData.serviceLicence}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 查询状态消息 */}
              {icpData.msg && (
                <div 
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
                >
                  <p className="text-sm" style={{ color: '#15803d' }}>
                    {icpData.msg}
                  </p>
                </div>
              )}
            </div>

            {/* 底部说明 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                以上信息来源于中国工信部备案系统，仅供参考
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Icp;