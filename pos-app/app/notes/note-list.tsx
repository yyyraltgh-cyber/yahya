"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { useGamification } from "@/components/gamification/gamification-context";
import { useTranslation } from "@/lib/i18n/locale-context";
import { awardXp, XP_REWARDS } from "@/lib/gamification";
import type { Database } from "@/lib/types/database";

type Note = Database["public"]["Tables"]["notes"]["Row"];

export function NoteList({
  initialNotes,
  userId,
}: {
  initialNotes: Note[];
  userId: string;
}) {
  const supabase = createClient();
  const { celebrate, refreshStats } = useGamification();
  const { t } = useTranslation();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Inline-edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const { data, error } = await supabase
      .from("notes")
      .insert({ user_id: userId, title: title.trim(), content })
      .select()
      .single();

    if (!error && data) {
      setNotes([data, ...notes]);
      setTitle("");
      setContent("");

      const reason = t("notes.createdReason");
      const result = await awardXp(supabase, userId, XP_REWARDS.note_create, reason, "note", data.id);
      if (result) celebrate(result, XP_REWARDS.note_create, reason);
      refreshStats();
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) return;

    const { data, error } = await supabase
      .from("notes")
      .update({ title: editTitle.trim(), content: editContent })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setNotes(notes.map((n) => (n.id === id ? data : n)));
      cancelEdit();
    }
  }

  async function deleteNote(id: string) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={addNote} className="mb-6 flex flex-col gap-2">
        <Input
          placeholder={t("notes.titlePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder={t("notes.contentPlaceholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <Button type="submit" className="self-start">
          {t("notes.saveButton")}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {notes.length === 0 && <EmptyState message={t("notes.empty")} />}
        {notes.map((note) =>
          editingId === note.id ? (
            <Card key={note.id} className="flex flex-col gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={t("notes.titlePlaceholder")}
              />
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={() => saveEdit(note.id)}>{t("common.save")}</Button>
                <Button variant="secondary" onClick={cancelEdit}>
                  {t("common.cancel")}
                </Button>
              </div>
            </Card>
          ) : (
            <Card key={note.id}>
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="font-medium">{note.title}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" onClick={() => startEdit(note)}>
                    {t("common.edit")}
                  </Button>
                  <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(note.id)}>
                    {t("common.delete")}
                  </Button>
                </div>
              </div>
              {note.content && (
                <p className="whitespace-pre-wrap text-sm text-[var(--color-text-muted)]">
                  {note.content}
                </p>
              )}
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                {formatDate(note.updated_at)}
              </p>
            </Card>
          )
        )}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteNote(pendingDeleteId);
        }}
      />
    </div>
  );
}
