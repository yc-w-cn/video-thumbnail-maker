import React from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useAppStore } from '../store';
import Marquee from 'react-fast-marquee';

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
    <div className="flex flex-col gap-2 col-span-3">
      <Label className="text-sm font-medium">输出位置</Label>
      <div className="flex items-center gap-2">
        <Switch
          id="use-video-dir"
          checked={settings.useVideoDir}
          onCheckedChange={(checked) =>
            updateSettings({ useVideoDir: checked })
          }
          className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-400"
        />
        <Label htmlFor="use-video-dir" className="text-sm text-gray-500">
          保存在视频同目录
        </Label>
        {settings.useVideoDir ? (
          <p className="flex-1 text-sm text-gray-500 truncate relative">
            <Marquee speed={20} autoFill={true}>
              {processState.currentFile &&
                processState.currentFile.split('/').slice(0, -1).join('/')}
            </Marquee>
          </p>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={handleSelectOutputDir}>
              选择文件夹
            </Button>
            <p className="flex-1 text-sm text-gray-500 truncate">
              <Marquee speed={20} autoFill={true}>
                {settings.output}
              </Marquee>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OutputLocation;
