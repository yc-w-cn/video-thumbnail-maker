import React, { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { List } from 'lucide-react';
import { useAppStore } from '../store';
import { useTranslation } from 'react-i18next';

const ProcessingListButton: React.FC = () => {
  const { setShowProcessingList } = useAppStore();
  const { t } = useTranslation();
  const [isOpening, setIsOpening] = useState(false);

  // 使用useCallback包装onClick处理函数，避免不必要的重新渲染
  const handleClick = useCallback(() => {
    setIsOpening(true);
    setTimeout(() => {
      setShowProcessingList(true);
      setIsOpening(false);
    }, 150); // 短暂延迟以触发动画
  }, [setShowProcessingList]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={`cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
        isOpening ? 'scale-110' : 'scale-100'
      }`}
      title={t('processingList.toggle')}
    >
      <List className="h-5 w-5" />
    </Button>
  );
};

export default ProcessingListButton;
