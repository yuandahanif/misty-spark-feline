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

export const Route = createFileRoute("/locate/")({
  component: LocateIndex,
});

function LocateIndex() {
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="default"
                  className="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <span className="text-sm">New Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="z-[1001] w-4xl!">
                <DialogHeader>
                  <DialogTitle>New Search</DialogTitle>
                  <DialogDescription>-</DialogDescription>
                  <CreateForm />
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
