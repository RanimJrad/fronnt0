import { Card } from "@/components/ui/card";

import { StatsCards } from "../components/stats-cards";
import { DashboardCharts } from "../components/dashboard-charts";
import { TeamLeads } from "../components/team-leads";
import { TodayActivities } from "../components/today-activities";
import { RecentActivities } from "../components/recent-activities";
import { UpcomingLeaves } from "../components/upcoming-leaves";
import { WelcomeBanner } from "../components/recruteur/welcome-banner_rec";
import { QuickActions } from "../components/quick-actions";
import { DashboardSidebarRec } from "../components/recruteur/dashboard-sidebar_rec";
import { DashboardHeaderRec } from "../components/recruteur/dashboard-header_rec";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeaderRec />
      <div className="container mx-auto p-4 md:p-6 lg:p-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Sidebar - visible on desktop, hidden on mobile (handled by MobileSidebarRec) */}
          <div className="hidden md:block md:col-span-1 lg:col-span-1">
            <div className="sticky top-20">
              <DashboardSidebarRec />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-5 lg:col-span-5 space-y-6">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Quick Actions */}
            <QuickActions />

            <Card className="p-0 overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-full">
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Statistiques des postes
                  </h3>
                </div>
                <div
                  className="relative w-full"
                  style={{ height: "600px", pointerEvents: "none" }}
                >
                  <iframe title="pfe" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=07b9701e-cafb-4d30-aff9-836fb80aca73&autoAuth=true&ctid=dbd6664d-4eb9-46eb-99d8-5c43ba153c61" frameBorder="0" allowFullScreen={true}></iframe>
                  {/* Overlay transparent pour empêcher le redimensionnement */}
                  <div className="absolute inset-0 z-10 bg-transparent"></div>
                </div>
              </div>
            </Card>
            {/* Stats Cards */}
            <div className="grid gap-6">
              <StatsCards />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <DashboardCharts />
              </Card>
            </div>

            {/* Team and Activities Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TeamLeads />
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TodayActivities />
              </Card>
            </div>

            {/* Recent Activities and Leaves */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <RecentActivities />
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <UpcomingLeaves />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
