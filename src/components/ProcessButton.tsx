import { invoke } from '@tauri-apps/api/core';
import { dirname } from '@tauri-apps/api/path';
import { Button } from './ui/button';
import { useAppStore } from '../store';
import { Progress } from './ui/progress';
import { useToast } from '../hooks/use-toast';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { Loader2, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProcessButton = () => {
  const {
    settings,
    processState,
    setCurrentFile,
    setProcessing,
    setPaused,
    setProgress,
    processingList,
    updateProcessingItemStatus,
  } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const unlisten = listen('progress-update', (event) => {
      setProgress(event.payload as number);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, [setProgress]);

  const processSingleFile = async (filePath: string) => {
    const output = settings.useVideoDir
      ? await dirname(filePath)
      : settings.output;

    setProcessing(true);
    setPaused(false);
    setProgress(0);

    try {
      await invoke('process_video', {
        path: filePath,
        thumbnails: settings.thumbnails,
        width: settings.width,
        cols: settings.cols,
        output,
      });

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
  };

  const processBatch = async () => {
    // 批量处理逻辑
    for (const item of processingList) {
      // 如果已暂停，等待恢复
      if (processState.isPaused) {
        // 这里应该实现等待恢复的逻辑
        // 暂时跳过暂停逻辑
        // 等待恢复的逻辑可以通过轮询或事件来实现
        while (processState.isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // 更新状态为处理中
      updateProcessingItemStatus(item.id, 'processing');

      // 处理文件
      const success = await processSingleFile(item.filePath);

      // 更新状态
      updateProcessingItemStatus(item.id, success ? 'completed' : 'error');
    }
  };

  const togglePause = () => {
    setPaused(!processState.isPaused);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs space-y-4">
        <Button
          variant="default"
          size="lg"
          className="w-full dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
          disabled={processState.isProcessing}
          onClick={async () => {
            if (!processState.currentFile) {
              toast({
                title: t('status.error'),
                description: t('actions.dropzone.title'),
              });
              return;
            }

            const success = await processSingleFile(processState.currentFile);
            if (success) {
              setCurrentFile(null);
            }
          }}
        >
          {processState.isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('actions.process')
          )}
        </Button>

        {/* 批量处理按钮 */}
        {processingList.length > 0 && (
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={processState.isProcessing}
            onClick={processBatch}
          >
            {processState.isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('processingList.start')
            )}
          </Button>
        )}

        {/* 暂停/继续按钮 */}
        {processState.isProcessing && (
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={togglePause}
          >
            {processState.isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                {t('processingList.start')}
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                {t('processingList.pause')}
              </>
            )}
          </Button>
        )}

        {processState.isProcessing && (
          <Progress value={processState.progress} className="w-full" />
        )}
      </div>
    </div>
  );
};

export default ProcessButton;
