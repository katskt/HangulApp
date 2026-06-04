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
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // -----------------------------
  // CLASS ACCESS CHECK
  // -----------------------------
  // Change this line:

  const [fontsLoaded, fontError] = useFonts({
    Jua: require("@/assets/fonts/Jua/Jua-Regular.ttf"),
    AsapCondensedSemiBold: require("@/assets/fonts/AsapCondensed/AsapCondensed-SemiBold.ttf"),
    AsapCondensedBold: require("@/assets/fonts/AsapCondensed/AsapCondensed-Bold.ttf"),
  });

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
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session timeout")), 5000),
        );

        const sessionPromise = supabase.auth.getSession();

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeout])) as any;
        setSession(session);
      } catch (e) {
        console.warn("Session fetch failed or timed out:", e);
        setSession(null); // treat as logged out
      } finally {
        setAuthReady(true); // ALWAYS unblock the loading screen
      }
    };

    // const init = async () => {
    //   console.log("=== STEP 1: init started ===");
    //   console.log(
    //     "=== STEP 2: supabase url:",
    //     process.env.EXPO_PUBLIC_SUPABASE_URL,
    //   );
    //   console.log("=== STEP 3: calling getSession ===");

    //   try {
    //     const result = await supabase.auth.getSession();
    //     console.log(
    //       "=== STEP 4: getSession returned ===",
    //       JSON.stringify(result),
    //     );
    //     setSession(result.data.session);
    //   } catch (e) {
    //     console.log("=== STEP 4: getSession THREW ERROR ===", e);
    //     setSession(null);
    //   } finally {
    //     console.log("=== STEP 5: setting authReady true ===");
    //     setAuthReady(true);
    //   }
    // };

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

  if (!fontsLoaded && !fontError) return <Loading />;

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
