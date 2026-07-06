"use client"

import * as React from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { ScrollArea } from "~/components/ui/scroll-area"
import { cn } from "~/lib/utils"

export type NotificationEntry = {
  id: string
  title: string
  description: string
  createdAt: string
  read: boolean
}

const SEED: NotificationEntry[] = [
  {
    id: "1",
    title: "Fee payment due",
    description: "Term 2 fees for Grade 8 are due next Friday.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
  },
  {
    id: "2",
    title: "Staff meeting",
    description: "Department heads — Thursday 3:00 PM in conference room A.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: "3",
    title: "Report cards published",
    description: "Mid-term reports are now visible to parents.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
  },
]

function formatRelative(iso: string) {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function HeaderNotifications() {
  const [items, setItems] = React.useState(SEED)

  const unread = items.filter((n) => !n.read).length

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-lg"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="bg-primary text-primary-foreground absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 gap-0 overflow-hidden p-0"
      >
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          {unread > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-auto px-2 py-1 text-xs"
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          ) : null}
        </div>
        <ScrollArea className="h-[min(320px,50vh)]">
          <ul className="flex flex-col">
            {items.map((n) => (
              <li key={n.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "hover:bg-muted/60 flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors",
                    !n.read && "bg-muted/30"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        n.read ? "bg-transparent" : "bg-primary"
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">
                        {n.title}
                      </p>
                      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                        {n.description}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        {formatRelative(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="border-t px-2 py-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
