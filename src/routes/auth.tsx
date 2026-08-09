import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Přihlášení do administrace | FRÁŠA MOMENTS" },
      { name: "description", content: "Přihlášení do administrace nabídky FRÁŠA MOMENTS." },
      { property: "og:title", content: "Přihlášení do administrace | FRÁŠA MOMENTS" },
      { property: "og:description", content: "Přihlášení do administrace nabídky FRÁŠA MOMENTS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Účet vytvořen — potvrďte e-mail a poté vás musí správce označit jako admina.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-soft">
        <h1 className="font-display text-2xl">Administrace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "in" ? "Přihlaste se ke správě nabídky." : "Vytvořte si účet."}
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" required />
          </div>
          <div>
            <Label htmlFor="password">Heslo</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" required minLength={6} />
          </div>
        </div>
        <Button type="submit" variant="gold" className="mt-6 w-full" disabled={busy}>
          {mode === "in" ? "Přihlásit se" : "Registrovat"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-gold"
        >
          {mode === "in" ? "Nemáte účet? Registrace" : "Máte účet? Přihlášení"}
        </button>
      </form>
    </main>
  );
}
