import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFeaturesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/about', label: '关于平台' },
    { path: '/docs', label: 'API 文档' },
  ];

  const features = [
    { path: '/ip-info', label: '公网 IP 查询', icon: '🌐' },
    { path: '/whois', label: 'WHOIS 查询', icon: '🔍' },
    { path: '/icp', label: 'ICP 备案查询', icon: '📋' },
    { path: '/ping', label: 'Ping 测试', icon: '📡' },
    { path: '/dns', label: 'DNS 解析', icon: '🗂️' },
    { path: '/ip-location', label: 'IP 归属查询', icon: '📍' },
    { path: '/url-check', label: 'URL 可访问性', icon: '✅' },
    { path: '/client-ping', label: '客户端 Ping', icon: '🔄' },
    { path: '/port-scan', label: '端口扫描', icon: '🔌' },
    { path: '/wechat-check', label: '微信访问检测', icon: '💬' },
  ];

  return (
    <header 
      className="sticky top-0 z-50 border-b border-gray-200"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo 和标题区域 */}
        <div className="flex items-center justify-between py-4 lg:py-6 border-b border-gray-100">
          {/* Logo区域 - 响应式 */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2 lg:gap-4">
              <img 
                src="/images/national-emblem.png" 
                alt="国徽" 
                className="h-10 lg:h-14 object-contain"
              />
              <img 
                src="/images/工业和信息化部标识.png" 
                alt="工业和信息化部" 
                className="h-10 lg:h-14 object-contain"
              />
            </div>
            
            {/* 标题文字 - 桌面端显示完整，移动端简化 */}
            <div className="border-l border-gray-200 pl-4 lg:pl-8">
              <Link to="/" className="block">
                <h1 className="text-sm lg:text-xl font-semibold text-apple-text leading-tight hover:text-apple-blue transition-colors">
                  <span className="hidden sm:inline">互联网基础数据公共服务平台</span>
                  <span className="sm:hidden">互联网基础数据公共服务平台 <br /> <span className="text-[10px] leading-[1.3] text-gray-500">Internet Infrastructure Data Public Service Platform</span> </span>
                </h1>
                <p className="text-xs lg:text-xs text-gray-500 mt-0.5 lg:mt-1 hidden sm:block">
                  Internet Infrastructure Data Public Service Platform
                </p>
              </Link>
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6 text-apple-text" />
            ) : (
              <HiMenu className="w-6 h-6 text-apple-text" />
            )}
          </button>
        </div>

        {/* 桌面端导航栏 */}
        <nav className="hidden lg:flex justify-center items-center space-x-8 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-apple-blue'
                  : 'text-apple-text hover:text-apple-blue'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* 功能列表下拉菜单 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
              className="flex items-center gap-1 text-sm font-medium text-apple-text hover:text-apple-blue transition-colors"
            >
              <span>功能列表</span>
              <HiChevronDown className={`w-4 h-4 transition-transform ${featuresDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* 下拉菜单内容 */}
            {featuresDropdownOpen && (
              <div 
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-96 rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="p-2 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-1">
                    {features.map((feature) => (
                      <Link
                        key={feature.path}
                        to={feature.path}
                        onClick={() => setFeaturesDropdownOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${
                          isActive(feature.path)
                            ? 'bg-apple-blue bg-opacity-10 text-apple-blue'
                            : 'hover:bg-gray-50 text-apple-text'
                        }`}
                      >
                        <span className="text-lg">{feature.icon}</span>
                        <span className="font-medium truncate">{feature.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-apple-blue bg-opacity-10 text-apple-blue'
                      : 'text-apple-text hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* 移动端功能列表 */}
              <div className="pt-2 border-t border-gray-100">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500">功能列表</p>
                {features.map((feature) => (
                  <Link
                    key={feature.path}
                    to={feature.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(feature.path)
                        ? 'bg-apple-blue bg-opacity-10 text-apple-blue'
                        : 'text-apple-text hover:bg-gray-50'
                    }`}
                  >
                    <span>{feature.icon}</span>
                    <span>{feature.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;