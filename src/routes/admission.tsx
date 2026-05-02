import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admission")({
  component: AdmissionLayout,
});

function AdmissionLayout() {
  return <Outlet />;
}
