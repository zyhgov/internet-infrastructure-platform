import axios, { AxiosInstance } from 'axios';

// ✅ API 基础配置 - 使用你的代理域名
const API_BASE_URL = import.meta.env.DEV
  ? '/api'  // 开发环境：使用 Vite 代理
  : 'https://api.unhub.dpdns.org';  // 生产环境：使用 Cloudflare Worker 代理

console.log('[API] 环境:', import.meta.env.DEV ? '开发' : '生产');
console.log('[API] Base URL:', API_BASE_URL);

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response || error);
    return Promise.reject(error);
  }
);

// 统一的错误处理函数
const handleApiError = (error: any, context: string): never => {
  console.error(`[${context}] Error:`, error);
  
  if (error.response) {
    const errorData = error.response.data;
    throw {
      code: errorData?.code || 'API_ERROR',
      message: errorData?.message || `${context}失败`,
      details: errorData?.details,
      status: error.response.status,
    };
  } else if (error.request) {
    throw {
      code: 'NETWORK_ERROR',
      message: '网络请求失败，请检查网络连接',
    };
  } else {
    throw {
      code: 'UNKNOWN_ERROR',
      message: error.message || '未知错误',
    };
  }
};


// ==================== IP 相关 API ====================

/**
 * 获取当前客户端的公网IP及归属信息
 * @param useCommercial 是否使用商业数据源
 * @returns IP信息对象
 */
export const getMyIp = async (useCommercial: boolean = false): Promise<any> => {
  try {
    const params = useCommercial ? { source: 'commercial' } : {};
    const response = await apiClient.get('/network/myip', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, '获取公网IP');
  }
};

/**
 * 查询指定IP或域名的归属信息
 * @param ip IP地址或域名
 * @param useCommercial 是否使用商业数据源
 * @returns IP归属信息对象
 */
export const getIpLocation = async (
  ip: string,
  useCommercial: boolean = false
): Promise<any> => {
  try {
    const params: any = { ip };
    if (useCommercial) {
      params.source = 'commercial';
    }
    const response = await apiClient.get('/network/ipinfo', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'IP归属查询');
  }
};

// ==================== WHOIS 相关 API ====================

/**
 * 查询域名的 WHOIS 注册信息
 * @param domain 域名
 * @param format 返回格式：'text' 或 'json'
 * @returns WHOIS信息对象
 */
export const getWhoisInfo = async (
  domain: string,
  format: 'text' | 'json' = 'text'
): Promise<any> => {
  try {
    const response = await apiClient.get('/network/whois', {
      params: { domain, format },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'WHOIS查询');
  }
};

// ==================== ICP 相关 API ====================

/**
 * 查询域名的 ICP 备案信息
 * @param domain 域名或URL
 * @returns ICP备案信息对象
 */
export const getIcpInfo = async (domain: string): Promise<any> => {
  try {
    const response = await apiClient.get('/network/icp', {
      params: { domain },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'ICP备案查询');
  }
};

// ==================== Ping 相关 API ====================

/**
 * Ping 指定主机
 * @param host 目标主机（域名或IP）
 * @returns Ping测试结果
 */
export const pingHost = async (host: string): Promise<any> => {
  try {
    const response = await apiClient.get('/network/ping', {
      params: { host },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Ping测试');
  }
};

/**
 * Ping 客户端 IP（从服务器 Ping 你的 IP）
 * @returns 客户端Ping测试结果
 */
export const pingMyIp = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/network/pingmyip');
    return response.data;
  } catch (error) {
    return handleApiError(error, '客户端Ping');
  }
};

// ==================== DNS 相关 API ====================

/**
 * DNS 解析查询
 * @param domain 域名
 * @param type DNS 记录类型
 * @returns DNS解析结果
 */
export const getDnsRecords = async (
  domain: string,
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' = 'A'
): Promise<any> => {
  try {
    const response = await apiClient.get('/network/dns', {
      params: { domain, type },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'DNS解析');
  }
};

// ==================== URL 检查相关 API ====================

/**
 * 检查 URL 的可访问性状态
 * @param url 完整的 URL
 * @returns URL状态检查结果
 */
export const checkUrlStatus = async (url: string): Promise<any> => {
  try {
    const response = await apiClient.get('/network/urlstatus', {
      params: { url },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'URL检查');
  }
};

// ==================== 端口扫描相关 API ====================

/**
 * 扫描远程主机的指定端口
 * @param host 目标主机（域名或IP）
 * @param port 端口号（1-65535）
 * @param protocol 协议（tcp或udp）
 * @returns 端口扫描结果
 */
export const scanPort = async (
  host: string,
  port: number,
  protocol: 'tcp' | 'udp' = 'tcp'
): Promise<any> => {
  try {
    const response = await apiClient.get('/network/portscan', {
      params: { host, port, protocol },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, '端口扫描');
  }
};

// ==================== 微信域名检测相关 API ====================

/**
 * 检查域名在微信中的访问状态
 * @param domain 域名
 * @returns 微信域名检测结果
 */
export const checkWechatDomain = async (domain: string): Promise<any> => {
  try {
    const response = await apiClient.get('/network/wxdomain', {
      params: { domain },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, '微信域名检测');
  }
};

// 导出 axios 实例（如果需要直接使用）
export { apiClient };

export default apiClient;