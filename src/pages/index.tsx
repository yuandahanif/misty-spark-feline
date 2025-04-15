import {
  lazy,
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
} from "preact-iso";

// Synchronous
import Landing from "./landing";

// Asynchronous (throws a promise)
// const Profiles = lazy(() => import("./routes/profiles.js"));
// const Profile = lazy(() => import("./routes/profile.js"));
// const NotFound = lazy(() => import("./routes/_404.js"));

export const App = () => (
  <LocationProvider>
    <ErrorBoundary>
      <Router>
        <Route path="/" component={Landing} />
        {/* Alternative dedicated route component for better TS support */}
        {/* <Route path="/profiles" component={Profiles} /> */}
        {/* <Route path="/profile/:id" component={Profile} /> */}
        {/* `default` prop indicates a fallback route. Useful for 404 pages */}
        <Route default component={Landing} />
        {/* <NotFound default /> */}
      </Router>
    </ErrorBoundary>
  </LocationProvider>
);
