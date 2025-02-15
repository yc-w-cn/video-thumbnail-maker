import FileDropOverlay from './components/FileDropOverlay';
import DependencyCheck from './components/DependencyCheck';
import { Toaster } from './components/ui/toaster';
import FileDropZone from './components/FileDropZone';
import VideoSettings from './components/VideoSettings';
import ProcessButton from './components/ProcessButton';
import AppHeader from './components/AppHeader';
import MainContainer from './components/MainContainer';

export default function App() {
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
