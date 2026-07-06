import type { LucideIcon } from "lucide-react"
import {
  Award,
  Briefcase,
  Bus,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  Library,
  LineChart,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react"

/**
 * Registry of Lucide icons by stable string key (e.g. for config-driven UI).
 */
export const icons = {
  layoutDashboard: LayoutDashboard,
  lineChart: LineChart,
  fileBarChart: FileBarChart,
  clipboardList: ClipboardList,
  award: Award,
  users: Users,
  usersRound: UsersRound,
  briefcase: Briefcase,
  wallet: Wallet,
  bus: Bus,
  library: Library,
} as const satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons

export function getIcon(name: IconName): LucideIcon {
  return icons[name]
}

export function isIconName(name: string): name is IconName {
  return name in icons
}
