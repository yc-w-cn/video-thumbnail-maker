import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAppStore } from '../store';
import OutputLocation from './OutputLocation';

const VideoSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="thumbnails" className="text-sm font-medium">
          截图数量
        </Label>
        <Input
          id="thumbnails"
          type="number"
          value={settings.thumbnails}
          onChange={(e) =>
            updateSettings({ thumbnails: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="width" className="text-sm font-medium">
          缩略图宽度
        </Label>
        <Input
          id="width"
          type="number"
          value={settings.width}
          onChange={(e) =>
            updateSettings({ width: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="cols" className="text-sm font-medium">
          每行数量
        </Label>
        <Input
          id="cols"
          type="number"
          value={settings.cols}
          onChange={(e) =>
            updateSettings({ cols: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <OutputLocation />
    </div>
  );
};

export default VideoSettings;