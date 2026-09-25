export const MAX_TEXT_LENGTH = 1_000_000;
const MAX_OUTPUT_LENGTH = 5_000_000;

/** @param {string} text */
function validateText(text) {
  if (typeof text !== "string") throw new TypeError("Enter text to convert.");
  if (text.length > MAX_TEXT_LENGTH) throw new RangeError("Use at most 1,000,000 characters at a time.");
}

/** Encode UTF-8 text as standard Base64. @param {string} text */
export function encodeBase64(text) {
  validateText(text);
  const bytes = new TextEncoder().encode(text);
  if (new TextDecoder("utf-8", { ignoreBOM: true }).decode(bytes) !== text) {
    throw new Error("The text contains an incomplete Unicode character.");
  }
  const chunks = [];
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    chunks.push(String.fromCharCode(...bytes.subarray(offset, offset + 8192)));
  }
  return btoa(chunks.join(""));
}

/** Decode standard Base64, allowing whitespace and omitted padding. @param {string} text */
export function decodeBase64(text) {
  validateText(text);
  const compact = text.replace(/[ \t\r\n]/g, "");
  const raw = compact.replace(/=+$/, "");
  const padded = raw.padEnd(Math.ceil(raw.length / 4) * 4, "=");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact) || raw.length % 4 === 1 || (compact.includes("=") && compact !== padded)) {
    throw new Error("Enter valid standard Base64 text.");
  }
  const binary = atob(padded);
  if (btoa(binary) !== padded) throw new Error("Enter valid standard Base64 text.");
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
  } catch {
    throw new Error("This Base64 contains binary data, not valid UTF-8 text.");
  }
}

/** Format validated JSON without changing number precision, key order, or string escapes.
 * @param {string} text
 * @param {"pretty" | "minify"} mode
 */
export function formatJson(text, mode = "pretty") {
  validateText(text);
  if (mode !== "pretty" && mode !== "minify") throw new RangeError("Choose pretty or minify.");
  if (!text.trim()) throw new Error("Enter some JSON first.");
  // Validate only. Serializing the parsed object would round large numbers and remove duplicate keys.
  JSON.parse(text);
  const tokens = text.match(/"(?:\\[\s\S]|[^"\\])*"|true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\],:]/g) ?? [];
  if (mode === "minify") return tokens.join("");

  let depth = 0;
  let length = 0;
  const output = [];
  /** @param {string} part */
  const append = (part) => {
    length += part.length;
    if (length > MAX_OUTPUT_LENGTH) throw new RangeError("Formatted output is too large. Try minifying or using a smaller document.");
    output.push(part);
  };
  const newline = () => append("\n" + "  ".repeat(depth));

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token === "{" || token === "[") {
      append(token);
      if (++depth > 100) throw new RangeError("JSON is too deeply nested to pretty-print. Try minifying it.");
      if (tokens[index + 1] !== "}" && tokens[index + 1] !== "]") newline();
    } else if (token === "}" || token === "]") {
      depth--;
      if (tokens[index - 1] !== "{" && tokens[index - 1] !== "[") newline();
      append(token);
    } else if (token === ",") {
      append(token);
      newline();
    } else if (token === ":") {
      append(": ");
    } else {
      append(token);
    }
  }
  return output.join("");
}
