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

      <div className="flex flex-col overflow-y-auto flex-1 w-full">
        <section className="relative z-10 flex flex-col items-center justify-center gap-4 p-2 w-full h-full min-h-dvh flex-1 bg-linear-to-t from-slate-950 to-slate-950/40">
          <h1 className="text-6xl font-black text-center max-w-2xl text-shadow-lg text-shadow-red-700/70">
            Best service to locate anyone around the Globe
          </h1>

          <div className="mt-2">
            <p className="text-lg">
              <span className="font-black italic">#1</span> Privacy focused
              OSINT
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
        </section>

        <section
          className="bg-slate-950 flex flex-col flex-1 justify-center items-center w-full h-full min-h-[50dvh] relative p-8"
          id="user"
        >
          <div className="prose prose-lg prose-invert text-justify">
            <h1 className="text-center">OSINT for Everyone</h1>

            <p>
              Information is power, and in today's digital age, the ability to
              locate and track individuals has become increasingly important.
              Our OSINT (Open Source Intelligence) tool is designed to help you
              harness the power of publicly available information to locate
              anyone, anywhere in the world. Whether you're a private
              investigator, a journalist, or simply someone who wants to find a
              lost friend, our tool provides you with the resources you need to
              conduct effective and efficient searches.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
