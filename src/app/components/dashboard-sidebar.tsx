import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, Building2, Calendar, Briefcase, Star, BarChart, Settings, UserCircle, LogOut } from "lucide-react"

const menuItems = [
  { icon: <Home className="h-4 w-4" />, label: "Dashboard", href: "/dashbord" },
  { icon: <Users className="h-4 w-4" />, label: "Employees", href: "/employees" },
  { icon: <Building2 className="h-4 w-4" />, label: "Archive", href: "/archive" },
  { icon: <Calendar className="h-4 w-4" />, label: "Calendar", href: "/calendar" },
  { icon: <Briefcase className="h-4 w-4" />, label: "Leave", href: "/leave" },
  { icon: <Star className="h-4 w-4" />, label: "Reviews", href: "/reviews" },
  { icon: <BarChart className="h-4 w-4" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-4 w-4" />, label: "Settings", href: "/settings" },
  { icon: <UserCircle className="h-4 w-4" />, label: "Profile", href: "/profile" },
]

export function DashboardSidebar() {
  return (
    <div className="flex flex-col h-full space-y-4 bg-white">
      <div className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
            <Link href={item.href}>
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
      <a href="/">
      <Button variant="ghost" className="w-full justify-start text-red-500">
        <LogOut className="h-4 w-4" />
        <span className="ml-2">Logout</span>
      </Button>
      </a>
    </div>
  )
}

