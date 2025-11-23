import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { pingMyIp } from '@/services/api';
import { PingResult } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiArrowPath,
  HiInformationCircle,
  HiMapPin,
  HiArrowTrendingDown,
  HiArrowTrendingUp,
  HiChartBar,
  HiGlobeAlt,
  HiShieldCheck
} from 'react-icons/hi2';

const ClientPing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pingData, setPingData] = useState<PingResult | null>(null);
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
    if (pingData && resultRef.current) {
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
  }, [pingData]);

  // 执行客户端 Ping
  const handlePing = async () => {
    setLoading(true);
    setError(null);
    setPingData(null);

    try {
      const data = await pingMyIp();
      console.log('Ping 响应数据:', data); // 添加调试日志
      setPingData(data);
    } catch (err: any) {
      console.error('Ping 错误:', err); // 添加调试日志
      const errorMsg = err.message || 'Ping 测试失败，请稍后重试';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 获取延迟等级
  const getLatencyLevel = (ms: number): { color: string; label: string } => {
    if (ms < 50) return { color: '#16a34a', label: '优秀' };
    if (ms < 100) return { color: '#84cc16', label: '良好' };
    if (ms < 200) return { color: '#eab308', label: '一般' };
    if (ms < 500) return { color: '#f97316', label: '较慢' };
    return { color: '#dc2626', label: '很慢' };
  };

  // 安全地获取数值，添加默认值
  const safeMin = pingData?.min ?? 0;
  const safeMax = pingData?.max ?? 0;
  const safeAvg = pingData?.avg ?? 0;

  return (
    <div className="min-h-[calc(100vh-400px)] py-12" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div ref={headerRef} className="text-center mb-12">
          <div 
            className="inline-block p-3 rounded-2xl mb-4"
            style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
          >
            <HiArrowPath className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            客户端 Ping 测试
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            从服务器 Ping 您的客户端 IP，测试双向网络连通性
          </p>
        </div>

        {/* 测试面板 */}
        <div 
          className="rounded-2xl p-8 shadow-sm border border-gray-100 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="space-y-6">
            {/* 功能说明 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
                >
                  <HiGlobeAlt className="text-2xl" style={{ color: '#0071e3' }} />
                </div>
                <HiArrowPath className="text-2xl text-gray-400" />
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
                >
                  <HiShieldCheck className="text-2xl" style={{ color: '#0071e3' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-apple-text mb-2">
                自动检测网络质量
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                点击下方按钮，系统将自动获取您的公网 IP 并从服务器向您的网络发起 Ping 测试，
                用于检测双向网络连通性和延迟。
              </p>
            </div>

            {/* 开始测试按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handlePing}
                disabled={loading}
                className="px-12 py-4 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: '#0071e3' }}
              >
                <HiArrowPath className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? '测试中...' : '开始测试'}</span>
              </button>
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
                    <li>此功能无需输入任何信息，自动检测您的公网 IP</li>
                    <li>从服务器向您的 IP 发送 PING 请求，测试回程连通性</li>
                    <li>如果您的路由器或防火墙禁用了 ICMP，测试可能失败</li>
                    <li>测试结果显示最小、最大、平均延迟等网络质量指标</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 警告提示 */}
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
                  <p className="font-medium mb-1">可能遇到的问题</p>
                  <p>
                    如果测试失败，很可能是因为您的路由器或防火墙禁止了外部 ICMP Ping 请求。
                    这是出于安全考虑的正常配置，不影响您的正常网络使用。
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
            <LoadingSpinner message="正在从服务器 Ping 您的客户端 IP..." />
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
                测试失败
              </h3>
              <p className="text-sm text-gray-600 mb-3">{error}</p>
              <div 
                className="inline-block rounded-lg p-4 text-left max-w-md"
                style={{ backgroundColor: '#fef2f2' }}
              >
                <p className="text-xs text-gray-600 mb-2">
                  <strong>可能的原因：</strong>
                </p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>您的路由器或防火墙禁用了 ICMP 协议</li>
                  <li>网络环境不允许外部 Ping 请求</li>
                  <li>无法获取您的公网 IP 地址</li>
                  <li>客户端 IP 不可达</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 测试结果 */}
        {!loading && !error && pingData && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-apple-text mb-2">
                测试结果
              </h3>
              <p className="text-sm text-gray-600">
                从服务器到您的客户端网络连通性测试成功
              </p>
            </div>

            <div ref={resultRef} className="space-y-4">
              {/* 客户端信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="rounded-xl p-5 border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-start gap-3">
                    <HiGlobeAlt className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-2 font-medium">您的公网 IP</p>
                      <p className="text-lg font-bold text-apple-text mb-1">
                        {pingData.ip || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600">
                        主机: {pingData.host || pingData.ip || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {pingData.location && (
                  <div 
                    className="rounded-xl p-5 border border-gray-100"
                    style={{ backgroundColor: '#f5f5f8' }}
                  >
                    <div className="flex items-start gap-3">
                      <HiMapPin className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 font-medium">地理位置</p>
                        <p className="text-base font-semibold text-apple-text">
                          {pingData.location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 延迟统计 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 最小延迟 */}
                <div 
                  className="rounded-xl p-5 border"
                  style={{ 
                    backgroundColor: '#ecfdf5',
                    borderColor: '#86efac'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <HiArrowTrendingDown className="text-xl flex-shrink-0 mt-1" style={{ color: '#16a34a' }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1" style={{ color: '#16a34a' }}>
                        最小延迟
                      </p>
                      <p className="text-2xl font-bold" style={{ color: '#16a34a' }}>
                        {safeMin.toFixed(2)}
                        <span className="text-sm font-normal ml-1">ms</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 平均延迟 */}
                <div 
                  className="rounded-xl p-5 border"
                  style={{ 
                    backgroundColor: `${getLatencyLevel(safeAvg).color}15`,
                    borderColor: `${getLatencyLevel(safeAvg).color}50`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <HiChartBar className="text-xl flex-shrink-0 mt-1" style={{ color: getLatencyLevel(safeAvg).color }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1" style={{ color: getLatencyLevel(safeAvg).color }}>
                        平均延迟
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold" style={{ color: getLatencyLevel(safeAvg).color }}>
                          {safeAvg.toFixed(2)}
                          <span className="text-sm font-normal ml-1">ms</span>
                        </p>
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `${getLatencyLevel(safeAvg).color}30`,
                            color: getLatencyLevel(safeAvg).color
                          }}
                        >
                          {getLatencyLevel(safeAvg).label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 最大延迟 */}
                <div 
                  className="rounded-xl p-5 border"
                  style={{ 
                    backgroundColor: '#fef2f2',
                    borderColor: '#fca5a5'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <HiArrowTrendingUp className="text-xl flex-shrink-0 mt-1" style={{ color: '#dc2626' }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1" style={{ color: '#dc2626' }}>
                        最大延迟
                      </p>
                      <p className="text-2xl font-bold" style={{ color: '#dc2626' }}>
                        {safeMax.toFixed(2)}
                        <span className="text-sm font-normal ml-1">ms</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 延迟可视化 - 只有在有有效数据时才显示 */}
              {safeMax > 0 && (
                <div 
                  className="rounded-xl p-5 border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <p className="text-xs text-gray-500 mb-3 font-medium">延迟范围</p>
                  <div className="relative h-12 bg-white rounded-lg overflow-hidden">
                    {/* 背景渐变 */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to right, #16a34a 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #dc2626 100%)'
                      }}
                    />
                    {/* 数值标记 */}
                    <div className="absolute inset-0 flex items-center px-4">
                      <div className="flex-1 relative">
                        {/* 最小值标记 */}
                        <div 
                          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${(safeMin / safeMax) * 100}%` }}
                        >
                          <div className="w-3 h-3 bg-white border-2 border-green-600 rounded-full shadow-lg" />
                        </div>
                        {/* 平均值标记 */}
                        <div 
                          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${(safeAvg / safeMax) * 100}%` }}
                        >
                          <div className="w-4 h-4 bg-white border-2 rounded-full shadow-lg" style={{ borderColor: getLatencyLevel(safeAvg).color }} />
                        </div>
                        {/* 最大值标记 */}
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                          <div className="w-3 h-3 bg-white border-2 border-red-600 rounded-full shadow-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>0 ms</span>
                    <span>{safeMax.toFixed(2)} ms</span>
                  </div>
                </div>
              )}

              {/* 延迟等级说明 */}
              <div 
                className="rounded-lg p-4 border"
                style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
              >
                <p className="text-xs font-medium mb-2" style={{ color: '#15803d' }}>
                  延迟等级说明
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#16a34a' }} />
                    <span className="text-gray-700">&lt;50ms 优秀</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#84cc16' }} />
                    <span className="text-gray-700">50-100ms 良好</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }} />
                    <span className="text-gray-700">100-200ms 一般</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }} />
                    <span className="text-gray-700">200-500ms 较慢</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }} />
                    <span className="text-gray-700">&gt;500ms 很慢</span>
                  </div>
                </div>
              </div>

              {/* 测试说明 */}
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
                    <p className="font-medium mb-1">测试说明</p>
                    <p>
                      此测试从我们的服务器向您的公网 IP 发送 ICMP Ping 请求。
                      测试结果反映了从服务器到您网络的连通性和延迟情况，可用于诊断网络质量问题。
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

export default ClientPing;