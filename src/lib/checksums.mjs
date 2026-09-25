/** @param {string} base */
export function luhnCheckDigit(base) {
  if (!/^\d+$/.test(base)) throw new TypeError("Expected digits only.");
  let sum = 0;
  for (let index = base.length - 1, position = 0; index >= 0; index--, position++) {
    let digit = Number(base[index]);
    if (position % 2 === 0) digit = digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
    sum += digit;
  }
  return (10 - (sum % 10)) % 10;
}

/** @param {string} value */
export function isSaudiId(value) {
  return /^[12]\d{9}$/.test(value) && luhnCheckDigit(value.slice(0, -1)) === Number(value.at(-1));
}

/** @param {string} value */
function numericIban(value) {
  return value.replace(/[A-Z]/g, (char) => String(char.charCodeAt(0) - 55));
}

/** @param {string} digits */
function mod97(digits) {
  let remainder = 0;
  for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder;
}

/** @param {string} bank @param {string} account */
export function createSaudiIban(bank, account) {
  if (!/^\d{2}$/.test(bank) || !/^\d{18}$/.test(account)) throw new TypeError("Expected a 2-digit bank code and an 18-digit account.");
  const bban = bank + account;
  const check = String(98 - mod97(numericIban(bban + "SA00"))).padStart(2, "0");
  return "SA" + check + bban;
}

/** @param {string} value */
export function isSaudiIban(value) {
  return /^SA\d{22}$/.test(value) && mod97(numericIban(value.slice(4) + value.slice(0, 4))) === 1;
}
