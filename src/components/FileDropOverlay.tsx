import React, { useState, useEffect } from 'react';
import { FileVideo } from 'lucide-react';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import { UnlistenFn } from '@tauri-apps/api/event';
import { useAppStore } from '../store';
import { useToast } from '../hooks/use-toast';

const FileDropOverlay: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const setCurrentFile = useAppStore((state) => state.setCurrentFile);
  const { toast } = useToast();

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
            setCurrentFile(file);
          } else if (file) {
            toast({
              title: '不支持的文件格式',
              description: '请选择 MP4 格式的视频文件',
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
  }, [setCurrentFile]);

  return (
    <>
      {isHovering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
            <FileVideo className="text-white size-[30%]" />
            <span className="text-white text-3xl">
              仅支持 MP4 格式的视频文件
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDropOverlay;
