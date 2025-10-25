import React from 'react';
import { useAppStore } from '../store';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { X, Check, Clock, Play, AlertCircle } from 'lucide-react';

interface ProcessingListItemProps {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

const ProcessingListItem: React.FC<ProcessingListItemProps> = ({
  id,
  fileName,
  status,
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
    return t(`processingList.status.${status}`);
  };

  return (
    <li className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getStatusText()}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeFromProcessingList(id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </li>
  );
};

export default ProcessingListItem;
