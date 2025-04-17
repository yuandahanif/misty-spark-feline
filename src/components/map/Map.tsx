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
import { useSystemFlowStore } from "@/contexts/system";

const VIEWPOINT_DEFAULT = {
  zoom: 15.5,
  pitch: 45,
  bearing: -17.6,
};

const CITIES: { [name: string]: MapViewState } = {
  SF: {
    longitude: -122.4,
    latitude: 37.8,
    ...VIEWPOINT_DEFAULT,
  },
  NYC: {
    longitude: -74.0,
    latitude: 40.7,
    ...VIEWPOINT_DEFAULT,
  },

  // Southeast Asian cities
  BKK: {
    // Bangkok, Thailand
    longitude: 100.5018,
    latitude: 13.7563,
    ...VIEWPOINT_DEFAULT,
  },
  SIN: {
    // Singapore
    longitude: 103.8198,
    latitude: 1.3521,
    ...VIEWPOINT_DEFAULT,
  },
  JKT: {
    // Jakarta, Indonesia
    longitude: 106.865,
    latitude: -6.1751,
    ...VIEWPOINT_DEFAULT,
  },
  KUL: {
    // Kuala Lumpur, Malaysia
    longitude: 101.6869,
    latitude: 3.139,
    ...VIEWPOINT_DEFAULT,
  },
  MNL: {
    // Manila, Philippines
    longitude: 120.9842,
    latitude: 14.5995,
    ...VIEWPOINT_DEFAULT,
  },
  HCMC: {
    // Ho Chi Minh City, Vietnam
    longitude: 106.6297,
    latitude: 10.8231,
    ...VIEWPOINT_DEFAULT,
  },
  HAN: {
    // Hanoi, Vietnam
    longitude: 105.8342,
    latitude: 21.0278,
    ...VIEWPOINT_DEFAULT,
  },
  PNH: {
    // Phnom Penh, Cambodia
    longitude: 104.916,
    latitude: 11.5564,
    ...VIEWPOINT_DEFAULT,
  },
  RGN: {
    // Yangon, Myanmar
    longitude: 96.1951,
    latitude: 16.8409,
    ...VIEWPOINT_DEFAULT,
  },
  VTE: {
    // Vientiane, Laos
    longitude: 102.6331,
    latitude: 17.9757,
    ...VIEWPOINT_DEFAULT,
  },
  DPS: {
    // Denpasar, Bali, Indonesia
    longitude: 115.2126,
    latitude: -8.6705,
    ...VIEWPOINT_DEFAULT,
  },
  BWN: {
    // Bandar Seri Begawan, Brunei
    longitude: 114.9403,
    latitude: 4.9031,
    ...VIEWPOINT_DEFAULT,
  },
};

const randomStarterCity = () => {
  const cities = Object.keys(CITIES);
  const randomIndex = Math.floor(Math.random() * cities.length);
  const randomCity = cities[randomIndex];
  return CITIES[randomCity as keyof typeof CITIES];
};

type Props = {
  targetCity?: MapViewState;
};

export default function MapComponent({ targetCity: props_targetCity }: Props) {
  const systemFlow = useSystemFlowStore((state) => state.user_flow_stage);

  const [temeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);
  const [targetCity, setTargetCity] = useState<MapViewState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [initialViewState, setInitialViewState] = useState<MapViewState>(() =>
    randomStarterCity()
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
      onTransitionEnd: () => {
        rotateCamera();
      },
    }));
  }, []);

  const flyToCity = useCallback(
    (city: (typeof CITIES)[string], onTransitionEnd?: () => void) => {
      setInitialViewState({
        ...city,
        transitionInterpolator: new FlyToInterpolator({ speed: 2, curve: 1 }),
        transitionDuration: 6000,
        onTransitionEnd: () => {
          rotateCamera();
          if (onTransitionEnd) return onTransitionEnd();
          setIsTransitioning(false);
        },
      });
    },
    []
  );

  useEffect(() => {
    const loop_until_result = () => {
      if (systemFlow === "displaying_result") {
        temeoutIds.forEach((id) => {
          clearTimeout(id);
        });
        setTimeoutIds([]);
        // TODO: set to result city
        return flyToCity(CITIES.NYC);
      }

      const t_id = setTimeout(() => {
        const random_city = randomStarterCity();
        flyToCity(random_city);
        loop_until_result();
      }, 10000);

      setTimeoutIds((s) => [...s, t_id]);
    };

    loop_until_result();

    return () => {
      temeoutIds.forEach((id) => {
        clearTimeout(id);
      });
      setTimeoutIds([]);
    };
  }, [systemFlow]);

  return (
    <DeckGL
      controller
      layers={layers}
      initialViewState={initialViewState}
      onLoad={() => {
        rotateCamera();
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

      <Button
        className={cn(
          "absolute block bottom-1.5 left-1/2 -translate-x-1/2",
          !isTransitioning && "hidden"
        )}
        variant="outline"
        onClick={() => targetCity && flyToCity(targetCity)}
      >
        continue
      </Button>
    </DeckGL>
  );
}
