import { Navigate, Route, Routes } from "react-router-dom"
import { LandingPage } from "./features/website/Landing/page/landingPage"
import { ServicesPage } from "./features/website/Services/page/servicesPage"
import { ResourcesPage } from "./features/website/Resources/page/resourcesPage"
import { AboutPage } from "./features/website/AboutUs/page/aboutPage"
import { HowItsWorkPage } from "./features/website/HowItsWork/page/howPage"
import { ForgotPasswordPage, LoginPage, ProtectedRoute, RegisterPage, RoleRoute } from "./features/auth"
import { MyReportsPage, ReportDetailsPage, ReportNeedPage, ReportsPage } from "./features/reports"
import { MissingPersonsPage } from "./features/missingPersons/pages/MissingPersonsPage"
import { SheltersPage } from "./features/reliefSites/pages/SheltersPage"
import { HazardsPage } from "./features/hazards/pages/HazardsPage"
import { NotificationsPage } from "./features/notifications/pages/NotificationsPage"
import { VolunteerDashboardPage } from "./features/verification/pages/VolunteerDashboardPage"
import { NgoClaimsPage, NgoDashboardPage, NgoDeliveriesPage, NgoInventoryPage } from "./features/ngo"
import { GovernmentDashboardPage } from "./features/government"
import { AdminDashboardPage } from "./features/admin"
import { AdminReportsPage } from "./features/admin/pages/ReportsPage"
import { UsersPage as AdminUsersPage } from "./features/admin/pages/UsersPage"
import { OrganizationsPage as AdminOrganizationsPage } from "./features/admin/pages/OrganizationsPage"
import { VerificationsPage as AdminVerificationsPage } from "./features/admin/pages/VerificationsPage"
import { ClaimsPage as AdminClaimsPage } from "./features/admin/pages/ClaimsPage"
import { DeliveriesPage as AdminDeliveriesPage } from "./features/admin/pages/DeliveriesPage"
import { ReportsPage as AdminMissingPersonsPage } from "./features/admin/pages/MissingPersonsPage"
import { SheltersPage as AdminSheltersPage } from "./features/admin/pages/SheltersPage"
import { WarehousesPage as AdminWarehousesPage } from "./features/admin/pages/WarehousesPage"
import { InventoryPage as AdminInventoryPage } from "./features/admin/pages/InventoryPage"
import { DonationsPage as AdminDonationsPage } from "./features/admin/pages/DonationsPage"
import { HazardsPage as AdminHazardsPage } from "./features/admin/pages/HazardsPage"
import { AnalyticsPage as AdminAnalyticsPage } from "./features/admin/pages/AnalyticsPage"
import { AuditLogsPage as AdminAuditLogsPage } from "./features/admin/pages/AuditLogsPage"
import { SettingsPage as AdminSettingsPage } from "./features/admin/pages/SettingsPage"
import WebsiteLayout from "./features/website/Layouts/WebsiteLayout"




const App = () => {
  return (
    <Routes>

        {/* =====================================================
            WEBSITE
        ===================================================== */}
        <Route element={<WebsiteLayout />} >
        
        <Route path="/" element={<LandingPage />}/>
        <Route path="/services" element={<ServicesPage />}/>
        <Route path="/resources" element={<ResourcesPage />}/>
        <Route path="/about" element={<AboutPage />}/>
        <Route path="/how-it-works" element={<HowItsWorkPage />}/>
        <Route path="/HowItsWorks" element={<Navigate to="/how-it-works" replace />}/>
        
        </Route>

        {/* =====================================================
            AUTHENTICATION
        ===================================================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />


        {/* =====================================================
            PUBLIC MAP / REPORTS / SHELTERS
        ===================================================== */}

     

        <Route
          path="/report"
          element={<ReportNeedPage />}
        />

        <Route
          path="/reports"
          element={<ReportsPage />}
        />

        <Route
          path="/reports/:id"
          element={<ReportDetailsPage />}
        />

        <Route
          path="/missing-persons"
          element={<MissingPersonsPage />}
        />

        <Route
          path="/shelters"
          element={<SheltersPage />}
        />

        <Route
          path="/hazards"
          element={<HazardsPage />}
        />


        {/* =====================================================
            PROTECTED CITIZEN ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/my-reports"
            element={<MyReportsPage />}
          />

          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />

        </Route>


        {/* =====================================================
            VOLUNTEER
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<RoleRoute roles={['VOLUNTEER']} />}>

            <Route
              path="/volunteer/dashboard"
              element={<VolunteerDashboardPage />}
            />

            <Route
              path="/volunteer/reports/:id"
              element={<ReportDetailsPage />}
            />

            

          </Route>

        </Route>


        {/* =====================================================
            NGO
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<RoleRoute roles={['NGO']} />}>

            <Route
              path="/ngo/dashboard"
              element={<NgoDashboardPage />}
            />

            <Route
              path="/ngo/needs"
              element={<NgoDashboardPage />}
            />

            <Route
              path="/ngo/claims"
              element={<NgoClaimsPage />}
            />

            <Route
              path="/ngo/deliveries"
              element={<NgoDeliveriesPage />}
            />

            <Route
              path="/ngo/inventory"
              element={<NgoInventoryPage />}
            />

            <Route
              path="/ngo/notifications"
              element={<NotificationsPage />}
            />

            <Route
              path="/ngo/reports/:id"
              element={<ReportDetailsPage />}
            />


          </Route>

        </Route>


        {/* =====================================================
            GOVERNMENT
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<RoleRoute roles={['GOVERNMENT']} />}>

            <Route
              path="/government/dashboard"
              element={<GovernmentDashboardPage />}
            />

            <Route
              path="/government/reports"
              element={<ReportsPage />}
            />

            <Route
              path="/government/hazards"
              element={<HazardsPage />}
            />

            <Route
              path="/government/analytics"
              element={<AdminAnalyticsPage />}
            />

          </Route>

        </Route>


        {/* =====================================================
            ADMIN
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<RoleRoute roles={['ADMIN']} />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboardPage />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsersPage />}
            />

            <Route
              path="/admin/organizations"
              element={<AdminOrganizationsPage />}
            />

            <Route
              path="/admin/reports"
              element={<AdminReportsPage />}
            />

            <Route
              path="/admin/verifications"
              element={<AdminVerificationsPage />}
            />

            <Route
              path="/admin/claims"
              element={<AdminClaimsPage />}
            />

            <Route
              path="/admin/deliveries"
              element={<AdminDeliveriesPage />}
            />

            <Route
              path="/admin/missing-persons"
              element={<AdminMissingPersonsPage />}
            />

            <Route
              path="/admin/shelters"
              element={<AdminSheltersPage />}
            />

            <Route
              path="/admin/warehouses"
              element={<AdminWarehousesPage />}
            />

            <Route
              path="/admin/inventory"
              element={<AdminInventoryPage />}
            />

            <Route
              path="/admin/donations"
              element={<AdminDonationsPage />}
            />

            <Route
              path="/admin/hazards"
              element={<AdminHazardsPage />}
            />

            <Route
              path="/admin/analytics"
              element={<AdminAnalyticsPage />}
            />

            <Route
              path="/admin/audit-logs"
              element={<AdminAuditLogsPage />}
            />

            <Route
              path="/admin/settings"
              element={<AdminSettingsPage />}
            />

          </Route>

        </Route>

      </Routes>
  )
}

export default App
