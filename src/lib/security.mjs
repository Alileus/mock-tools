/** Serialize structured data without allowing a value to close its script element.
 * @param {unknown} value
 */
export function serializeJsonLd(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
