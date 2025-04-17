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

import MapComponent from "@/components/map/Map";

// import "leaflet/dist/leaflet.css";
// import "@/assets/leaflet-dark.css";
// import "leaflet/dist/leaflet.js";

// import { OSMBuildings } from "@/lib/OSMBuildings-Leaflet";

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
          <header className="fixed top-1 left-1 bg-sidebar text-sidebar-foreground p-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="cursor-pointer">
                  <span className="text-sm">Locate</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </header>

          <section className="grid max-h-dvh w-full flex-1">
            <MapComponent />
            {/* <MapContainer
              center={[52.51836, 13.40438]}
              zoom={16}
              scrollWheelZoom={true}
              className="relative"
            >
            </MapContainer> */}
          </section>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
