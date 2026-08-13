import { useState } from "react";
import { Copy, Check, Users, Info } from "lucide-react";
import type { Friend, Profile } from "../types";

interface FriendsPageProps {
  profile: Profile;
  friends: Friend[];
  onAddFriend: (code: string) => Promise<{ success: boolean; message?: string }>;
}

export default function FriendsPage({ profile, friends, onAddFriend }: FriendsPageProps) {
  const [copied, setCopied] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.friend_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAdd = async () => {
    if (!codeInput.trim()) return;
    const result = await onAddFriend(codeInput.trim());
    setFeedback(result.message ?? (result.success ? "Friend added." : "Couldn't add friend."));
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-6">
      <div className="panel flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Your Friend Code
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink">{profile.friend_code}</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-ink hover:bg-accent/20"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy Code"}
        </button>
      </div>

      <div className="panel p-6">
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Add a Friend</h2>
        <div className="flex gap-2">
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="e.g. AYUSH-4837"
            className="flex-1 rounded-lg border border-border bg-void/60 px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent/60 focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="btn-accent rounded-lg px-4 py-2 text-sm font-medium"
          >
            Add Friend
          </button>
        </div>
        {feedback && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-ink-muted">
            <Info size={14} className="mt-0.5 shrink-0 text-accent" />
            <span>{feedback}</span>
          </div>
        )}
        <p className="mt-3 text-xs text-ink-muted">
          This app runs fully offline and stores data only on your computer. Connecting with a
          real friend on another device needs a cloud sync service, which isn't built yet — this
          page is ready to work the moment that exists.
        </p>
      </div>

      <div className="panel p-6">
        <h2 className="mb-3 font-display text-base font-semibold text-ink">
          Friends & Leaderboard
        </h2>
        {friends.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Users size={26} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">
              No friends connected yet. Once cloud sync exists, this becomes a real-time
              leaderboard comparing you with the people you add.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f.id} className="flex items-center justify-between rounded-lg border border-border bg-cardhi/40 px-3 py-2 text-sm text-ink">
                <span>{f.display_name}</span>
                <span className="font-mono text-xs text-ink-muted">{f.friend_code}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
