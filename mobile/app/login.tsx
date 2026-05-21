// app/login.tsx
import MyButton from "@/components/FunctionalButton";
import Loading from "@/components/Loading";
import { supabase } from "@/supabaseConfig";
import { useThemeColors } from "@/theme/useThemeColors";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Step =
  | "landing"
  | "login"
  | "signup_code"
  | "signup_confirm"
  | "signup_details";

export default function Login() {
  const colors = useThemeColors();
  const [step, setStep] = useState<Step>("landing");
  const [loading, setLoading] = useState(false);

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  // signup
  const [classCode, setClassCode] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  };
  const handleVerifyCode = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("classes")
      .select("teacher_name, class_name, start_date, end_date")
      .eq("code", classCode.trim())
      .maybeSingle();

    if (error || !data) {
      Alert.alert(
        "Invalid code",
        "Please check your class code and try again.",
      );
      setLoading(false);
      return;
    }

    // -----------------------------
    // TIME CHECK
    // -----------------------------
    const now = Date.now();
    const start = new Date(data.start_date).getTime();
    const end = new Date(data.end_date).getTime();

    const isActive = now >= start && now <= end;
    if (!isActive) {
      Alert.alert(
        "Class expired",
        "This class is no longer active. Please contact your teacher if you think this is a mistake.",
      );
      setLoading(false);
      return;
    }

    // -----------------------------
    // VALID + ACTIVE CLASS
    // -----------------------------
    setTeacherName(data.teacher_name);
    setClassName(data.class_name);
    setStep("signup_confirm");

    setLoading(false);
  };
  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !retypePassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== retypePassword) {
      Alert.alert("Error", "Please ensure password matches");
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "ucsbhangeul://login",
        data: {
          first_name: firstName,
          last_name: lastName,
          class_code: classCode,
        },
      },
    });

    setLoading(false);

    // -----------------------------
    // REAL CHECK
    // -----------------------------
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    console.log("SIGNUP RESPONSE:", { data, error });
    if (!data.user) {
      Alert.alert(
        "Account already exists",
        "This email is already registered. Please log in instead.",
        [
          {
            text: "Go to Login",
            onPress: () => setStep("login"),
          },
          { text: "Cancel", style: "cancel" },
        ],
      );
      return;
    }

    Alert.alert(
      "Check your email",
      "We sent you a confirmation link (or your account was created).",
    );

    setStep("login");
  };
  // ---- LANDING ----
  if (step === "landing") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => setStep("landing")}
          style={styles.back}
        >
          <Text style={[styles.backText, { color: colors.text }]}> </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>UCSB 한글</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Learn Korean
        </Text>
        <MyButton style={styles.button} onPress={() => setStep("login")}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Log In
          </Text>
        </MyButton>
        <MyButton style={styles.button} onPress={() => setStep("signup_code")}>
          <Text
            style={[styles.outlineButtonText, { color: colors.buttonText }]}
          >
            Sign Up
          </Text>
        </MyButton>
      </View>
    );
  }

  // ---- LOGIN ----
  if (step === "login") {
    return loading ? (
      <Loading />
    ) : (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => setStep("landing")}
          style={styles.back}
        >
          <Text style={[styles.backText, { color: colors.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <MyButton
          style={[styles.button]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Log In
          </Text>
        </MyButton>
        <TouchableOpacity onPress={() => setStep("signup_code")}>
          <Text style={[styles.switchText, { color: colors.text }]}>
            Don&apos;t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---- SIGNUP STEP 1: CLASS CODE ----
  if (step === "signup_code") {
    return loading ? (
      <Loading />
    ) : (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => setStep("landing")}
          style={styles.back}
        >
          <Text style={[styles.backText, { color: colors.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Enter Class Code
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Ask your teacher for your class code
        </Text>
        <TextInput
          style={[styles.input, styles.codeInput, { color: colors.text }]}
          value={classCode}
          onChangeText={setClassCode}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---- SIGNUP STEP 2: CONFIRM TEACHER ----
  if (step === "signup_confirm") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => setStep("signup_code")}
          style={styles.back}
        >
          <Text style={[styles.backText, { color: colors.buttonText }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Is this your teacher?
        </Text>
        <View style={styles.teacherCard}>
          <Text style={styles.teacherName}>{teacherName}</Text>
          <Text style={styles.outlineButtonText}>{className}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setStep("signup_details")}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Yes, that&apos;s my teacher!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setStep("signup_code")}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            No, try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---- SIGNUP STEP 3: DETAILS ----
  if (step === "signup_details") {
    return loading ? (
      <Loading />
    ) : (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <TouchableOpacity
          onPress={() => setStep("signup_confirm")}
          style={styles.back}
        >
          <Text style={[styles.backText, { color: colors.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Create Account
        </Text>

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Retype Password"
          value={retypePassword}
          onChangeText={setRetypePassword}
          secureTextEntry
        />

        <MyButton
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Create Account
          </Text>
        </MyButton>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  back: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  codeInput: {
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    zIndex: 0,
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
  },
  teacherCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  teacherName: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
