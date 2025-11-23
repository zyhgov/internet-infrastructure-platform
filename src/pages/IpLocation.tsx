import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getIpLocation } from '@/services/api';
import { IpInfoResponse } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import InfoCard from '@/components/InfoCard';
import { 
  HiMapPin,
  HiBolt, 
  HiChartBar,
  HiClipboardDocument,
  HiGlobeAlt,
  HiServerStack,
  HiHashtag,
  HiBuildingOffice,
  HiBuildingLibrary,
  HiComputerDesktop,
  HiPhone,
  HiEnvelope,
  HiClock,
  HiInformationCircle,
  HiCloudArrowUp,
  HiSun
} from 'react-icons/hi2';

const IpLocation: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipData, setIpData] = useState<IpInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queryType, setQueryType] = useState<'standard' | 'commercial'>('standard');

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
    if (ipData && resultRef.current) {
      gsap.fromTo(
        resultRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'opacity,y,transform',
        }
      );
    }
  }, [ipData]);

  // 查询IP信息
  const handleQuery = async (useCommercial: boolean) => {
    if (!ipAddress.trim()) {
      setError('请输入IP地址或域名');
      return;
    }

    setLoading(true);
    setError(null);
    setIpData(null);
    setQueryType(useCommercial ? 'commercial' : 'standard');

    try {
      const data = await getIpLocation(ipAddress.trim(), useCommercial);
      setIpData(data);
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
      handleQuery(false);
    }
  };

  // 判断是否为商业查询结果
  const isCommercialData = (data: IpInfoResponse): boolean => {
    return 'district' in data || 'area_code' in data;
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
            <HiMapPin className="text-4xl" style={{ color: '#0071e3' }} />
          </div>
          <h1 className="text-3xl font-semibold text-apple-text mb-3">
            IP 归属查询
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            查询指定IP地址或域名的地理位置和运营商归属信息
          </p>
        </div>

        {/* 查询表单 */}
        <div 
          className="rounded-2xl p-8 shadow-sm border border-gray-100 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="space-y-6">
            {/* IP/域名输入 */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-3">
                IP 地址或域名
              </label>
              <div className="relative mb-4">
                <HiGlobeAlt 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ fontSize: '20px' }}
                />
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="例如：8.8.8.8 或 cn.bing.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                  style={{ fontSize: '15px' }}
                />
              </div>

              {/* 查询按钮 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 标准查询 */}
                <button
                  onClick={() => handleQuery(false)}
                  disabled={loading}
                  className="group relative rounded-xl p-6 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-apple-blue"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-start gap-4">
                    <HiBolt className="text-3xl flex-shrink-0" style={{ color: '#0071e3' }} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-apple-text mb-1">
                        标准查询
                      </h4>
                      <p className="text-xs text-gray-600">
                        使用 GeoIP 数据库，响应速度快
                      </p>
                    </div>
                  </div>
                </button>

                {/* 商业查询 */}
                <button
                  onClick={() => handleQuery(true)}
                  disabled={loading}
                  className="group relative rounded-xl p-6 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-apple-blue"
                  style={{ backgroundColor: '#f5f5f8' }}
                >
                  <div className="flex items-start gap-4">
                    <HiChartBar className="text-3xl flex-shrink-0" style={{ color: '#0071e3' }} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-apple-text mb-1">
                        商业查询
                      </h4>
                      <p className="text-xs text-gray-600">
                        更详细的地理位置信息，包括区县、时区等
                      </p>
                    </div>
                  </div>
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
                    <li>支持 IPv4 和 IPv6 地址查询</li>
                    <li>支持输入域名，系统会自动解析为 IP 地址</li>
                    <li>商业查询提供更精确的市、区、运营商、时区、海拔等信息</li>
                    <li>内网 IP（如 192.168.x.x）无法查询归属信息</li>
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
            <LoadingSpinner message="正在查询IP归属信息..." />
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
                可能原因：IP地址无效、内网IP、或数据库中无此IP信息
              </p>
            </div>
          </div>
        )}

        {/* 查询结果 */}
        {!loading && !error && ipData && (
          <div 
            className="rounded-2xl p-8 shadow-sm border border-gray-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-apple-text">
                  归属信息
                </h3>
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }}
                >
                  {queryType === 'commercial' ? '商业数据源' : '标准数据源'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(ipData.ip)}
                className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: '#0071e3' }}
              >
                <HiClipboardDocument className="w-4 h-4" />
                <span>复制IP</span>
              </button>
            </div>

            <div ref={resultRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 基础信息 */}
              <InfoCard label="IP 地址" value={ipData.ip} icon={<HiGlobeAlt className="text-xl" style={{ color: '#0071e3' }} />} />
              <InfoCard label="地理位置" value={ipData.region} icon={<HiMapPin className="text-xl" style={{ color: '#0071e3' }} />} />
              
              {/* 标准查询特有字段 */}
              {!isCommercialData(ipData) && (
                <>
                  <InfoCard label="IP 范围起始" value={ipData.beginip} icon={<HiHashtag className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="IP 范围结束" value={ipData.endip} icon={<HiHashtag className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="ASN" value={ipData.asn} icon={<HiServerStack className="text-xl" style={{ color: '#0071e3' }} />} />
                </>
              )}
              
              {/* 公共字段 */}
              <InfoCard label="运营商 (ISP)" value={ipData.isp} icon={<HiBuildingOffice className="text-xl" style={{ color: '#0071e3' }} />} />
              <InfoCard label="归属" value={ipData.llc} icon={<HiBuildingLibrary className="text-xl" style={{ color: '#0071e3' }} />} />
              
              {/* 经纬度 */}
              {ipData.latitude && ipData.longitude && (
                <>
                  <InfoCard 
                    label="纬度" 
                    value={ipData.latitude.toFixed(6)} 
                    icon={<HiComputerDesktop className="text-xl" style={{ color: '#0071e3' }} />} 
                  />
                  <InfoCard 
                    label="经度" 
                    value={ipData.longitude.toFixed(6)} 
                    icon={<HiComputerDesktop className="text-xl" style={{ color: '#0071e3' }} />} 
                  />
                </>
              )}

              {/* 商业查询特有字段 */}
              {isCommercialData(ipData) && (
                <>
                  <InfoCard label="行政区" value={(ipData as any).district} icon={<HiMapPin className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="行政区划代码" value={(ipData as any).area_code} icon={<HiHashtag className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="城市区号" value={(ipData as any).city_code} icon={<HiPhone className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="邮政编码" value={(ipData as any).zip_code} icon={<HiEnvelope className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="时区" value={(ipData as any).time_zone} icon={<HiClock className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="应用场景" value={(ipData as any).scenes} icon={<HiChartBar className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="海拔 (米)" value={(ipData as any).elevation} icon={<HiCloudArrowUp className="text-xl" style={{ color: '#0071e3' }} />} />
                  <InfoCard label="气象站代码" value={(ipData as any).weather_station} icon={<HiSun className="text-xl" style={{ color: '#0071e3' }} />} />
                </>
              )}
            </div>

            {/* 地图提示 */}
            {ipData.latitude && ipData.longitude && (
              <div className="mt-6 pt-6 border-t border-gray-100">
<a
  href={`https://uri.amap.com/marker?position=${ipData.longitude},${ipData.latitude}&name=IP位置`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
  style={{ color: '#0071e3' }}
>
  <HiMapPin className="w-4 h-4" />
  <span>在高德地图上查看位置</span>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IpLocation;