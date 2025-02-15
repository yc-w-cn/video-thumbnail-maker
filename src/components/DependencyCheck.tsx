import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from '../store';

const DependencyCheck: React.FC = () => {
  const { dependencies, setDependencies } = useAppStore();

  React.useEffect(() => {
    invoke('check_dependencies')
      .then((result: unknown) => {
        const [ffmpeg, magick] = result as [boolean, boolean];
        setDependencies({ ffmpeg, magick });
      })
      .catch(console.error);
  }, [setDependencies]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <h2 className="text-lg font-medium text-gray-900">系统依赖检查</h2>
      {dependencies === null ? (
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-3 rounded-lg ${dependencies.ffmpeg ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {dependencies.ffmpeg ? '✅' : '❌'}
              </span>
              <span>FFmpeg</span>
            </div>
          </div>
          <div
            className={`p-3 rounded-lg ${dependencies.magick ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {dependencies.magick ? '✅' : '❌'}
              </span>
              <span>ImageMagick</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyCheck;