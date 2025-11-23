import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { 
  HiInformationCircle,
  HiBolt,
  HiShieldCheck,
  HiChartBar,
  HiGlobeAlt,
  HiCpuChip,
  HiCommandLine,
  HiUserGroup,
  HiEnvelope,
  HiMapPin
} from 'react-icons/hi2';

const About: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const features = [
    {
      icon: HiBolt,
      title: '快速响应',
      description: '高性能服务器架构，毫秒级响应速度，确保查询效率'
    },
    {
      icon: HiShieldCheck,
      title: '安全可靠',
      description: '数据加密传输，严格的隐私保护，保障用户信息安全'
    },
    {
      icon: HiChartBar,
      title: '数据准确',
      description: '采用权威数据源，定期更新维护，确保查询结果准确'
    },
    {
      icon: HiGlobeAlt,
      title: '全面覆盖',
      description: '提供10+种网络工具，覆盖常见的网络诊断和查询需求'
    },
    {
      icon: HiCpuChip,
      title: '现代技术',
      description: '基于 React + TypeScript 构建，采用最新的前端技术栈'
    },
    {
      icon: HiCommandLine,
      title: 'API 支持',
      description: '所有功能均提供 API 接口，便于集成到您的应用中'
    }
  ];

  const techStack = [
    { name: 'React', description: '前端框架', color: '#61dafb' },
    { name: 'TypeScript', description: '类型安全', color: '#3178c6' },
    { name: 'GSAP', description: '动画库', color: '#88ce02' },
    { name: 'Tailwind CSS', description: '样式框架', color: '#06b6d4' },
    { name: 'Vite', description: '构建工具', color: '#646cff' },
    { name: 'Cloudflare Pages', description: '部署平台', color: '#f38020' }
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
            <HiInformationCircle className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-4xl font-semibold text-apple-text mb-4">
            关于平台
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            互联网基础数据公共服务平台致力于为用户提供专业、高效、安全的网络基础设施查询服务
          </p>
        </div>

        <div ref={contentRef} className="space-y-8">
          {/* 平台介绍 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-4">
              平台介绍
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                互联网基础数据公共服务平台是一个集成了多种网络工具的综合服务平台，
                为个人用户、企业开发者和网络管理员提供便捷的网络基础设施查询服务。
              </p>
              <p>
                我们的平台整合了 IP 查询、域名信息查询、网络诊断等多项功能，
                通过简洁直观的界面和高效的后端服务，帮助用户快速获取所需的网络信息，
                为网络运维、安全分析、业务决策提供数据支持。
              </p>
              <p>
                平台采用现代化的技术架构，确保服务的稳定性和可靠性。
                我们承诺保护用户隐私，所有查询数据仅用于响应用户请求，不会被用于其他用途。
              </p>
            </div>
          </div>

          {/* 核心功能 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              核心功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/ip-info" className="group">
                <div className="p-5 rounded-xl border border-gray-100 hover:border-apple-blue transition-all" style={{ backgroundColor: '#f5f5f8' }}>
                  <h3 className="font-semibold text-apple-text mb-2 group-hover:text-apple-blue transition-colors">
                    公网 IP 查询
                  </h3>
                  <p className="text-sm text-gray-600">
                    获取您的公网IP地址及详细归属信息
                  </p>
                </div>
              </Link>
              <Link to="/whois" className="group">
                <div className="p-5 rounded-xl border border-gray-100 hover:border-apple-blue transition-all" style={{ backgroundColor: '#f5f5f8' }}>
                  <h3 className="font-semibold text-apple-text mb-2 group-hover:text-apple-blue transition-colors">
                    WHOIS 查询
                  </h3>
                  <p className="text-sm text-gray-600">
                    查询域名的注册信息和详细数据
                  </p>
                </div>
              </Link>
              <Link to="/icp" className="group">
                <div className="p-5 rounded-xl border border-gray-100 hover:border-apple-blue transition-all" style={{ backgroundColor: '#f5f5f8' }}>
                  <h3 className="font-semibold text-apple-text mb-2 group-hover:text-apple-blue transition-colors">
                    ICP 备案查询
                  </h3>
                  <p className="text-sm text-gray-600">
                    查询域名在中国工信部的备案信息
                  </p>
                </div>
              </Link>
              <Link to="/dns" className="group">
                <div className="p-5 rounded-xl border border-gray-100 hover:border-apple-blue transition-all" style={{ backgroundColor: '#f5f5f8' }}>
                  <h3 className="font-semibold text-apple-text mb-2 group-hover:text-apple-blue transition-colors">
                    DNS 解析
                  </h3>
                  <p className="text-sm text-gray-600">
                    执行域名 DNS 解析，获取各类记录
                  </p>
                </div>
              </Link>
              <Link to="/ping" className="group">
                <div className="p-5 rounded-xl border border-gray-100 hover:border-apple-blue transition-all" style={{ backgroundColor: '#f5f5f8' }}>
                  <h3 className="font-semibold text-apple-text mb-2 group-hover:text-apple-blue transition-colors">
                    网络 Ping 测试
                  </h3>
                  <p className="text-sm text-gray-600">
                    测试网络连通性和延迟情况
                  </p>
                </div>
              </Link>
              <Link to="/port-scan" className="group">
                <div className="p-5 rounded-xl border border-gray-100 hover:border-apple-blue transition-all" style={{ backgroundColor: '#f5f5f8' }}>
                  <h3 className="font-semibold text-apple-text mb-2 group-hover:text-apple-blue transition-colors">
                    端口扫描
                  </h3>
                  <p className="text-sm text-gray-600">
                    检测远程主机端口开放状态
                  </p>
                </div>
              </Link>
            </div>
            <div className="mt-6 text-center">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-apple-blue hover:opacity-80 transition-opacity font-medium"
              >
                <span>查看所有功能</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 平台特点 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              平台特点
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
                  >
                    <feature.icon className="text-3xl" style={{ color: '#0071e3' }} />
                  </div>
                  <h3 className="font-semibold text-apple-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 技术栈 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              技术栈
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techStack.map((tech, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-gray-100"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div 
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: tech.color }}
                  />
                  <h3 className="font-semibold text-apple-text text-sm mb-1">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 联系我们 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              联系我们
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <HiEnvelope className="text-2xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                <div>
                  <h3 className="font-semibold text-apple-text mb-1 text-sm">
                    技术支持
                  </h3>
                  <p className="text-sm text-gray-600">
                    support@example.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HiUserGroup className="text-2xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                <div>
                  <h3 className="font-semibold text-apple-text mb-1 text-sm">
                    工作时间
                  </h3>
                  <p className="text-sm text-gray-600">
                    周一至周五 9:00-18:00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HiMapPin className="text-2xl flex-shrink-0 mt-1" style={{ color: '#0071e3' }} />
                <div>
                  <h3 className="font-semibold text-apple-text mb-1 text-sm">
                    服务范围
                  </h3>
                  <p className="text-sm text-gray-600">
                    全球用户
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 免责声明 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-2xl font-semibold text-apple-text mb-4">
              免责声明
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                1. 本平台提供的所有数据和服务仅供参考，不作为任何法律、商业决策的依据。
              </p>
              <p>
                2. 用户使用本平台的工具应遵守相关法律法规，不得用于非法用途。未经授权的端口扫描、网络探测等行为可能违反法律。
              </p>
              <p>
                3. 本平台不保证服务的持续可用性，可能因维护、升级等原因临时中断服务。
              </p>
              <p>
                4. 查询结果的准确性取决于数据源，我们会尽力确保数据的准确性，但不对数据错误承担责任。
              </p>
              <p>
                5. 用户在使用本平台时产生的任何直接或间接损失，本平台不承担责任。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;