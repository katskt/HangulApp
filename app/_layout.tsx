import Loading from "@/components/Loading";
import { supabase } from "@/supabaseConfig";
import { useThemeColors } from "@/theme/useThemeColors";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Layout() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [fontsLoaded] = useFonts({
    Jua: require("@/assets/fonts/Jua/Jua-Regular.ttf"),
    AsapCondensedSemiBold: require("@/assets/fonts/AsapCondensed/AsapCondensed-SemiBold.ttf"),
    AsapCondensedBold: require("@/assets/fonts/AsapCondensed/AsapCondensed-Bold.ttf"),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // -----------------------------
  // CLASS ACCESS CHECK
  // -----------------------------
  const checkClassAccess = async (userId: string) => {
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("class_code")
      .eq("id", userId)
      .single();
    if (userError || !user?.class_code) return false;
    const { data: classRow, error: classError } = await supabase
      .from("classes")
      .select("*")
      .eq("code", user.class_code)
      .single();
    const now = Date.now();

    if (classError || !classRow) return false;

    const start = new Date(classRow.start_date).getTime();
    const end = new Date(classRow.end_date).getTime();

    return now >= start && now <= end;
  };

  // -----------------------------
  // AUTH INIT
  // -----------------------------
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setAuthReady(true);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setAuthReady(true);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // -----------------------------
  // ROUTING + CLASS GATE (FIXED)
  // -----------------------------
  useEffect(() => {
    const run = async () => {
      if (!authReady) return;

      if (!session?.user?.id) {
        router.replace("/login");
        return;
      }

      const allowed = await checkClassAccess(session.user.id);

      if (!allowed) {
        router.replace("/expired");
        return;
      }

      router.replace("/");
    };

    run();
  }, [session, authReady]);

  // -----------------------------
  // DEEP LINK INIT
  // -----------------------------
  useEffect(() => {
    Linking.getInitialURL().then(() => {
      supabase.auth.getSession();
    });
  }, []);

  // -----------------------------
  // LOADING
  // -----------------------------
  if (!fontsLoaded || !authReady) return <Loading />;

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: colors.background,
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
