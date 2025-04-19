import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";
import {
  FlyToInterpolator,
  LinearInterpolator,
  MapViewState,
} from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useCallback, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import { CITIES } from "@/data/cities";

const randomStarterCity = () => {
  const cities = Object.keys(CITIES);
  const randomIndex = Math.floor(Math.random() * cities.length);
  const randomCity = cities[randomIndex];
  return CITIES[randomCity as keyof typeof CITIES];
};

export default function MapLandingComponent() {
  const [initialViewState, setInitialViewState] = useState<MapViewState>(() =>
    randomStarterCity()
  );

  const [layers, setLayers] = useState<ScatterplotLayer[]>([]);

  const rotateCamera = useCallback(() => {
    setInitialViewState((viewState) => ({
      ...viewState,
      bearing: (viewState?.bearing || 0) + 12,
      zoom: (viewState?.zoom || 0) - 0.5,
      transitionDuration: 3000,
      transitionInterpolator: new LinearInterpolator(["bearing", "zoom"]),
      onTransitionEnd: () => {
        rotateCamera();
      },
    }));
  }, []);

  const flyToCity = useCallback((city: (typeof CITIES)[string]) => {
    setLayers([
      new ScatterplotLayer({
        id: "deckgl-circle",
        data: [{ position: [city.longitude, city.latitude] }],
        getPosition: (d) => d.position,
        getFillColor: [255, 0, 0, 100],
        getRadius: 500,
      }),
    ]);

    setInitialViewState({
      ...city,
      transitionInterpolator: new FlyToInterpolator({ speed: 2, curve: 1 }),
      transitionDuration: "auto",
      onTransitionEnd: () => {
        rotateCamera();

        setTimeout(() => {
          const get_random_city = () => {
            let new_city = randomStarterCity();

            while (Object.keys(city) === Object.keys(new_city)) {
              new_city = randomStarterCity();
            }
            return new_city;
          };
          flyToCity(get_random_city());
        }, 5000);
      },
    });
  }, []);

  return (
    <DeckGL
      controller
      layers={layers}
      initialViewState={initialViewState}
      onLoad={() => {
        rotateCamera();

        setTimeout(() => {
          const random_city = randomStarterCity();
          flyToCity(random_city);
        }, 5000);
      }}
    >
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
    </DeckGL>
  );
}
