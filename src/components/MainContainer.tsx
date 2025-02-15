import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center py-8 px-4">
      <div className="mx-auto min-w-2xl max-w-3xl bg-white rounded-xl shadow-sm p-6 space-y-8">
        {children}
      </div>
    </div>
  );
};

export default MainContainer;