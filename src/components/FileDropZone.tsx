import { useAppStore } from '../store';

const FileDropZone = () => {
  const { processState } = useAppStore();

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
      <p className="text-gray-500 dark:text-gray-400">
        {processState.currentFile
          ? processState.currentFile.split('/').pop()
          : '拖放视频文件到这里开始处理'}
      </p>
    </div>
  );
};

export default FileDropZone;