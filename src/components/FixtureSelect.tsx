import { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Keep the native control as the form value and no-JS fallback. Existing tools
// can update its options without needing to know about React or Radix.
function FixtureSelect({ source, label }: { source: HTMLSelectElement; label: HTMLLabelElement | null }) {
  const readOptions = () => Array.from(source.options, ({ value, text, disabled }) => ({ value, text, disabled }));
  const [options, setOptions] = useState(readOptions);
  const [value, setValue] = useState(source.value);
  const [disabled, setDisabled] = useState(source.disabled);

  useLayoutEffect(() => {
    const sync = () => {
      setOptions(readOptions());
      setValue(source.value);
      setDisabled(source.disabled);
    };
    const observer = new MutationObserver(sync);
    observer.observe(source, { childList: true, subtree: true, attributes: true, characterData: true });
    source.addEventListener("change", sync);
    source.hidden = true;
    if (label) label.htmlFor = `${source.id}-trigger`;
    sync();
    return () => {
      observer.disconnect();
      source.removeEventListener("change", sync);
      source.hidden = false;
      if (label) label.htmlFor = source.id;
    };
  }, [source, label]);

  return (
    <Select value={value} disabled={disabled || !options.length} onValueChange={(next) => {
      source.value = next;
      setValue(next);
      source.dispatchEvent(new Event("input", { bubbles: true }));
      source.dispatchEvent(new Event("change", { bubbles: true }));
    }}>
      <SelectTrigger id={`${source.id}-trigger`} className="mb-[14px] h-auto min-h-11 w-full min-w-0 rounded-lg border-line2 bg-panel2 px-[11px] py-[11px] text-left text-[13px] text-txt shadow-none focus:ring-blue" aria-label={label?.textContent?.trim()} aria-describedby={source.getAttribute("aria-describedby") ?? undefined}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} collisionPadding={16} className="max-h-[min(20rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)] border-line2 bg-panel2 text-txt">
        {options.map((option) => <SelectItem className="min-h-10 cursor-pointer text-[13px] focus:bg-sel focus:text-white" key={option.value} value={option.value} disabled={option.disabled}>{option.text}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function enhanceSelects() {
  document.querySelectorAll<HTMLSelectElement>("select.field").forEach((source) => {
    if (source.dataset.enhanced) return;
    source.dataset.enhanced = "true";
    const host = document.createElement("div");
    host.className = "min-w-0";
    source.after(host);
    const label = source.labels?.[0] ?? null;
    createRoot(host).render(<FixtureSelect source={source} label={label} />);
  });
}
