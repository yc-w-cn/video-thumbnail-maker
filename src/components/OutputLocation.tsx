import React from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useAppStore } from '../store';

const OutputLocation: React.FC = () => {
  const { settings, updateSettings, processState } = useAppStore();

  const handleSelectOutputDir = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      defaultPath: settings.output,
    });
    if (selected) {
      updateSettings({ output: selected as string });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Label className="text-sm font-medium">输出位置</Label>
      <Switch
        id="use-video-dir"
        checked={settings.useVideoDir}
        onCheckedChange={(checked) =>
          updateSettings({ useVideoDir: checked })
        }
      />
      <Label
        htmlFor="use-video-dir"
        className="text-sm text-gray-500"
      >
        保存在视频同目录
      </Label>
      {settings.useVideoDir ? (
        <p className="text-sm text-gray-500 truncate max-w-[200px]">
          {processState.currentFile
            ? processState.currentFile.split('/').slice(0, -1).join('/')
            : '请先选择视频文件'}
        </p>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectOutputDir}
          >
            选择文件夹
          </Button>
          <p className="text-sm text-gray-500 truncate max-w-[200px]">
            {settings.output}
          </p>
        </div>
      )}
    </div>
  );
};

export default OutputLocation;