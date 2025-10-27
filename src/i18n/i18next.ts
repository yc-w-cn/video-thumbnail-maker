import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      error: {
        title: 'An Error Occurred',
        description: 'Something went wrong while rendering the application.',
        retry: 'Retry',
      },
      status: {
        checking: 'Checking dependencies...',
        ready: 'Ready',
        processing: 'Processing...',
        complete: 'Complete',
        error: 'Error',
        success: 'Success',
      },
      app: {
        title: 'Video Thumbnail Maker',
        description: 'A simple and easy-to-use video thumbnail generator',
      },
      settings: {
        output: {
          title: 'Output Location',
          select: 'Select Output Folder',
          current: 'Current Output Folder',
        },
        video: {
          title: 'Video Settings',
          rows: 'Rows',
          columns: 'Columns',
          quality: 'Quality',
          width: 'Width',
          height: 'Height',
          thumbnails: 'Number of Screenshots',
          cols: 'Columns per Row',
          // 添加生成模式相关翻译
          generateMode: 'Generation Mode',
          generateModeThumbnail: 'Thumbnails',
          generateModeGif: 'Thumbnail Animation',
          // 添加GIF动画配置相关翻译
          gifFPS: 'Animation FPS',
          gifDelay: 'Animation Delay (1/100 sec)',
          gifLoop: 'Animation Loop (0 = infinite)',
        },
      },
      actions: {
        process: 'Generate Thumbnails',
        dropzone: {
          title: 'Drop video files here',
          description: 'or click to select files',
          mp4_only: 'MP4, WMV, and MKV files are supported',
          added_files: '{{count}} files added to processing list',
        },
      },
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        toggle: {
          light: 'Switch to Light Mode',
          dark: 'Switch to Dark Mode',
        },
      },
      language: {
        en: 'English',
        zh: '中文',
        toggle: 'Switch Language',
      },
      dependencies: {
        title: 'System Dependencies Check',
      },
      // 新增处理列表翻译
      processingList: {
        title: 'Processing List',
        empty: 'No files in the processing list',
        toggle: 'Toggle Processing List',
        start: 'Start Processing',
        pause: 'Pause',
        clear: 'Clear List',
        clearCompleted: 'Clear Completed',
        skip: 'Skip processed files',
        status: {
          pending: 'Pending',
          processing: 'Processing',
          completed: 'Completed',
          error: 'Error',
        },
        noModeSelected: 'Please select at least one generation mode',
      },
    },
  },
  zh: {
    translation: {
      error: {
        title: '发生错误',
        description: '渲染应用程序时出现问题。',
        retry: '重试',
      },
      status: {
        checking: '正在检查依赖...',
        ready: '就绪',
        processing: '处理中...',
        complete: '完成',
        error: '错误',
        success: '成功',
      },
      app: {
        title: '视频缩略图生成器',
        description: '一个简单易用的视频缩略图生成工具',
      },
      settings: {
        output: {
          title: '输出位置',
          select: '选择输出文件夹',
          current: '当前输出文件夹：',
        },
        video: {
          title: '视频设置',
          rows: '行数',
          columns: '列数',
          quality: '质量',
          width: '宽度',
          height: '高度',
          thumbnails: '截图数量',
          cols: '每行数量',
          // 添加生成模式相关翻译
          generateMode: '生成模式',
          generateModeThumbnail: '缩略图',
          generateModeGif: '缩略图动画',
          // 添加GIF动画配置相关翻译
          gifFPS: '动画帧率',
          gifDelay: '动画延迟(1/100秒)',
          gifLoop: '动画循环(0=无限)',
        },
      },
      actions: {
        process: '开始生成缩略图',
        dropzone: {
          title: '将视频文件拖放到此处',
          description: '或点击选择文件',
          mp4_only: '支持MP4、WMV和MKV文件',
          added_files: '已添加{{count}}个文件到处理列表',
        },
      },
      theme: {
        light: '浅色',
        dark: '深色',
        system: '系统',
        toggle: {
          light: '切换到浅色模式',
          dark: '切换到深色模式',
        },
      },
      language: {
        en: 'English',
        zh: '中文',
        toggle: '切换语言',
      },
      dependencies: {
        title: '系统依赖检查',
      },
      // 新增处理列表翻译
      processingList: {
        title: '处理列表',
        empty: '处理列表中没有文件',
        toggle: '切换处理列表',
        start: '开始处理',
        pause: '暂停',
        clear: '清空列表',
        clearCompleted: '清空已完成',
        skip: '跳过已处理文件',
        status: {
          pending: '待处理',
          processing: '处理中',
          completed: '已完成',
          error: '错误',
        },
        noModeSelected: '请至少选择一种生成模式',
      },
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('locale') || 'zh',
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
  debug: import.meta.env.DEV,
});

export default i18next;
