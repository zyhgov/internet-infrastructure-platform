import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  HiHome,
  HiArrowLeft,
  HiMagnifyingGlass,
  HiGlobeAlt
} from 'react-icons/hi2';

const NotFound: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
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

  const quickLinks = [
    { name: '公网 IP 查询', path: '/ip-info', icon: HiGlobeAlt },
    { name: 'WHOIS 查询', path: '/whois', icon: HiMagnifyingGlass },
    { name: 'DNS 解析', path: '/dns', icon: HiGlobeAlt },
    { name: 'Ping 测试', path: '/ping', icon: HiGlobeAlt }
  ];

  return (
    <div className="min-h-[calc(100vh-400px)] py-12 flex items-center" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div 
          ref={containerRef}
          className="text-center"
        >
          {/* 404 大号显示 */}
          <div className="mb-8">
            <div 
              className="inline-block p-4 rounded-2xl mb-4"
              style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
            >
              <svg className="w-16 h-16" style={{ color: '#0071e3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-9xl font-bold mb-4" style={{ color: '#0071e3' }}>
              404
            </h1>

          </div>

          {/* 错误信息 */}
          <h2 className="text-3xl font-semibold text-apple-text mb-4">
            页面未找到
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            抱歉，您访问的页面不存在或已被移除。
            请检查 URL 是否正确，或返回首页查找您需要的功能。
          </p>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#0071e3' }}
            >
              <HiHome className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-apple-text border-2 border-gray-200 transition-all hover:border-apple-blue"
              style={{ backgroundColor: '#ffffff' }}
            >
              <HiArrowLeft className="w-5 h-5" />
              <span>返回上一页</span>
            </button>
          </div>

          {/* 快速链接 */}
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h3 className="text-lg font-semibold text-apple-text mb-6">
              您可能感兴趣的功能
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group p-4 rounded-xl border border-gray-100 hover:border-apple-blue transition-all text-left"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
                    >
                      <link.icon className="w-5 h-5" style={{ color: '#0071e3' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-apple-text group-hover:text-apple-blue transition-colors truncate">
                        {link.name}
                      </p>
                    </div>
                    <svg 
                      className="w-4 h-4 text-gray-400 group-hover:text-apple-blue group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;