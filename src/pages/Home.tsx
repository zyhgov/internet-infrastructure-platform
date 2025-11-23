import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import FunctionCard from '@/components/FunctionCard';
import { FunctionItem } from '@/types';
import { 
  HiGlobeAlt, 
  HiMagnifyingGlass, 
  HiClipboardDocumentList,
  HiSignal,
  HiServerStack,
  HiMapPin,
  HiCheckCircle,
  HiArrowPath,
  HiWifi,
  HiChatBubbleLeftRight,
  HiBolt,
  HiShieldCheck,
  HiChartBar
} from 'react-icons/hi2';
import { apiClient } from '@/services/api';

// 服务状态类型
type ServiceStatus = 'checking' | 'online' | 'degraded' | 'offline';

interface StatusConfig {
  text: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  // ✅ 服务状态管理
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>('checking');
  const [responseTime, setResponseTime] = useState<number>(0);

  // 状态配置映射
  const statusConfigs: Record<ServiceStatus, StatusConfig> = {
    checking: {
      text: '服务检测中',
      bgColor: '#fef3c7',
      textColor: '#f59e0b',
      icon: '🔄'
    },
    online: {
      text: '服务正常',
      bgColor: '#d1fae5',
      textColor: '#10b981',
      icon: '✓'
    },
    degraded: {
      text: '服务中断',
      bgColor: '#fed7aa',
      textColor: '#f97316',
      icon: '⚠'
    },
    offline: {
      text: '服务不可用',
      bgColor: '#fecaca',
      textColor: '#ef4444',
      icon: '✕'
    }
  };

  // ✅ 健康检查函数
  const checkServiceHealth = async () => {
    setServiceStatus('checking');
    const startTime = performance.now();

    try {
      const response = await apiClient.get('/network/myip', {
        timeout: 5000, // 5秒超时
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setResponseTime(duration);

      // 根据响应时间和状态判断服务质量
      if (response.status === 200) {
        if (duration < 2000) {
          setServiceStatus('online'); // 响应时间 < 2秒，正常
        } else {
          setServiceStatus('degraded'); // 响应时间 >= 2秒，降级
        }
      } else {
        setServiceStatus('degraded');
      }
    } catch (error: any) {
      console.error('服务健康检查失败:', error);
      
      // 判断错误类型
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setServiceStatus('degraded'); // 超时
      } else {
        setServiceStatus('offline'); // 完全不可用
      }
      setResponseTime(0);
    }
  };

  // ✅ 页面加载时检查服务状态
  useEffect(() => {
    checkServiceHealth();

    // 每 30 秒自动重新检测
    const intervalId = setInterval(() => {
      checkServiceHealth();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // 功能列表
  const functions: FunctionItem[] = [
    {
      id: 'ip-info',
      title: '公网 IP 身份画像',
      description: '实时获取客户端公网身份指纹，包含精准地理位置、ISP运营商及网络层级信息',
      icon: <HiGlobeAlt />,
      path: '/ip-info',
      category: 'network'
    },
    {
      id: 'whois',
      title: '域名 WHOIS 档案',
      description: '检索全球域名注册数据库，获取注册商、持有人、注册时间及状态生命周期数据',
      icon: <HiMagnifyingGlass />,
      path: '/whois',
      category: 'domain'
    },
    {
      id: 'icp',
      title: 'ICP 备案合规查询',
      description: '对接工信部备案数据，核验网站主体身份、备案号及合规性状态',
      icon: <HiClipboardDocumentList />,
      path: '/icp',
      category: 'domain'
    },
    {
      id: 'ping',
      title: '全网连通性探测',
      description: '基于多节点执行 ICMP 探测，分析目标主机的网络可达性、丢包率及响应延迟',
      icon: <HiSignal />,
      path: '/ping',
      category: 'network'
    },
    {
      id: 'dns',
      title: 'DNS 权威解析',
      description: '深度挖掘域名系统记录，支持 A、CNAME、MX、TXT 等多类型记录的实时验证',
      icon: <HiServerStack />,
      path: '/dns',
      category: 'network'
    },
    {
      id: 'ip-location',
      title: 'IP 归属地定位',
      description: '查询任意 IPv4/IPv6 地址的物理地理位置与网络拓扑归属信息',
      icon: <HiMapPin />,
      path: '/ip-location',
      category: 'network'
    },
    {
      id: 'url-check',
      title: '服务可用性监测',
      description: '检测 Web 服务 HTTP/HTTPS 状态码、响应耗时及 SSL 证书有效性',
      icon: <HiCheckCircle />,
      path: '/url-check',
      category: 'network'
    },
    {
      id: 'client-ping',
      title: '双向链路诊断',
      description: '服务端发起反向 Ping 检测，测试客户端与服务器之间的双向网络质量',
      icon: <HiArrowPath />,
      path: '/client-ping',
      category: 'network'
    },
    {
      id: 'port-scan',
      title: '端口服务扫描',
      description: '非侵入式扫描远程主机端口开放状态，识别运行服务与潜在安全风险',
      icon: <HiWifi />,
      path: '/port-scan',
      category: 'security'
    },
    {
      id: 'wechat-check',
      title: '微信域名拦截检测',
      description: '实时检测域名在微信生态内的访问状态，判断是否被红名拦截或限制访问',
      icon: <HiChatBubbleLeftRight />,
      path: '/wechat-check',
      category: 'security'
    }
  ];

  useEffect(() => {
    // Hero 区域动画
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'opacity,y,transform',
        }
      );
    }

    // 卡片动画
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.2,
          clearProps: 'opacity,y,transform',
        }
      );
    }
  }, []);

  // 获取当前状态配置
  const currentStatus = statusConfigs[serviceStatus];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Hero 区域 */}
      <div className="relative overflow-hidden pt-10 pb-16">
        <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* ✅ 服务状态徽章 - 动态显示 */}
            <span 
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-md text-xs font-bold tracking-wide mb-6 transition-all duration-300 cursor-help"
            style={{ 
                backgroundColor: currentStatus.bgColor,
                color: currentStatus.textColor
            }}
            title={`API 端点: api.unhub.dpdns.org\n上次检测: ${new Date().toLocaleTimeString()}\n响应时间: ${responseTime}ms`}
            >
            {/* 状态图标 */}
            <span 
              className={`text-sm ${serviceStatus === 'checking' ? 'animate-spin' : ''}`}
            >
              {currentStatus.icon}
            </span>
            
            {/* 状态文本 */}
            <span>工业和信息化部数据源 · {currentStatus.text}</span>
            
            {/* 响应时间（仅在正常或降级时显示） */}
            {(serviceStatus === 'online' || serviceStatus === 'degraded') && responseTime > 0 && (
              <span className="opacity-75">· {responseTime}ms</span>
            )}
            
            {/* 手动刷新按钮 */}
            <button
              onClick={checkServiceHealth}
              disabled={serviceStatus === 'checking'}
              className="ml-1 hover:opacity-70 transition-opacity disabled:opacity-50"
              title="刷新状态"
            >
              <HiArrowPath className={`w-3 h-3 ${serviceStatus === 'checking' ? 'animate-spin' : ''}`} />
            </button>
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 tracking-wider">
            互联网基础数据<br className="hidden md:block" />公共服务平台
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-normal">
            实时提供权威、实时、精准的网络诊断与信息查询。<br/>
            助力企业与开发者构建可信赖的数字基础设施。
          </p>
        </div>
      </div>

      {/* 功能卡片网格 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20 relative z-20">
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {functions.map((item) => (
            <FunctionCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* 特色说明 - 底部区域 */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-[#1d1d1f]">平台核心优势</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* 优势 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 bg-[#f5f5f7] text-[#0071e3] transition-colors duration-300">
                <HiBolt className="text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-3">毫秒级极速响应</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                基于分布式边缘节点架构，优化路由算法，<br/>确保每一次查询都在毫秒级完成。
              </p>
            </div>

            {/* 优势 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 bg-[#f5f5f7] text-[#0071e3] transition-colors duration-300">
                <HiShieldCheck className="text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-3">金融级安全合规</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                全程采用 TLS 加密传输，严格遵守数据合规要求，<br/>保护用户隐私与查询日志安全。
              </p>
            </div>

            {/* 优势 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 bg-[#f5f5f7] text-[#0071e3] transition-colors duration-300">
                <HiChartBar className="text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-3">多源数据交叉校核</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                聚合全球 RIRs、运营商及权威机构数据，<br/>通过多源比对确保结果精准无误。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;