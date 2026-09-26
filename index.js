const TOKENS = {
  YYYY: date => String(date.getFullYear()).padStart(4, "0"),
  YY: date => String(date.getFullYear()).slice(-2),
  MMMM: date => date.toLocaleString(undefined, { month: "long" }),
  MMM: date => date.toLocaleString(undefined, { month: "short" }),
  MM: date => String(date.getMonth() + 1).padStart(2, "0"),
  M: date => String(date.getMonth() + 1),
  DD: date => String(date.getDate()).padStart(2, "0"),
  D: date => String(date.getDate()),
  dddd: date => date.toLocaleString(undefined, { weekday: "long" }),
  ddd: date => date.toLocaleString(undefined, { weekday: "short" }),
  HH: date => String(date.getHours()).padStart(2, "0"),
  H: date => String(date.getHours()),
  hh: date => String((date.getHours() % 12) || 12).padStart(2, "0"),
  h: date => String((date.getHours() % 12) || 12),
  mm: date => String(date.getMinutes()).padStart(2, "0"),
  m: date => String(date.getMinutes()),
  ss: date => String(date.getSeconds()).padStart(2, "0"),
  s: date => String(date.getSeconds()),
  SSS: date => String(date.getMilliseconds()).padStart(3, "0"),
  A: date => date.getHours() < 12 ? "AM" : "PM",
  a: date => date.getHours() < 12 ? "am" : "pm",
  Z: date => {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    return sign + String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  },
  ZZ: date => {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    return sign + String(hours).padStart(2, "0") + String(minutes).padStart(2, "0");
  }
};

const TOKEN_PATTERN = /(YYYY|MMMM|MMM|dddd|ddd|SSS|YY|MM|DD|HH|hh|mm|ss|ZZ|M|D|H|h|m|s|A|a|Z)/g;

export function formatDate(value, format = "YYYY-MM-DD") {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError("Invalid date value");
  }

  return format.replace(TOKEN_PATTERN, token => TOKENS[token](date));
}

export function createDatePlugin() {
  return rebase => {
    rebase.directive("date", ({ expression }) => render(expression, "YYYY-MM-DD"));
    rebase.directive("datetime", ({ expression }) => render(expression, "YYYY-MM-DD HH:mm:ss"));
  };
}

export default createDatePlugin();

function render(expression, defaultFormat) {
  const { value, format } = parseExpression(expression, defaultFormat);
  return formatDate(value, format);
}

function parseExpression(expression, defaultFormat) {
  const input = expression.trim();

  if (!input) {
    return { value: new Date(), format: defaultFormat };
  }

  const match = input.match(/^(.*?)\s+as\s+(.+)$/i);
  if (match) {
    return { value: parseValue(match[1].trim()), format: stripQuotes(match[2].trim()) };
  }

  return { value: parseValue(input), format: defaultFormat };
}

function parseValue(value) {
  const clean = stripQuotes(value);
  if (!clean || clean.toLowerCase() === "now") return new Date();

  const timestamp = Number(clean);
  if (/^-?\d+$/.test(clean) && Number.isFinite(timestamp)) {
    return new Date(timestamp);
  }

  return new Date(clean);
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
