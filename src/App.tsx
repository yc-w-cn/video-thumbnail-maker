import FileDropOverlay from './components/FileDropOverlay';
import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
import { useAppStore } from './store';

export default function App() {
  const {
    dependencies,
    settings,
    setDependencies,
    updateSettings,
    processState,
    setCurrentFile,
  } = useAppStore();

  React.useEffect(() => {
    invoke('check_dependencies')
      .then((result: unknown) => {
        const [ffmpeg, magick] = result as [boolean, boolean];
        setDependencies({ ffmpeg, magick });
      })
      .catch(console.error);
  }, [setDependencies]);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-3xl bg-white rounded-xl shadow-sm p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            视频缩略图生成器
          </h1>
          <p className="text-gray-500">快速生成视频预览缩略图</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-medium text-gray-900">系统依赖检查</h2>
          {dependencies === null ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-3 rounded-lg ${dependencies.ffmpeg ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {dependencies.ffmpeg ? '✅' : '❌'}
                  </span>
                  <span>FFmpeg</span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg ${dependencies.magick ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {dependencies.magick ? '✅' : '❌'}
                  </span>
                  <span>ImageMagick</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <p className="text-gray-500">拖放视频文件到这里开始处理</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="cols" className="text-sm font-medium">
              每行数量
            </Label>
            <Input
              id="cols"
              type="number"
              value={settings.cols}
              onChange={(e) => updateSettings({ cols: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">输出位置</Label>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
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
              </div>
              {!settings.useVideoDir && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectOutputDir}
                >
                  选择文件夹
                </Button>
              )}
            </div>
            {!settings.useVideoDir && (
              <p className="text-sm text-gray-500 truncate">
                {settings.output}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            className="w-full max-w-xs"
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

        <FileDropOverlay />
      </div>
    </div>
  );
}
