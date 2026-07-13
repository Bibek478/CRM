"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import { FREE_CONTACT_LIMIT } from "@/lib/utils";

type ActionState = {
  success: boolean;
  error?: string;
};

const defaultActionState: ActionState = {
  success: false,
};

export async function createContact(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to add a contact." };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: "Could not load your plan." };
    }

    const { count, error: countError } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      return { success: false, error: "Could not check your contact limit." };
    }

    if (profile.plan === "free" && (count ?? 0) >= FREE_CONTACT_LIMIT) {
      return {
        success: false,
        error: "Free plan limit reached. Upgrade to add more contacts.",
      };
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!name) {
      return { success: false, error: "Contact name is required." };
    }

    const { error: insertError } = await supabase.from("contacts").insert({
      user_id: user.id,
      name,
      email: email || null,
      company: company || null,
      phone: phone || null,
    });

    if (insertError) {
      return { success: false, error: "Could not create contact." };
    }

    revalidatePath("/contacts");

    return { success: true };
  } catch (error) {
    console.error("[actions/contacts]", error);
    return defaultActionState;
  }
}

export async function updateContact(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const contactId = String(formData.get("contactId") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!contactId) {
      return { success: false, error: "Contact not found." };
    }

    if (!name) {
      return { success: false, error: "Contact name is required." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to update this contact." };
    }

    const { data: existingContact, error: existingContactError } = await supabase
      .from("contacts")
      .select("id")
      .eq("id", contactId)
      .eq("user_id", user.id)
      .single();

    if (existingContactError || !existingContact) {
      return { success: false, error: "Contact not found." };
    }

    const { error: updateError } = await supabase
      .from("contacts")
      .update({
        name,
        email: email || null,
        company: company || null,
        phone: phone || null,
      })
      .eq("id", contactId)
      .eq("user_id", user.id);

    if (updateError) {
      return { success: false, error: "Could not update contact." };
    }

    revalidatePath(`/contacts/${contactId}`);
    revalidatePath("/contacts");

    return { success: true };
  } catch (error) {
    console.error("[actions/contacts]", error);
    return defaultActionState;
  }
}

export async function deleteContact(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const contactId = String(formData.get("contactId") ?? "").trim();

    if (!contactId) {
      return { success: false, error: "Contact not found." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to delete this contact." };
    }

    const { data: existingContact, error: existingContactError } = await supabase
      .from("contacts")
      .select("id")
      .eq("id", contactId)
      .eq("user_id", user.id)
      .single();

    if (existingContactError || !existingContact) {
      return { success: false, error: "Contact not found." };
    }

    const { error: deleteError } = await supabase
      .from("contacts")
      .delete()
      .eq("id", contactId)
      .eq("user_id", user.id);

    if (deleteError) {
      return { success: false, error: "Could not delete contact." };
    }

    revalidatePath("/contacts");

    return { success: true };
  } catch (error) {
    console.error("[actions/contacts]", error);
    return defaultActionState;
  }
}