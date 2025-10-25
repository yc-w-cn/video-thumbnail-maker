import React, { useCallback, useState } from 'react';
import { useAppStore } from '../store';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { X, Play, Pause } from 'lucide-react';
import ProcessingListItem from './ProcessingListItem';
import { invoke } from '@tauri-apps/api/core';
import { dirname } from '@tauri-apps/api/path';
import { useToast } from '../hooks/use-toast';
import { listen } from '@tauri-apps/api/event';

const ProcessingList: React.FC = () => {
  const {
    processingList,
    showProcessingList,
    setShowProcessingList,
    clearProcessingList,
    processState,
    setPaused,
    updateProcessingItemStatus,
    settings,
    setProcessing,
    setProgress,
    updateProcessingItemProgress,
  } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [skipProcessed, setSkipProcessed] = useState(true);

  // 使用useCallback包装togglePause函数，避免不必要的重新渲染
  const togglePause = useCallback(() => {
    setPaused(!processState.isPaused);
  }, [processState.isPaused, setPaused]);

  // 处理单个文件
  const processSingleFile = useCallback(
    async (itemId: string, filePath: string) => {
      const output = settings.useVideoDir
        ? await dirname(filePath)
        : settings.output;

      setProcessing(true);
      setPaused(false);
      setProgress(0);

      try {
        // 监听进度更新事件
        const unlisten = await listen('progress-update', (event) => {
          const progress = event.payload as number;
          setProgress(progress);
          // 更新处理项的进度
          updateProcessingItemProgress(itemId, progress);
        });

        await invoke('process_video', {
          path: filePath,
          thumbnails: settings.thumbnails,
          width: settings.width,
          cols: settings.cols,
          output,
        });

        // 处理完成后取消监听
        unlisten();

        toast({
          title: t('status.complete'),
          description: t('status.ready'),
        });

        return true;
      } catch (error) {
        console.error(error);
        toast({
          title: t('status.error'),
          description: String(error),
          variant: 'destructive',
        });

        return false;
      } finally {
        setProcessing(false);
        setProgress(0);
      }
    },
    [
      settings,
      setProcessing,
      setPaused,
      setProgress,
      toast,
      t,
      updateProcessingItemProgress,
    ],
  );

  // 处理所有文件
  const processAllFiles = useCallback(async () => {
    // 过滤出需要处理的文件
    const filesToProcess = skipProcessed
      ? processingList.filter((item) => item.status !== 'completed')
      : processingList;

    for (const item of filesToProcess) {
      // 如果已暂停，等待恢复
      if (processState.isPaused) {
        // 等待恢复的逻辑
        while (processState.isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // 更新状态为处理中
      updateProcessingItemStatus(item.id, 'processing');

      // 处理文件（传递处理项ID以便更新进度）
      const success = await processSingleFile(item.id, item.filePath);

      // 更新状态
      updateProcessingItemStatus(item.id, success ? 'completed' : 'error');
    }
  }, [
    processingList,
    skipProcessed,
    processState.isPaused,
    updateProcessingItemStatus,
    processSingleFile,
  ]);

  // 切换跳过已处理文件选项
  const toggleSkipProcessed = useCallback(() => {
    setSkipProcessed(!skipProcessed);
  }, [skipProcessed]);

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
                      progress={item.progress}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {/* 跳过已处理文件选项 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="skipProcessed"
                  checked={skipProcessed}
                  onChange={toggleSkipProcessed}
                  className="mr-2"
                />
                <label htmlFor="skipProcessed" className="text-sm">
                  {t('processingList.skip')}
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  size="sm"
                  disabled={
                    processState.isProcessing || processingList.length === 0
                  }
                  onClick={processAllFiles}
                >
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
                disabled={processState.isProcessing}
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
