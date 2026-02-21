import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { BrowserRouter, Route, Routes, Outlet } from "react-router";

import "./App.css";

import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import { Layout } from "./components/refine-ui/layout/layout";

import { LayoutDashboard, Users } from "lucide-react";

// Pages
import Dashboard from "@/pages/dashboard";
import MembersList from "@/pages/members/list";
import CreateMember from "@/pages/members/create";
import MemberDetails from "@/pages/members/show";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "5kDNde-69tDff-FpkTE6",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Dashboard",
                    icon: <LayoutDashboard />,
                  },
                },
                {
                  name: "members",
                  list: "/members",
                  create: "/members/new",
                  edit: "/members/:id/edit",
                  show: "/members/:id",
                  meta: {
                    label: "Members",
                    icon: <Users />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="/" element={<Dashboard />} />
                  <Route path="members">
                    <Route index element={<MembersList />} />
                    <Route path="create" element={<CreateMember />} />
                    <Route path="show/:id" element={<MemberDetails />} />
                  </Route>
                </Route>
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>

            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;