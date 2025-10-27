import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useAppStore } from '../store';
import OutputLocation from './OutputLocation';
import { useTranslation } from 'react-i18next';

const VideoSettings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const { t } = useTranslation();

  // 本地状态用于处理复选框变化
  const [generateThumbnail, setGenerateThumbnail] = useState(
    settings.generateThumbnail,
  );
  const [generateGif, setGenerateGif] = useState(settings.generateGif);

  // 处理生成模式变化
  const handleGenerateThumbnailChange = (checked: boolean) => {
    setGenerateThumbnail(checked);
    updateSettings({ generateThumbnail: checked });
  };

  const handleGenerateGifChange = (checked: boolean) => {
    setGenerateGif(checked);
    updateSettings({ generateGif: checked });
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* 生成模式选择 - 改为多选框 */}
      <div className="flex flex-col space-y-2 col-span-3">
        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t('settings.video.generateMode')}
        </Label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Checkbox
              id="generateThumbnail"
              checked={generateThumbnail}
              onCheckedChange={handleGenerateThumbnailChange}
              className="mr-2"
            />
            <Label
              htmlFor="generateThumbnail"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {t('settings.video.generateModeThumbnail')}
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="generateGif"
              checked={generateGif}
              onCheckedChange={handleGenerateGifChange}
              className="mr-2"
            />
            <Label
              htmlFor="generateGif"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {t('settings.video.generateModeGif')}
            </Label>
          </div>
        </div>
      </div>

      {/* 缩略图相关选项 - 仅在选中缩略图时显示 */}
      {generateThumbnail && (
        <>
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
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-none"
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
              onChange={(e) =>
                updateSettings({ width: Number(e.target.value) })
              }
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-none"
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
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-none"
            />
          </div>
        </>
      )}

      {/* GIF动画配置选项 - 仅在选中GIF时显示 */}
      {generateGif && (
        <>
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="gifFPS"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {t('settings.video.gifFPS')}
            </Label>
            <Input
              id="gifFPS"
              type="number"
              value={settings.gifFPS}
              onChange={(e) =>
                updateSettings({ gifFPS: Number(e.target.value) })
              }
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="gifDelay"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {t('settings.video.gifDelay')}
            </Label>
            <Input
              id="gifDelay"
              type="number"
              value={settings.gifDelay}
              onChange={(e) =>
                updateSettings({ gifDelay: Number(e.target.value) })
              }
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="gifLoop"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {t('settings.video.gifLoop')}
            </Label>
            <Input
              id="gifLoop"
              type="number"
              value={settings.gifLoop}
              onChange={(e) =>
                updateSettings({ gifLoop: Number(e.target.value) })
              }
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-none"
            />
          </div>
        </>
      )}

      <OutputLocation />
    </div>
  );
};

export default VideoSettings;
