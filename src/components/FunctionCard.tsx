import React from 'react';
import { Link } from 'react-router-dom';
import { FunctionItem } from '@/types';
import { HiArrowRight } from 'react-icons/hi2';

interface FunctionCardProps {
  item: FunctionItem;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ item }) => {
  return (
    <Link to={item.path}>
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full group">
        {/* 图标 */}
        <div className="w-12 h-12 bg-apple-blue bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-all">
          <span className="text-apple-blue text-2xl">
            {item.icon}
          </span>
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold text-apple-text mb-2 group-hover:text-apple-blue transition-colors">
          {item.title}
        </h3>

        {/* 描述 */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {item.description}
        </p>

        {/* 箭头图标 */}
        <div className="mt-4 flex items-center text-apple-blue text-sm font-medium">
          <span>立即使用</span>
          <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default FunctionCard;