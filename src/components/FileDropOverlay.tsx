import React, { useState, useEffect, useCallback } from 'react';
import { FileVideo } from 'lucide-react';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import { UnlistenFn } from '@tauri-apps/api/event';
import { useAppStore } from '../store';
import { useToast } from '../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const FileDropOverlay: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { setCurrentFile, addToProcessingList, checkIfFileProcessed } =
    useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  // 使用useCallback包装处理函数，避免不必要的重新渲染
  const handleFileDrop = useCallback(
    async (file: string) => {
      setCurrentFile(file);
      // 添加到处理列表
      addToProcessingList(file);

      // 检查文件是否已处理
      try {
        const isProcessed = await checkIfFileProcessed(file);
        // 这里可以更新文件状态，但需要获取正确的项目ID
        // 由于状态更新是异步的，我们需要稍后处理
        if (isProcessed) {
          // 如果需要更新状态，可以通过ID来更新
          // updateProcessingItemStatus(id, 'completed');
        }
      } catch (error) {
        console.error('Error checking if file is processed:', error);
      }
    },
    [setCurrentFile, addToProcessingList, checkIfFileProcessed],
  );

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;
    getCurrentWebview()
      .onDragDropEvent((event) => {
        if (event.payload.type === 'over') {
          setIsHovering(true);
        } else if (event.payload.type === 'drop') {
          setIsHovering(false);
          const file = event.payload.paths?.[0];
          if (file?.toLowerCase().endsWith('.mp4')) {
            handleFileDrop(file);
          } else if (file) {
            toast({
              title: t('status.unsupported_format'),
              description: t('actions.dropzone.mp4_only'),
              variant: 'destructive',
            });
          }
        } else {
          setIsHovering(false);
        }
      })
      .then((fn) => {
        unlisten = fn;
      });
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [handleFileDrop, toast, t]);

  return (
    <>
      {isHovering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
            <FileVideo className="text-white size-[30%]" />
            <span className="text-white text-3xl">
              {t('actions.dropzone.mp4_only')}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDropOverlay;
