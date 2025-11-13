"use client";

import Sidebar from "@/components/Sidebar";
import CanvasView from "@/components/CanvasView";
import InputBar from "@/components/InputBar";

export default function Page() {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <CanvasView />
        </div>
        <InputBar />
      </div>
    </div>
  );
}
