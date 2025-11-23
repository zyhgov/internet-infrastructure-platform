import React from 'react';
import { Link } from 'react-router-dom'; // 如果没有使用 react-router，可以将 Link 换成 a 标签

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="border-t border-gray-200 mt-auto"
      style={{ backgroundColor: '#f5f5f7' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* 左侧：品牌与愿景 (占 5/12 宽度) */}
          <div className="md:col-span-5">
            <h3 className="text-sm font-bold text-[#1d1d1f] mb-4 tracking-tight">
              互联网基础数据公共服务平台
            </h3>
            <p className="text-xs text-[#86868b] leading-loose max-w-sm">
              致力于构建权威、精准、安全的互联网基础资源数据库。为企业、开发者及科研机构提供一站式的网络基础设施查询与诊断服务，助力数字经济基础设施建设与网络空间治理。
            </p>
          </div>

          {/* 中间：核心服务 (占 3/12 宽度) */}
          <div className="md:col-span-3 md:pl-8">
            <h3 className="text-xs font-semibold text-[#1d1d1f] mb-4 uppercase tracking-wider">
              核心服务
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/ip-info" className="text-xs text-[#424245] hover:text-[#0071e3] transition-colors">
                  公网 IP 身份画像
                </a>
              </li>
              <li>
                <a href="/whois" className="text-xs text-[#424245] hover:text-[#0071e3] transition-colors">
                  Whois 域名档案
                </a>
              </li>
              <li>
                <a href="/icp" className="text-xs text-[#424245] hover:text-[#0071e3] transition-colors">
                  ICP 备案合规核验
                </a>
              </li>
              <li>
                <a href="/dns" className="text-xs text-[#424245] hover:text-[#0071e3] transition-colors">
                  DNS 全球解析监测
                </a>
              </li>
            </ul>
          </div>

          {/* 右侧：支持与联系 (占 4/12 宽度) */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-[#1d1d1f] mb-4 uppercase tracking-wider">
              服务支持
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-xs text-[#424245]">
                <span className="font-medium min-w-[60px]">技术支持：</span>
                <a href="mailto:info@zyhorg.cn" className="hover:text-[#0071e3] transition-colors">
                  info@zyhorg.cn
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-[#424245]">
                <span className="font-medium min-w-[60px]">工作时间：</span>
                <span>工作日 09:00 - 18:00 (UTC+8)</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-[#424245]">
                <span className="font-medium min-w-[60px]">服务状态：</span>
                <span className="flex items-center gap-1.5 text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  所有系统运行正常
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部：版权与备案信息 */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 版权声明 */}
            <div className="text-xs text-[#86868b]">
              Copyright © {currentYear} 互联网基础数据公共服务平台. All rights reserved.
            </div>
            
            {/* 法律链接 */}
            <div className="flex items-center gap-6">
              <a href="/about" className="text-xs text-[#424245] hover:text-[#0071e3] transition-colors">
                关于平台
              </a>
              <span className="text-gray-300">|</span>
              <a href="/docs" className="text-xs text-[#424245] hover:text-[#0071e3] transition-colors">
                API文档
              </a>
              <span className="text-gray-300">|</span>
              <a href="https://wap.miit.gov.cn/" className="text-xs text-[#424245] hover:text-[#0071e3] transition-colors">
                工业和信息化部
              </a>
            </div>
          </div>

          {/* 备案号区域 - 这是显现“官方感”的关键 */}
          <div className="mt-4 text-center md:text-left">
            <p className="text-[10px] text-[#86868b] flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
              <span>由 Cloudflare 提供全面安全防护、DDoS 防御与全球 CDN 加速服务</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;