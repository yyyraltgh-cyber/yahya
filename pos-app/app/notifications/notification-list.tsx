"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { Notification } from "@/lib/types/database";

const KIND_KEY = {
  info: "notifications.kinds.info",
  reminder: "notifications.kinds.reminder",
  review: "notifications.kinds.review",
  system: "notifications.kinds.system",
} as const;

export function NotificationList({
  initialNotifications,
}: {
  initialNotifications: Notification[];
}) {
  const supabase = createClient();
  const { t } = useTranslation();
  const [items, setItems] = useState<Notification[]>(initialNotifications);

  async function markRead(n: Notification) {
    if (n.read) return;
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", n.id);
    if (!error) setItems(items.map((i) => (i.id === n.id ? { ...i, read: true } : i)));
  }

  async function markAllRead() {
    const unread = items.filter((i) => !i.read).map((i) => i.id);
    if (unread.length === 0) return;
    const { error } = await supabase.from("notifications").update({ read: true }).in("id", unread);
    if (!error) setItems(items.map((i) => ({ ...i, read: true })));
  }

  async function remove(id: string) {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (!error) setItems(items.filter((i) => i.id !== id));
  }

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">{t("notifications.unreadCount", { count: unreadCount })}</p>
        <Button variant="secondary" onClick={markAllRead} disabled={unreadCount === 0}>
          {t("notifications.markAllRead")}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 && <EmptyState message={t("notifications.empty")} />}
        {items.map((n) => (
          <Card
            key={n.id}
            onClick={() => markRead(n)}
            className={`flex cursor-pointer items-start justify-between gap-2 p-3 ${
              n.read ? "opacity-60" : ""
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                {!n.read && <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />}
                <span className="font-medium">{n.title}</span>
                <Badge>{KIND_KEY[n.kind] ? t(KIND_KEY[n.kind]) : n.kind}</Badge>
              </div>
              {n.body && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{n.body}</p>}
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{formatDateTime(n.created_at)}</p>
            </div>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                remove(n.id);
              }}
            >
              ✕
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
