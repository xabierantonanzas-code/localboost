"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import type { Business } from "@/types";

export function useBusiness() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activeBusiness, setActiveBusiness } = useAppStore();
  const supabase = createClient();

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBusinesses(data as Business[]);
      if (!activeBusiness && data.length > 0) {
        setActiveBusiness(data[0] as Business);
      }
    }
    setIsLoading(false);
  }, [supabase, activeBusiness, setActiveBusiness]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const saveBusiness = async (
    businessData: Partial<Business>
  ): Promise<Business | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const payload = { ...businessData, user_id: user.id };

    if (activeBusiness?.id) {
      const { data, error } = await supabase
        .from("businesses")
        .update(payload)
        .eq("id", activeBusiness.id)
        .select()
        .single();
      if (!error && data) {
        const biz = data as Business;
        setActiveBusiness(biz);
        await fetchBusinesses();
        return biz;
      }
    } else {
      const { data, error } = await supabase
        .from("businesses")
        .insert(payload)
        .select()
        .single();
      if (!error && data) {
        const biz = data as Business;
        setActiveBusiness(biz);
        await fetchBusinesses();
        return biz;
      }
    }
    return null;
  };

  return { businesses, activeBusiness, isLoading, saveBusiness, fetchBusinesses };
}
