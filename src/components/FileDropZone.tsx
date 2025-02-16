import { X } from 'lucide-react';
import { useAppStore } from '../store';
import { useTranslation } from 'react-i18next';

const FileDropZone = () => {
  const { processState, setCurrentFile } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
      <p className="text-gray-500 dark:text-gray-400">
        {processState.currentFile
          ? processState.currentFile.split('/').pop()
          : t('actions.dropzone.title')}
      </p>
      {processState.currentFile && (
        <button
          onClick={() => setCurrentFile(null)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          title={t('actions.dropzone.clear')}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

export default FileDropZone;
