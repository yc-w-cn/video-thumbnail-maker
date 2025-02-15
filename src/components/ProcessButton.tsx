import { invoke } from '@tauri-apps/api/core';
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
        onClick={() => {
          if (!processState.currentFile) return;
          invoke('process_video', {
            path: processState.currentFile,
            ...settings,
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