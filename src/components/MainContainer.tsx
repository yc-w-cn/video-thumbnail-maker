import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center py-8 px-4">
      <div className="mx-auto min-w-xl max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 space-y-8">
        {children}
      </div>
    </div>
  );
};

export default MainContainer;
