# @rebase/date

The official date and datetime plugin for Rebase.

## Setup

```js
import { createRebase } from "rebase";
import date from "@rebase/date";

const app = createRebase({ plugins: [date] });
```

## Usage

The plugin provides `{@date}` and `{@datetime}`. Without arguments they use the current local date/time.

```html
{@date}
{@datetime}
```

Custom formats use `as`:

```html
{@date as DD.MM.YYYY}
{@date as YYYY/MM/DD}
{@datetime as HH:mm:ss}
{@datetime as DD.MM.YYYY HH:mm}
```

Specific values are supported too:

```html
{@date "2026-09-26" as DD.MM.YYYY}
{@datetime "2026-09-26T14:05:09" as HH:mm:ss}
{@datetime now as HH:mm:ss}
```

## Format tokens

| Token | Meaning | Example |
| --- | --- | --- |
| `YYYY` | 4-digit year | 2026 |
| `YY` | 2-digit year | 26 |
| `MMMM` | Full month name | September |
| `MMM` | Short month name | Sep |
| `MM` | 2-digit month | 09 |
| `M` | Month | 9 |
| `DD` | 2-digit day | 26 |
| `D` | Day | 26 |
| `dddd` | Full weekday | Saturday |
| `ddd` | Short weekday | Sat |
| `HH` | 24-hour | 14 |
| `H` | 24-hour, no padding | 14 |
| `hh` | 12-hour | 02 |
| `h` | 12-hour, no padding | 2 |
| `mm` | Minutes | 05 |
| `m` | Minutes, no padding | 5 |
| `ss` | Seconds | 09 |
| `s` | Seconds, no padding | 9 |
| `SSS` | Milliseconds | 123 |
| `A` | AM/PM | PM |
| `a` | am/pm | pm |
| `Z` | Timezone offset | +02:00 |
| `ZZ` | Compact timezone offset | +0200 |

Separators such as `-`, `/`, `.`, `:` and spaces are preserved.

## API

`formatDate(value, format)` is exported for use outside Rebase. `createDatePlugin()` returns the plugin function for explicit registration.

## Design

- No runtime dependencies.
- Uses the local timezone and runtime locale.
- Does not mutate global Rebase state.
- Compatible with Rebase `1.0.0-beta.1` and newer.

## License

MIT
