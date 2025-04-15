import {
  lazy,
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
} from "preact-iso";

import { ThemeProvider } from "@/components/theme-provider";

// Synchronous
import Landing from "@/pages/landing";
import NotFound from "@/pages/404";

// Asynchronous (throws a promise)
const LocateIndex = lazy(() => import("@/pages/locate/index"));
// const Profile = lazy(() => import("./routes/profile.js"));
// const NotFound = lazy(() => import("./routes/_404.js"));

export const App = () => (
  <LocationProvider>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <Route path="/" component={Landing} />
          {/* Alternative dedicated route component for better TS support */}
          <Route path="/locate" component={LocateIndex} />
          {/* <Route path="/profile/:id" component={Profile} /> */}
          {/* `default` prop indicates a fallback route. Useful for 404 pages */}
          <Route default component={NotFound} />
          {/* <NotFound default /> */}
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  </LocationProvider>
);
