import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { pingHost } from '@/services/api';
import { PingResult } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiSignal,
  HiGlobeAlt,
  HiInformationCircle,
  HiMapPin,
  HiArrowTrendingDown,
  HiArrowTrendingUp,
  HiChartBar
} from 'react-icons/hi2';

const Ping: React.FC = () => {
  const [host, setHost] = useState('');
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

  // 执行 Ping 测试
  const handlePing = async () => {
    if (!host.trim()) {
      setError('请输入目标主机');
      return;
    }

    setLoading(true);
    setError(null);
    setPingData(null);

    try {
      const data = await pingHost(host.trim());
      setPingData(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Ping 测试失败，请稍后重试';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePing();
    }
  };

  // 获取延迟等级（用于颜色显示）
  const getLatencyLevel = (ms: number): { color: string; label: string } => {
    if (ms < 50) return { color: '#16a34a', label: '优秀' };
    if (ms < 100) return { color: '#84cc16', label: '良好' };
    if (ms < 200) return { color: '#eab308', label: '一般' };
    if (ms < 500) return { color: '#f97316', label: '较慢' };
    return { color: '#dc2626', label: '很慢' };
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
            <HiSignal className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            Ping 测试
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            从服务器向指定主机发送 Ping 请求，测试网络连通性和延迟
          </p>
        </div>

        {/* 测试表单 */}
        <div 
          className="rounded-2xl p-8 shadow-sm border border-gray-100 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="space-y-6">
            {/* 主机输入 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                目标主机
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <HiGlobeAlt 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    style={{ fontSize: '20px' }}
                  />
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="例如：cn.bing.com 或 8.8.8.8"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                    style={{ fontSize: '15px' }}
                  />
                </div>
                <button
                  onClick={handlePing}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ backgroundColor: '#0071e3' }}
                >
                  {loading ? '测试中...' : '开始测试'}
                </button>
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
                    <li>可以输入域名（如 cn.bing.com）或 IP 地址（如 8.8.8.8）</li>
                    <li>测试将从服务器向目标主机发送 ICMP Ping 请求</li>
                    <li>返回最小、最大、平均延迟等网络质量指标</li>
                    <li>部分主机可能禁用 ICMP，导致测试失败</li>
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
            <LoadingSpinner message="正在执行 Ping 测试，请稍候..." />
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
              <p className="text-sm text-gray-600">{error}</p>
              <p className="text-xs text-gray-500 mt-2">
                可能原因：目标主机不可达、防火墙拦截、或禁用了 ICMP 协议
              </p>
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
                网络连通性测试成功
              </p>
            </div>

            <div ref={resultRef} className="space-y-4">
              {/* 目标主机 */}
              <div 
                className="rounded-xl p-5 border border-gray-100"
                style={{ backgroundColor: '#f5f5f8' }}
              >
                <div className="flex items-start gap-3">
                  <HiGlobeAlt className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2 font-medium">目标主机</p>
                    <p className="text-base font-semibold text-apple-text mb-1">
                      {pingData.host}
                    </p>
                    <p className="text-sm text-gray-600">
                      IP: {pingData.ip}
                    </p>
                  </div>
                </div>
              </div>

              {/* 地理位置 */}
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
                        {pingData.min.toFixed(2)}
                        <span className="text-sm font-normal ml-1">ms</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 平均延迟 */}
                <div 
                  className="rounded-xl p-5 border"
                  style={{ 
                    backgroundColor: `${getLatencyLevel(pingData.avg).color}15`,
                    borderColor: `${getLatencyLevel(pingData.avg).color}50`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <HiChartBar className="text-xl flex-shrink-0 mt-1" style={{ color: getLatencyLevel(pingData.avg).color }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1" style={{ color: getLatencyLevel(pingData.avg).color }}>
                        平均延迟
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold" style={{ color: getLatencyLevel(pingData.avg).color }}>
                          {pingData.avg.toFixed(2)}
                          <span className="text-sm font-normal ml-1">ms</span>
                        </p>
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `${getLatencyLevel(pingData.avg).color}30`,
                            color: getLatencyLevel(pingData.avg).color
                          }}
                        >
                          {getLatencyLevel(pingData.avg).label}
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
                        {pingData.max.toFixed(2)}
                        <span className="text-sm font-normal ml-1">ms</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 延迟可视化 */}
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
                        style={{ left: `${(pingData.min / pingData.max) * 100}%` }}
                      >
                        <div className="w-3 h-3 bg-white border-2 border-green-600 rounded-full shadow-lg" />
                      </div>
                      {/* 平均值标记 */}
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                        style={{ left: `${(pingData.avg / pingData.max) * 100}%` }}
                      >
                        <div className="w-4 h-4 bg-white border-2 rounded-full shadow-lg" style={{ borderColor: getLatencyLevel(pingData.avg).color }} />
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
                  <span>{pingData.max.toFixed(2)} ms</span>
                </div>
              </div>

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ping;