import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";
import {
  FlyToInterpolator,
  LinearInterpolator,
  MapViewState,
} from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useCallback, useEffect, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const CITIES: { [name: string]: MapViewState } = {
  SF: {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
  },
  NYC: {
    longitude: -74.0,
    latitude: 40.7,
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
  },
};

export default function MapComponent() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [initialViewState, setInitialViewState] = useState<MapViewState>(
    CITIES.SF
  );

  const layers = [
    new ScatterplotLayer({
      id: "deckgl-circle",
      data: [{ position: [CITIES.NYC.longitude, CITIES.NYC.latitude] }],
      getPosition: (d) => d.position,
      getFillColor: [255, 0, 0, 100],
      getRadius: 50,
    }),
  ];

  const rotateCamera = useCallback(() => {
    setInitialViewState((viewState) => ({
      ...viewState,
      bearing: (viewState?.bearing || 0) + 12,
      transitionDuration: 3000,
      transitionInterpolator: new LinearInterpolator(["bearing"]),
      onTransitionEnd: (t) => {
        t.end();
      },
    }));
  }, []);

  const flyToCity = useCallback(() => {
    setInitialViewState({
      ...CITIES.NYC,
      transitionInterpolator: new FlyToInterpolator({ speed: 2, curve: 1 }),
      transitionDuration: "auto",
      onTransitionEnd: () => {
        rotateCamera();
        setIsTransitioning(false);
      },
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsTransitioning(true);
      flyToCity();
    }, 3000);
  }, []);

  return (
    <DeckGL controller layers={layers} initialViewState={initialViewState}>
      <Map
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        onLoad={(event) => {
          const map = event.target;

          const firstLabelLayerId = event.target
            .getStyle()
            ?.layers?.find((layer) => layer?.type === "symbol")?.id;

          map.removeLayer("building");
          map.removeLayer("building-top");
          map.addLayer(
            {
              id: "3d-buildings",
              source: "carto",
              "source-layer": "building",
              type: "fill-extrusion",
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#aaa",

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "render_height"],
                ],
                "fill-extrusion-base": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "render_min_height"],
                ],
                "fill-extrusion-opacity": 0.6,
              },
            },
            firstLabelLayerId
          );
        }}
      />

      <Button
        className={cn(
          "absolute block bottom-1.5 left-1/2 -translate-x-1/2",
          !isTransitioning && "hidden"
        )}
        variant="outline"
        onClick={flyToCity}
      >
        continue
      </Button>
    </DeckGL>
  );
}
