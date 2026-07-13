"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";

type ActionState = {
  success: boolean;
  error?: string;
};

const defaultActionState: ActionState = {
  success: false,
};

const parseParentIds = (formData: FormData) => {
  const contactId = String(formData.get("contactId") ?? "").trim();
  const dealId = String(formData.get("dealId") ?? "").trim();

  return { contactId, dealId };
};

export async function createNote(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const body = String(formData.get("body") ?? "").trim();
    const { contactId, dealId } = parseParentIds(formData);

    if (!body) {
      return { success: false, error: "Note body is required." };
    }

    const hasContactParent = Boolean(contactId);
    const hasDealParent = Boolean(dealId);

    if (hasContactParent === hasDealParent) {
      return { success: false, error: "Choose one note parent." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to add a note." };
    }

    if (hasContactParent) {
      const { data: existingContact, error: existingContactError } = await supabase
        .from("contacts")
        .select("id")
        .eq("id", contactId)
        .eq("user_id", user.id)
        .single();

      if (existingContactError || !existingContact) {
        return { success: false, error: "Contact not found." };
      }
    }

    if (hasDealParent) {
      const { data: existingDeal, error: existingDealError } = await supabase
        .from("deals")
        .select("id")
        .eq("id", dealId)
        .eq("user_id", user.id)
        .single();

      if (existingDealError || !existingDeal) {
        return { success: false, error: "Deal not found." };
      }
    }

    const { error: insertError } = await supabase.from("notes").insert({
      user_id: user.id,
      contact_id: contactId || null,
      deal_id: dealId || null,
      body,
    });

    if (insertError) {
      return { success: false, error: "Could not add note." };
    }

    revalidatePath(contactId ? `/contacts/${contactId}` : `/deals/${dealId}`);

    return { success: true };
  } catch (error) {
    console.error("[actions/notes]", error);
    return defaultActionState;
  }
}

export async function deleteNote(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const noteId = String(formData.get("noteId") ?? "").trim();

    if (!noteId) {
      return { success: false, error: "Note not found." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to delete this note." };
    }

    const { data: existingNote, error: existingNoteError } = await supabase
      .from("notes")
      .select("id, contact_id, deal_id")
      .eq("id", noteId)
      .eq("user_id", user.id)
      .single();

    if (existingNoteError || !existingNote) {
      return { success: false, error: "Note not found." };
    }

    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", user.id);

    if (deleteError) {
      return { success: false, error: "Could not delete note." };
    }

    revalidatePath(
      existingNote.contact_id ? `/contacts/${existingNote.contact_id}` : `/deals/${existingNote.deal_id}`,
    );

    return { success: true };
  } catch (error) {
    console.error("[actions/notes]", error);
    return defaultActionState;
  }
}