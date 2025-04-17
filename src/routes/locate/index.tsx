import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import MapComponent from "@/components/map/Map";
import CreateForm from "@/components/locate/create-form";
import { useSystemFlowStore } from "@/contexts/system";
import { useState } from "react";
import { FileWithPreview } from "@/types/FileWithPreview";

export const Route = createFileRoute("/locate/")({
  component: LocateIndex,
});

function LocateIndex() {
  const systemFlow = useSystemFlowStore((state) => state.user_flow_stage);
  const setStage = useSystemFlowStore((state) => state.set_stage);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = (files: FileWithPreview) => {
    setStage("waiting_for_result");
    setIsDialogOpen(false);

    // TODO: handle file upload
    console.log("Files to upload:", files);

    // Simulate a delay for the result
    setTimeout(() => {
      setStage("displaying_result");
    }, files.length * 2000);
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="relative flex flex-1 flex-col gap-4 p-1">
          <section
            className="grid max-h-dvh w-full flex-1"
            onContextMenu={(e) => e.preventDefault()}
          >
            <MapComponent />
          </section>

          <header className="fixed z-[1000] top-1 left-1 text-sidebar-foreground p-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="default"
                  disabled={systemFlow == "waiting_for_result"}
                  className="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <span className="text-sm">New Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="z-[1001] w-4xl!">
                <DialogHeader>
                  <DialogTitle>New Search</DialogTitle>
                  <DialogDescription>-</DialogDescription>
                  <CreateForm onSubmit={onSubmit} />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </header>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
