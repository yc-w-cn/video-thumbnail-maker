import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        视频缩略图生成器
      </h1>
      <p className="text-gray-500">快速生成视频预览缩略图</p>
    </div>
  );
};

export default AppHeader;