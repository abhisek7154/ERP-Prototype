import type { NavCategory } from "~/app/(dashboard)/_components/nav-main"

import {
  LayoutDashboard,
  FileBarChart,
  Layers,
  ClipboardList,
  Users,
  Wallet,
  Shield,
  User,
  Settings2,
} from "lucide-react"

export const sidebarNavCategories: NavCategory[] = [
  {
    label: "Dashboard",
    accentDot: "bg-violet-500",
    menus: [
      {
        title: "Overview",
        url: "/dashboard/overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: "Reports",
        url: "/dashboard/reports/academic",
        icon: FileBarChart,
      },
    ],
  },

  {
    label: "Academics",
    accentDot: "bg-emerald-500",
    menus: [
      {
        title: "Classes / Sections",
        url: "/dashboard/academics/classes",
        icon: Layers,
      },
      {
        title: "Attendance",
        url: "/dashboard/academics/attendance",
        icon: ClipboardList,
      },
    ],
  },

  {
    label: "People",
    accentDot: "bg-blue-500",
    menus: [
      {
        title: "Students",
        url: "/dashboard/people/students",
        icon: Users,
      },
    ],
  },

  {
    label: "Operations",
    accentDot: "bg-orange-500",
    menus: [
      {
        title: "Finance",
        url: "/dashboard/operations/finance",
        icon: Wallet,
      },
    ],
  },

  {
    label: "Administration",
    accentDot: "bg-zinc-400",
    menus: [
      {
        title: "Users & Access",
        url: "/dashboard/admin/users-access/users",
        icon: Shield,
      },
    ],
  },
]

export const sidebarSecondaryNav = [
  {
    title: "Profile",
    url: "/profile",
    icon: <User className="size-4" />,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings2 className="size-4" />,
  },
]