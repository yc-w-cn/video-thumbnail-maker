import React, { useCallback } from 'react';
import { useAppStore } from '../store';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { X, Play, Pause } from 'lucide-react';
import ProcessingListItem from './ProcessingListItem';

const ProcessingList: React.FC = () => {
  const {
    processingList,
    showProcessingList,
    setShowProcessingList,
    clearProcessingList,
    processState,
    setPaused,
  } = useAppStore();
  const { t } = useTranslation();

  // 使用useCallback包装togglePause函数，避免不必要的重新渲染
  const togglePause = useCallback(() => {
    setPaused(!processState.isPaused);
  }, [processState.isPaused, setPaused]);

  // 不要在这里提前返回，确保Hook调用的一致性
  return (
    <>
      {showProcessingList && (
        <div className="fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">
                {t('processingList.title')}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProcessingList(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4">
              {processingList.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {t('processingList.empty')}
                </p>
              ) : (
                <ul className="space-y-2">
                  {processingList.map((item) => (
                    <ProcessingListItem
                      key={item.id}
                      id={item.id}
                      fileName={item.fileName}
                      status={item.status}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  {t('processingList.start')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePause}
                  disabled={!processState.isProcessing}
                >
                  {processState.isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      {t('processingList.start')}
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      {t('processingList.pause')}
                    </>
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearProcessingList}
              >
                {t('processingList.clear')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessingList;
