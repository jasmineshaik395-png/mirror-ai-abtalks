"use client";
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";

export function AnswerInput({
  onSubmit,
  disabled,
}: {
  onSubmit: (text: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-ink-line bg-ink pt-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={2}
        placeholder="Type your answer — Enter to send, Shift+Enter for a new line"
        className="focus-ring flex-1 resize-none rounded-xl border border-ink-line bg-ink-raised px-4 py-3 text-[15px] text-paper placeholder:text-paper-dim/60 disabled:opacity-50"
      />
      <Button onClick={submit} disabled={disabled || !value.trim()} className="shrink-0">
        Send
      </Button>
    </div>
  );
}
