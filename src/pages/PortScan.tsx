import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { scanPort } from '@/services/api';
import { PortScanResult } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  HiWifi,
  HiGlobeAlt,
  HiInformationCircle,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiShieldCheck,
  HiCommandLine
} from 'react-icons/hi2';

const PortScan: React.FC = () => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [protocol, setProtocol] = useState<'tcp' | 'udp'>('tcp');
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState<PortScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 常见端口列表
  const commonPorts = [
    { port: 21, name: 'FTP', description: '文件传输协议' },
    { port: 22, name: 'SSH', description: '安全外壳协议' },
    { port: 23, name: 'Telnet', description: '远程登录' },
    { port: 25, name: 'SMTP', description: '邮件发送' },
    { port: 53, name: 'DNS', description: '域名解析' },
    { port: 80, name: 'HTTP', description: '网页服务' },
    { port: 110, name: 'POP3', description: '邮件接收' },
    { port: 143, name: 'IMAP', description: '邮件接收' },
    { port: 443, name: 'HTTPS', description: '安全网页服务' },
    { port: 3306, name: 'MySQL', description: '数据库' },
    { port: 3389, name: 'RDP', description: '远程桌面' },
    { port: 5432, name: 'PostgreSQL', description: '数据库' },
    { port: 6379, name: 'Redis', description: '缓存数据库' },
    { port: 8080, name: 'HTTP-Alt', description: '备用HTTP端口' },
    { port: 27017, name: 'MongoDB', description: '数据库' },
  ];

  // 获取端口状态配置
  const getStatusConfig = (status: string): {
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
    icon: any;
    description: string;
  } => {
    switch (status) {
      case 'open':
        return {
          color: '#16a34a',
          bgColor: '#ecfdf5',
          borderColor: '#86efac',
          label: '开放',
          icon: HiCheckCircle,
          description: '端口开放，服务可访问'
        };
      case 'closed':
        return {
          color: '#dc2626',
          bgColor: '#fef2f2',
          borderColor: '#fca5a5',
          label: '关闭',
          icon: HiXCircle,
          description: '端口关闭，无服务监听'
        };
      case 'timeout':
        return {
          color: '#f59e0b',
          bgColor: '#fef3c7',
          borderColor: '#fcd34d',
          label: '超时',
          icon: HiClock,
          description: '连接超时，可能被防火墙拦截'
        };
      default:
        return {
          color: '#6b7280',
          bgColor: '#f3f4f6',
          borderColor: '#d1d5db',
          label: '未知',
          icon: HiInformationCircle,
          description: '未知状态'
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
    if (scanData && resultRef.current) {
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
  }, [scanData]);

  // 执行端口扫描
  const handleScan = async () => {
    if (!host.trim()) {
      setError('请输入主机地址');
      return;
    }

    if (!port.trim()) {
      setError('请输入端口号');
      return;
    }

    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setError('端口号必须在 1-65535 之间');
      return;
    }

    setLoading(true);
    setError(null);
    setScanData(null);

    try {
      const data = await scanPort(host.trim(), portNum, protocol);
      setScanData(data);
    } catch (err: any) {
      const errorMsg = err.message || '端口扫描失败，请稍后重试';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  // 快速选择端口
  const selectPort = (portNum: number) => {
    setPort(portNum.toString());
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
            <HiWifi className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            端口扫描
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            扫描远程主机的指定端口，检测端口开放状态和服务信息
          </p>
        </div>

        {/* 扫描表单 */}
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
              <div className="relative">
                <HiGlobeAlt 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ fontSize: '20px' }}
                />
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="例如：cn.bing.com 或 1.2.3.4"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                  style={{ fontSize: '15px' }}
                />
              </div>
            </div>

            {/* 端口输入 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                端口号 (1-65535)
              </label>
              <div className="relative">
                <HiCommandLine 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ fontSize: '20px' }}
                />
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="例如：80, 443, 22"
                  min="1"
                  max="65535"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                  style={{ fontSize: '15px' }}
                />
              </div>
            </div>

            {/* 协议选择 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                扫描协议
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setProtocol('tcp')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    protocol === 'tcp'
                      ? 'border-apple-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: protocol === 'tcp' ? 'rgba(0, 113, 227, 0.05)' : '#ffffff'
                  }}
                >
                  <div className="text-left">
                    <h4 className="font-semibold text-apple-text mb-1">
                      TCP
                    </h4>
                    <p className="text-xs text-gray-600">
                      传输控制协议，最常用
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setProtocol('udp')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    protocol === 'udp'
                      ? 'border-apple-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: protocol === 'udp' ? 'rgba(0, 113, 227, 0.05)' : '#ffffff'
                  }}
                >
                  <div className="text-left">
                    <h4 className="font-semibold text-apple-text mb-1">
                      UDP
                    </h4>
                    <p className="text-xs text-gray-600">
                      用户数据报协议
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 常见端口快速选择 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                常见端口快速选择
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {commonPorts.map((item) => (
                  <button
                    key={item.port}
                    onClick={() => selectPort(item.port)}
                    className={`p-3 rounded-lg border transition-all hover:border-apple-blue ${
                      port === item.port.toString()
                        ? 'border-apple-blue bg-opacity-10'
                        : 'border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: port === item.port.toString() 
                        ? 'rgba(0, 113, 227, 0.05)' 
                        : '#f5f5f8'
                    }}
                  >
                    <p className="font-mono font-bold text-sm text-apple-text">
                      {item.port}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 扫描按钮 */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleScan}
                disabled={loading}
                className="px-12 py-4 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: '#0071e3' }}
              >
                <HiShieldCheck className="w-5 h-5" />
                <span>{loading ? '扫描中...' : '开始扫描'}</span>
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
                    <li>请勿扫描未经授权的主机，仅用于合法的网络诊断</li>
                    <li>TCP 是最常用的协议，适用于大多数网络服务</li>
                    <li>端口状态：开放（有服务）、关闭（无服务）、超时（被防火墙拦截）</li>
                    <li>某些防火墙会丢弃扫描请求，导致超时</li>
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
            <LoadingSpinner message="正在扫描端口，请稍候..." />
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
                扫描失败
              </h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* 扫描结果 */}
        {!loading && !error && scanData && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-apple-text mb-2">
                扫描结果
              </h3>
              <p className="text-sm text-gray-600">
                端口扫描完成
              </p>
            </div>

            <div ref={resultRef} className="space-y-4">
              {/* 目标信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="rounded-xl p-5 border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-start gap-3">
                    <HiGlobeAlt className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-medium">目标 IP</p>
                      <p className="text-base font-semibold text-apple-text break-all">
                        {scanData.ip}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className="rounded-xl p-5 border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-start gap-3">
                    <HiCommandLine className="text-xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-medium">扫描配置</p>
                      <p className="text-base font-semibold text-apple-text">
                        端口 {scanData.port} ({scanData.protocol.toUpperCase()})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 端口状态 */}
              <div 
                className="rounded-xl p-8 border-2"
                style={{ 
                  backgroundColor: getStatusConfig(scanData.port_status).bgColor,
                  borderColor: getStatusConfig(scanData.port_status).borderColor
                }}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {React.createElement(getStatusConfig(scanData.port_status).icon, { 
                      className: 'text-6xl',
                      style: { color: getStatusConfig(scanData.port_status).color }
                    })}
                  </div>
                  <p 
                    className="text-sm font-medium mb-2"
                    style={{ color: getStatusConfig(scanData.port_status).color }}
                  >
                    端口状态
                  </p>
                  <p 
                    className="text-5xl font-bold mb-3 uppercase"
                    style={{ color: getStatusConfig(scanData.port_status).color }}
                  >
                    {getStatusConfig(scanData.port_status).label}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: getStatusConfig(scanData.port_status).color }}
                  >
                    {getStatusConfig(scanData.port_status).description}
                  </p>
                </div>
              </div>

              {/* 常见端口说明 */}
              <div 
                className="rounded-xl p-6 border border-gray-100"
                style={{ backgroundColor: '#f5f5f8' }}
              >
                <h4 className="text-sm font-semibold text-apple-text mb-4">
                  常见端口及服务说明
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonPorts.map((item) => (
                    <div 
                      key={item.port}
                      className={`rounded-lg p-3 border transition-all ${
                        scanData.port === item.port
                          ? 'border-apple-blue'
                          : 'border-gray-200'
                      }`}
                      style={{ 
                        backgroundColor: scanData.port === item.port
                          ? 'rgba(0, 113, 227, 0.05)' 
                          : '#ffffff'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span 
                          className="font-mono font-bold text-sm flex-shrink-0 min-w-12"
                          style={{ 
                            color: scanData.port === item.port ? '#0071e3' : '#6b7280'
                          }}
                        >
                          {item.port}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs text-apple-text mb-0.5">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 安全提示 */}
              <div 
                className="rounded-lg p-4 border"
                style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}
              >
                <div className="flex gap-3">
                  <HiShieldCheck 
                    className="text-lg flex-shrink-0 mt-0.5" 
                    style={{ color: '#b45309' }} 
                  />
                  <div className="text-xs" style={{ color: '#b45309' }}>
                    <p className="font-medium mb-1">安全提示</p>
                    <p>
                      端口扫描应仅用于合法的网络诊断和安全审计。
                      未经授权扫描他人网络可能违反法律法规。
                      建议关闭不必要的开放端口，以提高系统安全性。
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

export default PortScan;