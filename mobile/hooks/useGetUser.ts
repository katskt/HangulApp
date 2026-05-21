import { useEffect, useState } from "react";
import { supabase } from "@/supabaseConfig";

export function useGetUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userData.user.id)
        .single();

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");

      }
    };

    loadProfile();
  }, []);
  return {firstName, lastName};
}