"use client";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "#components/ui/button.component";
import Input from "#components/ui/input.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import { color, font, space } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { makeBrowserClient } from "#lib/client/supabase.client";
import { type OAuthProvider } from "#lib/shared/config";
import { formatMessage } from "#lib/shared/dictionary/dictionary.helper";
import { ROUTES } from "#lib/shared/routes/routes.const";

import { providerConfig } from "./providers/provider.const";
const styles = stylex.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
  },
  container: {
    marginBottom: space.xl,
    textAlign: "center",
  },
  heading: {
    marginBottom: space.xs,
    fontSize: font.heading,
    lineHeight: 1.5,
    fontWeight: font.bold,
    color: color.text,
  },
  description: {
    color: color.muted,
  },
  segmentedToggle: {
    marginBottom: space.lg,
    width: "100%",
  },
  segmentedToggle2: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  label: {
    marginBottom: space.xs,
    display: "block",
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.secondary,
  },
  input: {
    width: "100%",
  },
  container2: {
    marginTop: space.lg,
    marginBottom: space.lg,
    display: "flex",
    alignItems: "center",
    gap: space.md,
  },
  container3: {
    height: "1px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    backgroundColor: color.line,
  },
  label2: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.placeholder,
  },
  container4: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
  button: {
    width: "100%",
    gap: space.sm,
  },
  icon: {
    height: "20px",
    width: "20px",
  },
});
interface Props {
  oauthProviders: OAuthProvider[];
}
type Mode = "login" | "register";
type AuthForm = {
  email: string;
  password: string;
  confirmPassword: string;
};
const initialForm: AuthForm = {
  email: "",
  password: "",
  confirmPassword: "",
};
export default function AuthForm({ oauthProviders }: Props) {
  const client = makeBrowserClient();
  const router = useRouter();
  const dictionary = useDictionary();
  const [mode, setModeState] = useState<Mode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AuthForm>(initialForm);
  const updateForm = (updates: Partial<AuthForm>) => {
    setForm((current) => ({
      ...current,
      ...updates,
    }));
  };
  const setMode = (nextMode: Mode) => {
    setModeState(nextMode);
    setForm(initialForm);
  };
  const handleLogin = async ({ email, password }: AuthForm) => {
    const toastId = toast.loading(dictionary.auth.loggingIn);
    if (!email || !password) {
      toast.error(dictionary.auth.invalidEmailOrPassword, {
        id: toastId,
      });
      return;
    }
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(dictionary.auth.invalidEmailOrPassword, {
        id: toastId,
      });
      return;
    }
    toast.success(dictionary.auth.loggedInSuccessfully, {
      id: toastId,
    });
    router.replace(ROUTES.DASHBOARD.ACCOUNT);
  };
  const handleRegister = async ({
    email,
    password,
    confirmPassword,
  }: AuthForm) => {
    const toastId = toast.loading(dictionary.auth.creatingAccount);
    if (!email || !password) {
      toast.error(dictionary.auth.invalidEmailOrPassword, {
        id: toastId,
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error(dictionary.auth.passwordsDoNotMatch, {
        id: toastId,
      });
      return;
    }
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
    if (error) {
      toast.error(dictionary.auth.errorRegisteringUser, {
        id: toastId,
      });
      return;
    }
    if (data.user?.email) {
      toast.error(dictionary.auth.emailReservedForOauth, {
        id: toastId,
      });
      return;
    }
    toast.success(dictionary.auth.accountCreatedSuccessfully, {
      id: toastId,
    });
    router.replace(ROUTES.DASHBOARD.ACCOUNT);
  };
  const handleSubmit = async () => {
    if (mode === "login") {
      await handleLogin(form);
      return;
    }
    await handleRegister(form);
  };
  const handleLoginWithOauth = async (provider: OAuthProvider) => {
    const origin = window.location.origin;
    const toastId = toast.loading(dictionary.auth.startingOAuthLogin);
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    });
    if (error || !data.url) {
      toast.error(dictionary.auth.errorLoggingInWithOAuth, {
        id: toastId,
      });
      return;
    }
    toast.success(dictionary.auth.redirectingToOAuthProvider, {
      id: toastId,
    });
    window.location.assign(data.url);
  };
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await handleSubmit();
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div {...stylex.props(styles.container)}>
        <h1 {...stylex.props(styles.heading)}>
          {mode === "login"
            ? dictionary.auth.welcomeBack
            : dictionary.auth.createAccount}
        </h1>
        <p {...stylex.props(styles.description)}>
          {mode === "login"
            ? dictionary.auth.signInToYourAccount
            : dictionary.auth.signUpForNewAccount}
        </p>
      </div>
      <SegmentedToggle
        value={mode}
        onChange={setMode}
        options={[
          {
            value: "login",
            label: dictionary.auth.signIn,
          },
          {
            value: "register",
            label: dictionary.auth.signUp,
          },
        ]}
        xstyle={styles.segmentedToggle}
        buttonStyles={styles.segmentedToggle2}
      />
      <form onSubmit={onSubmit} {...stylex.props(styles.form)}>
        <div>
          <label htmlFor="email" {...stylex.props(styles.label)}>
            {dictionary.auth.email}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={dictionary.auth.enterYourEmail}
            xstyle={styles.input}
            required
            autoFocus
            value={form.email}
            onChange={(event) =>
              updateForm({
                email: event.target.value,
              })
            }
          />
        </div>
        <div>
          <label htmlFor="password" {...stylex.props(styles.label)}>
            {dictionary.auth.password}
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={dictionary.auth.enterYourPassword}
            xstyle={styles.input}
            required
            value={form.password}
            onChange={(event) =>
              updateForm({
                password: event.target.value,
              })
            }
          />
        </div>
        {mode === "register" && (
          <div>
            <label htmlFor="confirmPassword" {...stylex.props(styles.label)}>
              {dictionary.auth.confirmPassword}
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={dictionary.auth.repeatYourPassword}
              xstyle={styles.input}
              required
              value={form.confirmPassword}
              onChange={(event) =>
                updateForm({
                  confirmPassword: event.target.value,
                })
              }
            />
          </div>
        )}
        <Button type="submit" xstyle={styles.input} loading={submitting}>
          {mode === "login" ? dictionary.auth.signIn : dictionary.auth.signUp}
        </Button>
      </form>
      {oauthProviders.length > 0 && (
        <>
          <div {...stylex.props(styles.container2)}>
            <div {...stylex.props(styles.container3)} />
            <span {...stylex.props(styles.label2)}>{dictionary.auth.or}</span>
            <div {...stylex.props(styles.container3)} />
          </div>
          <div {...stylex.props(styles.container4)}>
            {oauthProviders.map((provider) => {
              const config = providerConfig[provider];
              const Icon = config.icon;
              return (
                <Button
                  key={provider}
                  variant="secondary"
                  onClick={() => void handleLoginWithOauth(provider)}
                  xstyle={styles.button}
                >
                  <Icon {...stylex.props(styles.icon)} />
                  {formatMessage(dictionary.auth.continueWith, {
                    provider: config.label,
                  })}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
