import FileDropOverlay from './components/FileDropOverlay';
import { useAppStore } from './store';
import DependencyCheck from './components/DependencyCheck';
import { Toaster } from './components/ui/toaster';
import VideoSettings from './components/VideoSettings';
import ProcessButton from './components/ProcessButton';

export default function App() {
  const { processState } = useAppStore();

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center py-8 px-4">
        <div className="mx-auto min-w-2xl max-w-3xl bg-white rounded-xl shadow-sm p-6 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              视频缩略图生成器
            </h1>
            <p className="text-gray-500">快速生成视频预览缩略图</p>
          </div>

          <DependencyCheck />

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <p className="text-gray-500">
              {processState.currentFile
                ? processState.currentFile.split('/').pop()
                : '拖放视频文件到这里开始处理'}
            </p>
          </div>

          <VideoSettings />

          <ProcessButton />
        </div>
      </div>
      <Toaster />
      <FileDropOverlay />
    </>
  );
}
