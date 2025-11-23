import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getDnsRecords } from '@/services/api';
import { DnsResponse, DnsRecordType } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiServerStack,
  HiGlobeAlt,
  HiInformationCircle,
  HiClipboardDocument,
  HiComputerDesktop,
  HiLink,
  HiEnvelope,
  HiServer,
  HiDocumentText
} from 'react-icons/hi2';

const Dns: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState<DnsRecordType>('A');
  const [loading, setLoading] = useState(false);
  const [dnsData, setDnsData] = useState<DnsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // DNS 记录类型配置
  const recordTypes: { value: DnsRecordType; label: string; description: string; icon: any; color: string }[] = [
    { value: 'A', label: 'A 记录', description: 'IPv4 地址', icon: HiComputerDesktop, color: '#0071e3' },
    { value: 'AAAA', label: 'AAAA 记录', description: 'IPv6 地址', icon: HiComputerDesktop, color: '#5856d6' },
    { value: 'CNAME', label: 'CNAME 记录', description: '别名记录', icon: HiLink, color: '#34c759' },
    { value: 'MX', label: 'MX 记录', description: '邮件服务器', icon: HiEnvelope, color: '#ff9500' },
    { value: 'NS', label: 'NS 记录', description: '域名服务器', icon: HiServer, color: '#af52de' },
    { value: 'TXT', label: 'TXT 记录', description: '文本记录', icon: HiDocumentText, color: '#ff3b30' },
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
    if (dnsData && resultRef.current) {
      gsap.fromTo(
        resultRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'opacity,y,transform',
        }
      );
    }
  }, [dnsData]);

  // 执行 DNS 查询
  const handleQuery = async () => {
    if (!domain.trim()) {
      setError('请输入域名');
      return;
    }

    setLoading(true);
    setError(null);
    setDnsData(null);

    try {
      const data = await getDnsRecords(domain.trim(), recordType);
      setDnsData(data);
    } catch (err: any) {
      const errorMsg = err.message || 'DNS 查询失败，请稍后重试';
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

  // 获取当前记录类型配置
  const getCurrentRecordConfig = () => {
    return recordTypes.find(rt => rt.value === recordType) || recordTypes[0];
  };

  // 格式化记录值
  const formatRecordValue = (record: any): string => {
    // 移除 type 字段，显示其他所有字段
    const { type, ...values } = record;
    return Object.values(values).filter(v => v !== undefined && v !== '').join(' ');
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
            <HiServerStack className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            DNS 解析查询
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            执行域名DNS解析查询，获取A记录、MX记录、CNAME等DNS信息
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
                    placeholder="例如：cn.bing.com"
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

            {/* 记录类型选择 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                DNS 记录类型
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {recordTypes.map((rt) => {
                  const Icon = rt.icon;
                  return (
                    <button
                      key={rt.value}
                      onClick={() => setRecordType(rt.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        recordType === rt.value
                          ? 'border-current'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: recordType === rt.value ? `${rt.color}15` : '#ffffff',
                        borderColor: recordType === rt.value ? rt.color : undefined
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon 
                          className="text-xl flex-shrink-0 mt-0.5"
                          style={{ color: rt.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-apple-text mb-0.5">
                            {rt.label}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {rt.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
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
                  <p className="font-medium mb-1">记录类型说明</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>A 记录</strong>：将域名指向一个 IPv4 地址</li>
                    <li><strong>AAAA 记录</strong>：将域名指向一个 IPv6 地址</li>
                    <li><strong>CNAME 记录</strong>：将域名指向另一个域名（别名）</li>
                    <li><strong>MX 记录</strong>：指定邮件服务器及优先级</li>
                    <li><strong>NS 记录</strong>：指定域名服务器</li>
                    <li><strong>TXT 记录</strong>：存储文本信息（如 SPF、DKIM 等）</li>
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
            <LoadingSpinner message="正在执行 DNS 解析查询..." />
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
                可能原因：域名不存在、无此类型记录、或 DNS 服务器无响应
              </p>
            </div>
          </div>
        )}

        {/* 查询结果 */}
        {!loading && !error && dnsData && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-apple-text">
                  DNS 记录
                </h3>
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1"
                  style={{ 
                    backgroundColor: `${getCurrentRecordConfig().color}15`,
                    color: getCurrentRecordConfig().color
                  }}
                >
                  {React.createElement(getCurrentRecordConfig().icon, { className: 'w-3 h-3' })}
                  <span>{getCurrentRecordConfig().label}</span>
                </span>
              </div>
              {dnsData.records.length > 0 && (
                <span className="text-sm text-gray-600">
                  找到 {dnsData.records.length} 条记录
                </span>
              )}
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
                    <p className="text-xs text-gray-500 mb-1 font-medium">查询域名</p>
                    <p className="text-base font-semibold text-apple-text break-all">
                      {dnsData.domain}
                    </p>
                  </div>
                </div>
              </div>

              {/* DNS 记录列表 */}
              {dnsData.records.length > 0 ? (
                dnsData.records.map((record, index) => (
                  <div 
                    key={index}
                    className="rounded-xl p-5 border"
                    style={{ 
                      backgroundColor: `${getCurrentRecordConfig().color}08`,
                      borderColor: `${getCurrentRecordConfig().color}30`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {React.createElement(getCurrentRecordConfig().icon, { 
                        className: 'text-xl flex-shrink-0 mt-1',
                        style: { color: getCurrentRecordConfig().color }
                      })}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p 
                            className="text-xs font-medium"
                            style={{ color: getCurrentRecordConfig().color }}
                          >
                            记录 #{index + 1}
                          </p>
                          <button
                            onClick={() => copyToClipboard(formatRecordValue(record))}
                            className="text-xs font-medium transition-opacity hover:opacity-70 flex items-center gap-1"
                            style={{ color: getCurrentRecordConfig().color }}
                          >
                            <HiClipboardDocument className="w-3 h-3" />
                            <span>复制</span>
                          </button>
                        </div>
                        <p className="text-base font-semibold text-apple-text break-all">
                          {formatRecordValue(record)}
                        </p>
                        {/* 显示所有字段 */}
                        <div className="mt-3 space-y-1">
                          {Object.entries(record).map(([key, value]) => {
                            if (key === 'type' || !value) return null;
                            return (
                              <div key={key} className="flex gap-2 text-xs">
                                <span className="text-gray-500 font-medium min-w-20">{key}:</span>
                                <span className="text-gray-700 break-all">{value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="rounded-xl p-8 border border-gray-200 text-center"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    未找到 {getCurrentRecordConfig().label}
                  </p>
                  <p className="text-xs text-gray-500">
                    该域名可能没有配置此类型的 DNS 记录
                  </p>
                </div>
              )}

              {/* 错误信息显示 */}
              {dnsData.error && (
                <div 
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}
                >
                  <p className="text-sm" style={{ color: '#b45309' }}>
                    {dnsData.error}
                  </p>
                </div>
              )}
            </div>

            {/* 底部说明 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                DNS 记录信息可能存在缓存延迟，实际生效时间取决于 TTL 设置
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dns;