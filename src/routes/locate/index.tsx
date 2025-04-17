import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
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

import { OSMBuildings } from "@/lib/OSMBuildings-Leaflet";

import MapComponent from "@/components/map/Map";
import CreateForm from "@/components/locate/create-form";

export const Route = createFileRoute("/locate/")({
  component: LocateIndex,
});

// function MapComponent() {
//   const map = useMap();
//   useEffect(() => {
//     const osmb = new OSMBuildings(map).load(
//       "https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json"
//     );
//     console.log(" useLayoutEffect ~ osmb:", osmb);
//   }, []);

//   return (
//     <TileLayer
//       className="relative"
//       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//     />
//   );
// }

function LocateIndex() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="relative flex flex-1 flex-col gap-4 p-1">
          <section className="grid max-h-dvh w-full flex-1">
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
