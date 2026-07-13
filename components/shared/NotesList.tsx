"use client";

import { useActionState } from "react";
import { deleteNote } from "@/actions/notes";

type Note = {
  id: string;
  body: string;
  createdAt: string;
};

type Props = {
  notes: Note[];
};

type ActionState = Awaited<ReturnType<typeof deleteNote>>;

const initialState: ActionState = {
  success: false,
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function NoteItem({ note }: { note: Note }) {
  const [state, formAction, pending] = useActionState(deleteNote, initialState);

  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">{note.body}</p>
          <p className="text-xs text-text-muted">{dateFormatter.format(new Date(note.createdAt))}</p>
        </div>

        <form
          action={formAction}
          onSubmit={(event) => {
            if (!window.confirm("Delete this note?")) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="noteId" value={note.id} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>

      {state.error ? <p className="mt-2 text-xs text-error">{state.error}</p> : null}
    </article>
  );
}

export function NotesList({ notes }: Props) {
  if (notes.length === 0) {
    return <p className="text-sm text-text-muted">No notes yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}