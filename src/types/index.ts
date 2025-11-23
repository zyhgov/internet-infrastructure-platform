import { ReactNode } from 'react';

// 功能卡片类型
export interface FunctionItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;  // 改为 ReactNode 以支持组件
  path: string;
  category: 'network' | 'domain' | 'security';
}

// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// IP 信息类型（标准查询）
export interface IpInfo {
  code: number;
  ip: string;
  beginip?: string;
  endip?: string;
  region: string;
  isp?: string;
  asn?: string;
  llc?: string;
  latitude?: number;
  longitude?: number;
}

// IP 信息类型（商业查询）
export interface IpInfoCommercial extends IpInfo {
  district?: string;
  area_code?: string;
  city_code?: string;
  zip_code?: string;
  time_zone?: string;
  scenes?: string;
  elevation?: string;
  weather_station?: string;
}

// 统一的IP信息类型
export type IpInfoResponse = IpInfo | IpInfoCommercial;

// WHOIS 信息类型
export interface WhoisInfo {
  domain: string;
  registrar?: string;
  registrationDate?: string;
  expirationDate?: string;
  status?: string[];
  nameServers?: string[];
  [key: string]: any;
}

// ICP 备案信息类型
export interface IcpInfo {
  domain: string;
  companyName?: string;
  icpNumber?: string;
  type?: string;
  [key: string]: any;
}

// DNS 解析类型
export interface DnsRecord {
  type: string;
  value: string;
  ttl?: number;
}

// Ping 结果类型
export interface PingResult {
  host: string;
  alive: boolean;
  time?: number;
  ttl?: number;
}

// 端口扫描结果
export interface PortScanResult {
  host: string;
  port: number;
  open: boolean;
  service?: string;
}

// URL 检查结果
export interface UrlCheckResult {
  url: string;
  accessible: boolean;
  statusCode?: number;
  responseTime?: number;
}

// 错误响应类型
export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}

// WHOIS 信息类型（原始文本格式）
export interface WhoisTextResponse {
  whois: string; // 原始 WHOIS 文本
}

// WHOIS 信息类型（JSON 格式）
export interface WhoisJsonResponse {
  whois: {
    [key: string]: string | string[];
  };
}

// WHOIS 查询响应（统一类型）
export type WhoisResponse = WhoisTextResponse | WhoisJsonResponse;

// ICP 备案信息类型
export interface IcpInfo {
  code: string;
  domain: string;
  msg: string;
  natureName?: string;      // 主办单位性质（企业/个人）
  serviceLicence?: string;  // ICP备案号
  unitName?: string;        // 主办单位名称
}

// Ping 结果类型
export interface PingResult {
  code: number;
  host: string;
  ip: string;
  location?: string;
  min: number;     // 最小延迟(ms)
  max: number;     // 最大延迟(ms)
  avg: number;     // 平均延迟(ms)
}

// DNS 记录类型
export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT';

// DNS 记录
export interface DnsRecord {
  type: string;
  [key: string]: any; // 不同类型的记录有不同的字段
}

// DNS 查询响应
export interface DnsResponse {
  code: number;
  domain: string;
  error?: string;
  records: DnsRecord[];
}

// URL 状态检查结果
export interface UrlCheckResult {
  code: number;
  url: string;
  status: number; // HTTP 状态码
}

// 端口扫描结果
export interface PortScanResult {
  code: number;
  ip: string;
  port: number;
  port_status: 'open' | 'closed' | 'timeout';
  protocol: 'tcp' | 'udp';
}

// 微信域名检测结果
export interface WechatDomainResult {
  domain: string;
  title: string;    // 状态标题
  type: string;     // 状态类型
}