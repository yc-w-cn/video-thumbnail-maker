import React, { useState, useEffect, useCallback } from 'react';
import { FileVideo } from 'lucide-react';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import { UnlistenFn } from '@tauri-apps/api/event';
import { useAppStore } from '../store';
import { useToast } from '../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const FileDropOverlay: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { setCurrentFile, addMultipleToProcessingListWithCheck } =
    useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  // 处理拖放的文件和文件夹
  const handleFileDrop = useCallback(
    async (paths: string[]) => {
      // 过滤出MP4文件
      const mp4Files = paths.filter((path) =>
        path?.toLowerCase().endsWith('.mp4'),
      );

      if (mp4Files.length === 0) {
        toast({
          title: t('status.error'),
          description: t('actions.dropzone.mp4_only'),
          variant: 'destructive',
        });
        return;
      }

      // 设置第一个文件为当前文件（用于主界面显示）
      if (mp4Files.length > 0) {
        setCurrentFile(mp4Files[0]);
      }

      // 批量添加到处理列表（带处理状态检查）
      addMultipleToProcessingListWithCheck(mp4Files);

      // 显示添加结果
      toast({
        title: t('status.success'),
        description: t('actions.dropzone.added_files', {
          count: mp4Files.length,
        }),
      });
    },
    [setCurrentFile, addMultipleToProcessingListWithCheck, toast, t],
  );

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;
    getCurrentWebview()
      .onDragDropEvent((event) => {
        if (event.payload.type === 'over') {
          setIsHovering(true);
        } else if (event.payload.type === 'drop') {
          setIsHovering(false);
          const paths = event.payload.paths;
          if (paths && paths.length > 0) {
            handleFileDrop(paths);
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
  }, [handleFileDrop]);

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
