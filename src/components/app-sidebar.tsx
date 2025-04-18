import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  AngryIcon,
  FrownIcon,
  MehIcon,
  SmileIcon,
  SmilePlusIcon,
} from "lucide-react";
import { useSystemFlowStore } from "@/contexts/system";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const systemFlow = useSystemFlowStore((state) => state.user_flow_stage);

  return (
    <Sidebar {...props} collapsible="none" className="h-dvh flex flex-col">
      <SidebarContent>
        <SidebarGroup className="flex flex-col h-full">
          <div
            className={
              "grid grid-cols-2 grid-flow-row-dense h-auto w-full gap-1 gap-y-3 content-start justify-items-center"
            }
          >
            <h1 className="text-xl font-bold text-center col-span-2">Result</h1>

            {systemFlow === "displaying_result" && (
              <>
                <Carousel className="w-full max-w-xs col-span-2">
                  <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <span className="text-4xl font-semibold">
                                Image {index + 1}
                              </span>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                <Card className="justify-self-stretch text-base">
                  <CardContent className="space-y-2">
                    <p className="font-bold">
                      <span className="block text-sm font-semibold text-muted-foreground">
                        Latitude:
                      </span>
                      40.7
                    </p>
                    <p className="font-bold">
                      <span className="block text-sm font-semibold text-muted-foreground">
                        Longitude:
                      </span>
                      -74.0
                    </p>
                  </CardContent>
                </Card>

                <Card className="justify-self-stretch text-base">
                  <CardContent className="space-y-2">
                    <p className="font-bold">
                      <span className="block text-sm font-semibold text-muted-foreground">
                        Country:
                      </span>
                      United States
                    </p>
                    <p className="font-bold">
                      <span className="block text-sm font-semibold text-muted-foreground">
                        City:
                      </span>
                      new york
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {systemFlow !== "displaying_result" && (
            <div className="flex flex-col items-center justify-center col-span-2 px-5 text-center h-full">
              <p className="text-sm font-semibold text-muted-foreground col-span-2">
                Result will be displayed here. Please start a new search in the
                left corner button.
              </p>
            </div>
          )}

          <Card
            className={cn(
              "justify-self-stretch h-fit mt-auto",
              systemFlow !== "displaying_result" &&
                "opacity-0 pointer-events-none"
            )}
          >
            <CardHeader>
              <CardTitle>Result Rating:</CardTitle>
              <CardDescription>Please rate your experience</CardDescription>
            </CardHeader>

            <CardContent className="flex items-center justify-center space-x-2">
              <Button variant="outline" className="cursor-pointer" size="lg">
                <AngryIcon className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="cursor-pointer" size="lg">
                <FrownIcon className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="cursor-pointer" size="lg">
                <MehIcon className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="cursor-pointer" size="lg">
                <SmileIcon className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="cursor-pointer" size="lg">
                <SmilePlusIcon className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
