import FileDropOverlay from './components/FileDropOverlay';
import DependencyCheck from './components/DependencyCheck';
import { Toaster } from './components/ui/toaster';
import FileDropZone from './components/FileDropZone';
import VideoSettings from './components/VideoSettings';
import ProcessButton from './components/ProcessButton';
import AppHeader from './components/AppHeader';
import MainContainer from './components/MainContainer';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export default function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const updateWindowTitle = async () => {
      await getCurrentWindow().setTitle(t('app.title'));
    };
    updateWindowTitle();
  }, [t, i18n.language]);

  return (
    <>
      <MainContainer>
        <AppHeader />
        <DependencyCheck />
        <FileDropZone />
        <VideoSettings />
        <ProcessButton />
      </MainContainer>
      <Toaster />
      <FileDropOverlay />
    </>
  );
}
