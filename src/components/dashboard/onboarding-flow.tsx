"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Upload } from "lucide-react";
import { publicEnv } from "@/lib/env";
import { usernameSchema } from "@/lib/validation/common";

const categories = [
  "Creator",
  "Business",
  "Freelancer",
  "Artist",
  "Musician",
  "Professional",
  "Student",
  "Organization",
  "Other"
] as const;

const themes = ["minimal", "glass", "creator", "professional", "business", "dark", "elegant"] as const;
const quickLinks = ["Website", "Instagram", "TikTok", "Telegram", "YouTube", "WhatsApp", "Facebook", "LinkedIn"];
const freeThemes = new Set<string>(["minimal", "creator"]);

type Availability = "idle" | "checking" | "available" | "taken" | "invalid" | "error";

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [availability, setAvailability] = useState<Availability>("idle");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Creator");
  const [theme, setTheme] = useState<(typeof themes)[number]>("minimal");
  const [links, setLinks] = useState<Record<string, string>>({});
  const [avatar, setAvatar] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const normalized = username.trim().toLowerCase();

    if (!normalized) {
      setAvailability("idle");
      setAvailabilityMessage("");
      return;
    }

    const localResult = usernameSchema.safeParse(normalized);
    if (!localResult.success) {
      setAvailability("invalid");
      setAvailabilityMessage(localResult.error.issues[0]?.message ?? "Invalid username.");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setAvailability("checking");
      setAvailabilityMessage("");

      try {
        const response = await fetch(`/api/onboarding/username?username=${encodeURIComponent(normalized)}`, {
          cache: "no-store",
          signal: controller.signal
        });
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          if (response.status === 400) {
            setAvailability("invalid");
            setAvailabilityMessage(result?.reason ?? "Invalid username.");
          } else {
            setAvailability("error");
            setAvailabilityMessage(result?.reason ?? "Could not check this username. Please try again.");
          }
          return;
        }

        if (result?.available) {
          setAvailability("available");
          setAvailabilityMessage(`@${normalized} is available.`);
        } else {
          setAvailability("taken");
          setAvailabilityMessage(`@${normalized} is already taken.`);
        }
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setAvailability("error");
        setAvailabilityMessage("Could not check this username. Please try again.");
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  const canNext = useMemo(
    () => (step === 1 ? availability === "available" : step === 2 ? displayName.trim().length > 0 : true),
    [step, availability, displayName]
  );

  async function publish() {
    setBusy(true);
    setError("");

    const payload = {
      username: username.trim().toLowerCase(),
      displayName,
      bio,
      category,
      theme,
      links: Object.entries(links)
        .filter(([, url]) => url.trim())
        .map(([title, url]) => ({
          title,
          url,
          type: title === "WhatsApp" ? "whatsapp" : title === "Telegram" ? "telegram" : title === "Website" ? "standard" : "social"
        }))
    };

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Unable to publish.");
      setBusy(false);
      return;
    }

    if (avatar) {
      const formData = new FormData();
      formData.append("file", avatar);
      await fetch("/api/uploads/avatar", { method: "POST", body: formData });
    }

    window.location.assign("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[.14em] text-[#135d44]">Step {step} of 5</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Build your first Linqo</h1>
        </div>
        <div className="hidden text-sm text-[#6c756f] sm:block">
          {publicEnv.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, "")}/{username || "username"}
        </div>
      </div>

      <div className="card soft-shadow overflow-hidden">
        <div className="h-1 bg-[#e6e9e3]">
          <div className="h-full bg-[#135d44] transition-all" style={{ width: `${step * 20}%` }} />
        </div>

        <div className="p-6 sm:p-10">
          {step === 1 && (
            <section>
              <h2 className="text-2xl font-semibold">Choose your username</h2>
              <p className="mt-2 text-sm text-[#68716c]">
                Pick a unique username with 3–30 lowercase letters, numbers, dots, hyphens or underscores.
              </p>

              <div className="mt-7 flex items-center rounded-2xl border border-black/10 bg-white px-4 focus-within:border-[#135d44]/40 focus-within:ring-2 focus-within:ring-[#135d44]/10">
                <span className="text-sm font-medium text-[#7b837f]">@</span>
                <input
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={(event) => {
                    const nextValue = event.target.value.toLowerCase().replace(/\s+/g, "");
                    setUsername(nextValue);
                  }}
                  maxLength={30}
                  className="w-full bg-transparent px-2 py-4 outline-none"
                  placeholder="username"
                  aria-describedby="username-status"
                />
                {availability === "checking" && <Loader2 size={17} className="animate-spin text-[#68716c]" aria-hidden="true" />}
                {availability === "available" && <Check size={18} className="text-[#135d44]" aria-hidden="true" />}
              </div>

              <div id="username-status" className="mt-3 min-h-5 text-sm" aria-live="polite">
                {availability === "checking" && <span className="text-[#68716c]">Checking availability…</span>}
                {availability === "available" && (
                  <span className="inline-flex items-center gap-1 text-[#135d44]">
                    <Check size={15} /> {availabilityMessage}
                  </span>
                )}
                {availability === "taken" && <span className="text-[#b44343]">{availabilityMessage}</span>}
                {availability === "invalid" && <span className="text-[#b44343]">{availabilityMessage}</span>}
                {availability === "error" && <span className="text-[#b44343]">{availabilityMessage}</span>}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="text-2xl font-semibold">Tell people who you are</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-[120px_1fr]">
                <label className="grid aspect-square cursor-pointer place-items-center rounded-[28px] border border-dashed border-black/20 bg-[#f5f6f3] text-center text-xs font-semibold text-[#68716c]">
                  <span>
                    <Upload className="mx-auto mb-2" size={20} />Photo
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => setAvatar(event.target.files?.[0] || null)}
                  />
                </label>
                <div className="space-y-4">
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    maxLength={80}
                    placeholder="Display name"
                    className="w-full rounded-2xl border border-black/10 px-4 py-3"
                  />
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    maxLength={240}
                    rows={3}
                    placeholder="Short bio"
                    className="w-full rounded-2xl border border-black/10 px-4 py-3"
                  />
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as typeof category)}
                    className="w-full rounded-2xl border border-black/10 px-4 py-3"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-2xl font-semibold">Add your first links</h2>
              <p className="mt-2 text-sm text-[#68716c]">Skip any channel you do not use.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {quickLinks.map((name) => (
                  <label key={name} className="text-sm font-semibold">
                    {name}
                    <input
                      value={links[name] || ""}
                      onChange={(event) => setLinks({ ...links, [name]: event.target.value })}
                      placeholder={name === "WhatsApp" ? "https://wa.me/251..." : "https://"}
                      className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 font-normal"
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <h2 className="text-2xl font-semibold">Pick a starting theme</h2>
              <p className="mt-2 text-sm text-[#68716c]">You can change every visual detail later.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {themes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => freeThemes.has(item) && setTheme(item)}
                    disabled={!freeThemes.has(item)}
                    className={`relative aspect-[4/5] rounded-[24px] border p-3 text-left ${
                      theme === item ? "border-[#135d44] ring-2 ring-[#135d44]/20" : "border-black/10"
                    } disabled:cursor-not-allowed disabled:opacity-55`}
                  >
                    <div
                      className={`h-3/4 rounded-2xl ${
                        item === "dark"
                          ? "bg-[#181b19]"
                          : item === "glass"
                            ? "bg-gradient-to-br from-[#d6e7dd] to-[#e7d9bc]"
                            : "bg-[#eef1ea]"
                      }`}
                    />
                    <b className="mt-3 block capitalize">{item}</b>
                    {!freeThemes.has(item) && (
                      <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white">PRO</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#68716c]">Premium themes unlock after a verified Pro or Business subscription.</p>
            </section>
          )}

          {step === 5 && (
            <section className="text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e6f0ea] text-[#135d44]">
                <Check size={28} />
              </div>
              <h2 className="mt-5 text-3xl font-semibold">Ready to publish.</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#68716c]">
                Your public page will use the username <b>@{username}</b>. You can edit links, themes, visibility and analytics from the dashboard.
              </p>
              <div className="mx-auto mt-6 max-w-md rounded-2xl bg-[#f3f5f1] p-4 text-sm font-semibold">
                {publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/{username}
              </div>
              {error && <p className="mt-4 text-sm text-[#b44343]">{error}</p>}
              <button
                type="button"
                onClick={publish}
                disabled={busy}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#135d44] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy && <Loader2 className="animate-spin" size={16} />}
                Publish my Linqo
              </button>
            </section>
          )}

          {step < 5 && (
            <div className="mt-9 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-30"
              >
                <ArrowLeft size={16} />Back
              </button>
              <button
                type="button"
                onClick={() => setStep(Math.min(5, step + 1))}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-[#135d44] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                Continue<ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
