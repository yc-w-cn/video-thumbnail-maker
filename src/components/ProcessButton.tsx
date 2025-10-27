import { invoke } from '@tauri-apps/api/core';
import { dirname } from '@tauri-apps/api/path';
import { Button } from './ui/button';
import { useAppStore } from '../store';
import { Progress } from './ui/progress';
import { useToast } from '../hooks/use-toast';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProcessButton = () => {
  const {
    settings,
    processState,
    setCurrentFile,
    setProcessing,
    setPaused,
    setProgress,
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

    // 获取文件名用于提示
    const fileName = filePath.split('/').pop() || filePath;
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
        description: `${t('status.ready')}: ${fileName}`,
      });

      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: t('status.error'),
        description: `${fileName}: ${String(error)}`,
        variant: 'destructive',
      });

      return false;
    } finally {
      setProcessing(false);
      setProgress(0);
      setCurrentFile(null);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs space-y-4">
        <Button
          variant="default"
          size="lg"
          className="w-full text-white dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
          disabled={processState.isProcessing}
          onClick={async () => {
            if (!processState.currentFile) {
              toast({
                title: t('status.error'),
                description: t('actions.dropzone.title'),
              });
              return;
            }

            await processSingleFile(processState.currentFile);
          }}
        >
          {processState.isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('actions.process')
          )}
        </Button>

        {processState.isProcessing && (
          <Progress value={processState.progress} className="w-full" />
        )}
      </div>
    </div>
  );
};

export default ProcessButton;
