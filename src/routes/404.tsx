import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  component: NotFound,
});

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
      <p>
        Go to <a href="/">home</a>
      </p>
    </div>
  );
}
