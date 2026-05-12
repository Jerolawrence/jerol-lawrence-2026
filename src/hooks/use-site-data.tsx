import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteContact = {
  id: string;
  type: string;
  label: string;
  value: string;
  url: string | null;
  icon: string | null;
  is_enabled: boolean;
  show_in_footer: boolean;
  show_on_contact_page: boolean;
  sort_order: number;
};

export type SiteContentBlock = {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  is_published: boolean;
};

export function useSiteContacts(scope?: "footer" | "contact") {
  const [items, setItems] = useState<SiteContact[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("site_contacts")
      .select("*")
      .eq("is_enabled", true)
      .order("sort_order");
    let rows = (data as SiteContact[]) ?? [];
    if (scope === "footer") rows = rows.filter((r) => r.show_in_footer);
    if (scope === "contact") rows = rows.filter((r) => r.show_on_contact_page);
    setItems(rows);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`site_contacts_${scope ?? "all"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_contacts" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  return items;
}

export function useSiteContent(key: string) {
  const [block, setBlock] = useState<SiteContentBlock | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("*")
        .eq("key", key)
        .eq("is_published", true)
        .maybeSingle();
      setBlock((data as SiteContentBlock) ?? null);
    };
    load();
    const ch = supabase
      .channel(`site_content_${key}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content", filter: `key=eq.${key}` }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [key]);

  return block;
}
