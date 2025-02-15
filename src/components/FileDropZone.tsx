import { useAppStore } from '../store';

const FileDropZone = () => {
  const { processState } = useAppStore();

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
      <p className="text-gray-500">
        {processState.currentFile
          ? processState.currentFile.split('/').pop()
          : '拖放视频文件到这里开始处理'}
      </p>
    </div>
  );
};

export default FileDropZone;