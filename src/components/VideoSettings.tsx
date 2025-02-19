import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAppStore } from '../store';
import OutputLocation from './OutputLocation';
import { useTranslation } from 'react-i18next';

const VideoSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="flex flex-col space-y-2">
        <Label
          htmlFor="thumbnails"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {t('settings.video.thumbnails')}
        </Label>
        <Input
          id="thumbnails"
          type="number"
          value={settings.thumbnails}
          onChange={(e) =>
            updateSettings({ thumbnails: Number(e.target.value) })
          }
          className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label
          htmlFor="width"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {t('settings.video.width')}
        </Label>
        <Input
          id="width"
          type="number"
          value={settings.width}
          onChange={(e) => updateSettings({ width: Number(e.target.value) })}
          className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label
          htmlFor="cols"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {t('settings.video.cols')}
        </Label>
        <Input
          id="cols"
          type="number"
          value={settings.cols}
          onChange={(e) => updateSettings({ cols: Number(e.target.value) })}
          className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        />
      </div>

      <OutputLocation />
    </div>
  );
};

export default VideoSettings;
