import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingHeader from './FloatingHeader';
import FloatingPlayer from '../Player/FloatingPlayer';
import VoiceSearchOverlay from '../UI/VoiceSearchOverlay';

const MainLayout = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      
      {/* Absolute overlay elements for depth */}
      <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none"></div>

      <FloatingHeader />
      
      {/* Main Content Viewport */}
      <main className="absolute inset-0 pt-[100px] overflow-y-auto overflow-x-hidden custom-scrollbar pb-40 z-10 scroll-smooth">
        <Outlet />
      </main>

      <FloatingPlayer />
      <VoiceSearchOverlay />
    </div>
  );
};

export default MainLayout;
