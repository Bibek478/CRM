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

const VALID_STAGES = ["lead", "contacted", "proposal", "won", "lost"] as const;
type DealStage = (typeof VALID_STAGES)[number];

function isValidStage(value: string): value is DealStage {
  return VALID_STAGES.includes(value as DealStage);
}

export async function createDeal(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const contactId = String(formData.get("contactId") ?? "").trim();
    const valueRaw = String(formData.get("value") ?? "").trim();
    const stage = String(formData.get("stage") ?? "lead").trim();

    if (!name) {
      return { success: false, error: "Deal name is required." };
    }

    if (!contactId) {
      return { success: false, error: "A contact is required." };
    }

    if (!isValidStage(stage)) {
      return { success: false, error: "Invalid stage selected." };
    }

    const valueCents = valueRaw ? Math.round(parseFloat(valueRaw) * 100) : 0;

    if (isNaN(valueCents) || valueCents < 0) {
      return { success: false, error: "Value must be a positive number." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to create a deal." };
    }

    const { data: existingContact, error: contactError } = await supabase
      .from("contacts")
      .select("id")
      .eq("id", contactId)
      .eq("user_id", user.id)
      .single();

    if (contactError || !existingContact) {
      return { success: false, error: "Contact not found." };
    }

    const { error: insertError } = await supabase.from("deals").insert({
      user_id: user.id,
      contact_id: contactId,
      name,
      value: valueCents,
      stage,
    });

    if (insertError) {
      return { success: false, error: "Could not create deal." };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[actions/deals]", error);
    return defaultActionState;
  }
}

export async function updateDealStage(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const dealId = String(formData.get("dealId") ?? "").trim();
    const stage = String(formData.get("stage") ?? "").trim();

    if (!dealId) {
      return { success: false, error: "Deal not found." };
    }

    if (!isValidStage(stage)) {
      return { success: false, error: "Invalid stage selected." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to update this deal." };
    }

    const { data: existingDeal, error: existingDealError } = await supabase
      .from("deals")
      .select("id")
      .eq("id", dealId)
      .eq("user_id", user.id)
      .single();

    if (existingDealError || !existingDeal) {
      return { success: false, error: "Deal not found." };
    }

    const { error: updateError } = await supabase
      .from("deals")
      .update({ stage })
      .eq("id", dealId)
      .eq("user_id", user.id);

    if (updateError) {
      return { success: false, error: "Could not update deal stage." };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[actions/deals]", error);
    return defaultActionState;
  }
}

export async function updateDeal(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const dealId = String(formData.get("dealId") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const valueRaw = String(formData.get("value") ?? "").trim();
    const stage = String(formData.get("stage") ?? "").trim();

    if (!dealId) {
      return { success: false, error: "Deal not found." };
    }

    if (!name) {
      return { success: false, error: "Deal name is required." };
    }

    if (!isValidStage(stage)) {
      return { success: false, error: "Invalid stage selected." };
    }

    const valueCents = valueRaw ? Math.round(parseFloat(valueRaw) * 100) : 0;

    if (isNaN(valueCents) || valueCents < 0) {
      return { success: false, error: "Value must be a positive number." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to update this deal." };
    }

    const { data: existingDeal, error: existingDealError } = await supabase
      .from("deals")
      .select("id")
      .eq("id", dealId)
      .eq("user_id", user.id)
      .single();

    if (existingDealError || !existingDeal) {
      return { success: false, error: "Deal not found." };
    }

    const { error: updateError } = await supabase
      .from("deals")
      .update({ name, value: valueCents, stage })
      .eq("id", dealId)
      .eq("user_id", user.id);

    if (updateError) {
      return { success: false, error: "Could not update deal." };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/deals/${dealId}`);

    return { success: true };
  } catch (error) {
    console.error("[actions/deals]", error);
    return defaultActionState;
  }
}

export async function deleteDeal(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const dealId = String(formData.get("dealId") ?? "").trim();

    if (!dealId) {
      return { success: false, error: "Deal not found." };
    }

    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Sign in again to delete this deal." };
    }

    const { data: existingDeal, error: existingDealError } = await supabase
      .from("deals")
      .select("id")
      .eq("id", dealId)
      .eq("user_id", user.id)
      .single();

    if (existingDealError || !existingDeal) {
      return { success: false, error: "Deal not found." };
    }

    const { error: deleteError } = await supabase
      .from("deals")
      .delete()
      .eq("id", dealId)
      .eq("user_id", user.id);

    if (deleteError) {
      return { success: false, error: "Could not delete deal." };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[actions/deals]", error);
    return defaultActionState;
  }
}
