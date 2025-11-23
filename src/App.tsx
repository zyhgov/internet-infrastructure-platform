import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import IpInfo from '@/pages/IpInfo';
import Whois from '@/pages/Whois';
import Icp from '@/pages/Icp';
import Ping from '@/pages/Ping';
import Dns from '@/pages/Dns';
import IpLocation from '@/pages/IpLocation';
import UrlCheck from '@/pages/UrlCheck';
import ClientPing from '@/pages/ClientPing';
import PortScan from '@/pages/PortScan';
import WechatCheck from '@/pages/WechatCheck';
import About from '@/pages/About';
import ApiDocs from '@/pages/ApiDocs';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ip-info" element={<IpInfo />} />
          <Route path="/whois" element={<Whois />} />
          <Route path="/icp" element={<Icp />} />
          <Route path="/ping" element={<Ping />} />
          <Route path="/dns" element={<Dns />} />
          <Route path="/ip-location" element={<IpLocation />} />
          <Route path="/url-check" element={<UrlCheck />} />
          <Route path="/client-ping" element={<ClientPing />} />
          <Route path="/port-scan" element={<PortScan />} />
          <Route path="/wechat-check" element={<WechatCheck />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;