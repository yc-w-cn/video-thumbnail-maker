import { invoke } from '@tauri-apps/api/core';
import { dirname } from '@tauri-apps/api/path';
import { Button } from './ui/button';
import { useAppStore } from '../store';

const ProcessButton = () => {
  const { settings, processState, setCurrentFile } = useAppStore();

  return (
    <div className="flex justify-center">
      <Button
        variant="default"
        size="lg"
        className="w-full max-w-xs dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
        disabled={!processState.currentFile}
        onClick={async () => {
          if (!processState.currentFile) return;
          const output = settings.useVideoDir
            ? await dirname(processState.currentFile)
            : settings.output;
          invoke('process_video', {
            path: processState.currentFile,
            thumbnails: settings.thumbnails,
            width: settings.width,
            cols: settings.cols,
            output,
          })
            .then(() => {
              console.log('处理完成');
              setCurrentFile(null);
            })
            .catch(console.error);
        }}
      >
        开始生成
      </Button>
    </div>
  );
};

export default ProcessButton;