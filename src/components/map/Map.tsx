import DeckGL from "@deck.gl/react";
import { Map, useControl } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DeckProps, FlyToInterpolator, MapViewState } from "@deck.gl/core";
import { useCallback, useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

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
  const [initialViewState, setInitialViewState] = useState<MapViewState>(
    CITIES.SF
  );

  const flyToCity = useCallback(() => {
    setInitialViewState({
      ...CITIES.NYC,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flyToCity();
    }, 2000);
  }, []);

  return (
    <DeckGL controller initialViewState={initialViewState}>
      <Map
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
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
    </DeckGL>
  );
}
