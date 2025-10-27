import React from 'react';
import { useAppStore } from '../store';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { Check, Clock, Play, AlertCircle, Trash } from 'lucide-react';
import { Progress } from './ui/progress';

interface ProcessingListItemProps {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number; // 添加进度属性
  processType?: 'thumbnail' | 'gif'; // 添加处理类型属性
}

const ProcessingListItem: React.FC<ProcessingListItemProps> = ({
  id,
  fileName,
  status,
  progress = 0, // 默认进度为0
  processType,
}) => {
  const { removeFromProcessingList } = useAppStore();
  const { t } = useTranslation();

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    // 根据处理类型返回不同的状态文本
    const baseText = t(`processingList.status.${status}`);
    if (processType) {
      return `${baseText} (${processType === 'gif' ? t('settings.video.generateModeGif') : t('settings.video.generateModeThumbnail')})`;
    }
    // 如果没有指定处理类型，根据状态显示通用文本
    if (status === 'completed') {
      return `${baseText} (${t('settings.video.generateModeThumbnail')})`;
    }
    return baseText;
  };

  // 检查是否为已处理文件
  const isProcessed = status === 'completed';

  return (
    <li
      className={`flex items-center justify-between p-2 rounded ${
        isProcessed
          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getStatusText()}
            {isProcessed && (
              <span className="ml-1 text-green-600 dark:text-green-400">
                ({t('processingList.status.completed')})
              </span>
            )}
          </p>
          {/* 显示处理进度 */}
          {status === 'processing' && (
            <div className="mt-1">
              <Progress value={progress} className="h-1" />
              <span className="text-xs text-blue-500">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="cursor-pointer hover:outline-red-500 hover:outline bg-transparent size-6"
        onClick={() => removeFromProcessingList(id)}
      >
        <Trash className="h-2 w-2" color="red" />
      </Button>
    </li>
  );
};

export default ProcessingListItem;
