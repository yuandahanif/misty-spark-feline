import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import MapLandingComponent from "@/components/map/map-landing";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <main className="flex relative min-h-dvh flex-col items-center justify-center">
      <div className="absolute w-[99%] h-[98%]">
        <MapLandingComponent />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 p-2 w-full h-full flex-1 bg-linear-to-t from-slate-950 to-slate-950/40">
        <h1 className="text-6xl font-black text-center max-w-2xl text-shadow-lg text-shadow-red-700/70">
          Best service to locate anyone around the Globe
        </h1>

        <div className="max-w-prose mt-2">
          <p className="text-lg">
            <span className="font-black italic">#1</span> Privacy focused OSINT
          </p>
        </div>

        <Button
          variant="outline"
          type="button"
          className="mt-4 cursor-pointer"
          size="lg"
        >
          <Link to="/locate">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
