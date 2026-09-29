import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useScrollOnRouteChange } from "@/hooks/useScrollOnRouteChange";
import AboutPage from "./pages/About";
import BasicEducationPage from "./pages/BasicEducation";
import PostPrimaryPage from "./pages/PostPrimary";
import VETPage from "./pages/VET";
import FODEPage from "./pages/FODE";
import ContactPage from "./pages/Contact";
import SelectionsPage from "./pages/Selections";
import NewsPage from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import NoticesPage from "./pages/Notices";
import DistrictsPage from "./pages/Districts";
import DistrictDetailPage from "./pages/DistrictDetail";
import SchoolDetailPage from "./pages/SchoolDetail";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import AccessibilityPage from "./pages/Accessibility";
import DownloadsPage from "./pages/Downloads";
import CalendarPage from "./pages/Calendar";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFound";
import { api } from "@/lib/api";
import AdminLayout from "@/admin/AdminLayout";
import Login from "@/admin/pages/Login";
import Dashboard from "@/admin/pages/Dashboard";
import HeroManager from "@/admin/pages/HeroManager";
import NewsManager from "@/admin/pages/NewsManager";
import NoticesManager from "@/admin/pages/NoticesManager";
import EventsManager from "@/admin/pages/EventsManager";
import ProgramsManager from "@/admin/pages/ProgramsManager";
import StatsManager from "@/admin/pages/StatsManager";
import DistrictsManager from "@/admin/pages/DistrictsManager";
import SchoolsManager from "@/admin/pages/SchoolsManager";
import LeadershipManager from "@/admin/pages/LeadershipManager";
import SelectionsManager from "@/admin/pages/SelectionsManager";
import BasicEducationManager from "@/admin/pages/BasicEducationManager";
import PostPrimaryManager from "@/admin/pages/PostPrimaryManager";
import VETManager from "@/admin/pages/VETManager";
import FODEManager from "@/admin/pages/FODEManager";
import HomeManager from "@/admin/pages/HomeManager";
import MessagesManager from "@/admin/pages/MessagesManager";
import WhatsAppSubscribersManager from "@/admin/pages/WhatsAppSubscribersManager";
import SettingsManager from "@/admin/pages/SettingsManager";
import { QuickLinksManager, PartnersManager, DownloadsManager } from "@/admin/pages/SimpleManagers";

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!api.isAuthed()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { pathname } = useLocation();
  // The admin area has its own layout and is owned by the admin surface, so the
  // public skip link stays out of it.
  const isAdmin = pathname.startsWith("/admin");

  // Reset to the top on a new route, or jump to the fragment the link named.
  // Extracted so it can be tested without mounting the whole route table.
  useScrollOnRouteChange(isAdmin);

  return (
    <>
      {!isAdmin && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:inline-block focus:bg-[#0B2545] focus:text-white focus:px-5 focus:py-3 focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
      )}
      {/* Keyed on the path so React remounts the tree and the entry animation
          replays on every navigation; without the key the wrapper would be
          reused and the animation would run only on the first page. The admin
          area gets no transition: a data-dense editing surface gains nothing
          from one, and fading tables in makes them harder to scan. */}
      <div key={pathname} className={isAdmin ? undefined : "page-enter"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/basic" element={<BasicEducationPage />} />
          <Route path="/post" element={<PostPrimaryPage />} />
          <Route path="/vet" element={<VETPage />} />
          <Route path="/fode" element={<FODEPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/districts" element={<DistrictsPage />} />
          <Route path="/districts/:id" element={<DistrictDetailPage />} />
          <Route path="/schools/:id" element={<SchoolDetailPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/selections" element={<SelectionsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/notices" element={<NoticesPage />} />

          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="notices" element={<NoticesManager />} />
            <Route path="events" element={<EventsManager />} />
            <Route path="programs" element={<ProgramsManager />} />
            <Route path="stats" element={<StatsManager />} />
            <Route path="districts" element={<DistrictsManager />} />
            <Route path="schools" element={<SchoolsManager />} />
            <Route path="leadership" element={<LeadershipManager />} />
            <Route path="selections" element={<SelectionsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="whatsapp-subscribers" element={<WhatsAppSubscribersManager />} />
            <Route path="quicklinks" element={<QuickLinksManager />} />
            <Route path="partners" element={<PartnersManager />} />
            <Route path="downloads" element={<DownloadsManager />} />
            {/* Grouped page managers. Each matches a link in the admin sidebar, so
                a missing route here silently sends the admin to the 404 page. */}
            <Route path="home" element={<HomeManager />} />
            <Route path="basic-education" element={<BasicEducationManager />} />
            <Route path="post-primary" element={<PostPrimaryManager />} />
            <Route path="vet" element={<VETManager />} />
            <Route path="fode" element={<FODEManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}
