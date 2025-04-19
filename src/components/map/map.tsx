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
import { useQuery } from "@tanstack/react-query";
import { CITIES, VIEWPOINT_DEFAULT } from "@/data/cities";

const randomStarterCity = () => {
  const cities = Object.keys(CITIES);
  const randomIndex = Math.floor(Math.random() * cities.length);
  const randomCity = cities[randomIndex];
  return CITIES[randomCity as keyof typeof CITIES];
};

export default function MapComponent() {
  const systemFlow = useSystemFlowStore((state) => state.user_flow_stage);
  const processId = useSystemFlowStore((state) => state.process_id);
  const setSystemFlow = useSystemFlowStore((state) => state.set_stage);
  const setProcessId = useSystemFlowStore((state) => state.set_process_id);

  const resultQuery = useQuery({
    queryKey: ["geo_result"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/getresult/${processId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return await response.text();
      } catch (error) {
        console.error("Error fetching result:", error);
        // setSystemFlow("waiting_for_input");
        // setProcessId(undefined);
        return null;
      }
    },
    enabled: processId !== undefined,
    // Refetch the data every second
    refetchInterval: 2000,
  });

  const [temeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);
  const [result, setResult] = useState<{
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    confidence: number;
    reasoning: string;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [initialViewState, setInitialViewState] = useState<MapViewState>(() =>
    randomStarterCity()
  );

  const [layers, setLayers] = useState<ScatterplotLayer[]>([]);

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
        transitionDuration: 10000,
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
    try {
      if (resultQuery.isSuccess) {
        let result_text = resultQuery.data;
        if (result_text == "None") return;

        result_text = result_text.replace(/```json/g, "");
        result_text = result_text.replace(/```/g, "");

        console.log("result_text", result_text);

        const data = JSON.parse(result_text);
        const city = data.city;
        const country = data.country;
        const latitude = data.latitude;
        const longitude = data.longitude;
        const confidence = data.confidence;
        const reasoning = data.reasoning;

        setResult({
          city,
          country,
          latitude,
          longitude,
          confidence,
          reasoning,
        });

        setSystemFlow("displaying_result");
        setProcessId(undefined);
      }
    } catch (error) {
      console.error("Error parsing result:", error);
    }
  }, [resultQuery.data, resultQuery.isSuccess]);

  useEffect(() => {
    const loop_until_result = () => {
      if (systemFlow === "displaying_result" && result) {
        temeoutIds.forEach((id) => {
          clearTimeout(id);
        });
        setTimeoutIds([]);

        // TODO: set to result city
        setLayers([
          new ScatterplotLayer({
            id: "deckgl-circle",
            data: [{ position: [result.longitude, result.latitude] }],
            getPosition: (d) => d.position,
            getFillColor: [255, 0, 0, 100],
            getRadius: 50,
          }),
        ]);
        return flyToCity({
          latitude: result.latitude,
          longitude: result.longitude,
          ...VIEWPOINT_DEFAULT,
        });
      }

      const t_id = setTimeout(() => {
        const random_city = randomStarterCity();
        flyToCity(random_city);
        loop_until_result();
      }, 16000);

      setTimeoutIds((s) => [...s, t_id]);
    };

    loop_until_result();
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
        onClick={() =>
          result &&
          flyToCity({
            latitude: result.latitude,
            longitude: result.longitude,
            ...VIEWPOINT_DEFAULT,
          })
        }
      >
        continue
      </Button>
    </DeckGL>
  );
}
