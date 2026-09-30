import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

export function formatTimespanFromDate(startDate: string, endDate: string) {
  const startYear = formatYearFromDate(startDate);
  const endYear = formatYearFromDate(endDate);

  if (!startYear) return 'Now';
  if (!endYear) return `${startYear}–Now`;
  if (startYear === endYear) return startYear;

  return `${startYear}–${endYear}`;
}

export function formatYearFromDate(date: string) {
  if (!date) return '';

  const isoYear = /^\d{4}/.exec(date)?.[0];
  if (isoYear) return isoYear;

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? ''
    : String(parsedDate.getFullYear());
}

export function formatFullTimespanFromDate(startDate: string, endDate: string) {
  const start = formatFullDate(startDate);
  const end = formatFullDate(endDate);

  if (!start) return end || 'Now';
  if (!end) return `${start} – Now`;
  if (start === end) return start;

  return `${start} – ${end}`;
}

function formatFullDate(date: string) {
  if (!date) return '';

  const isoYearOnly = /^(\d{4})$/.exec(date);
  if (isoYearOnly) return isoYearOnly[1];

  const isoYearMonth = /^(\d{4})-(\d{2})$/.exec(date);
  if (isoYearMonth) {
    const [, year, month] = isoYearMonth;
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
      'en-US',
      { month: 'long', year: 'numeric' }
    );
  }

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return formatYearFromDate(date);

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}


// Inserts Cloudinary delivery transformations into an upload URL so the browser
// receives a right-sized, modern-format image instead of the full original.
// Non-Cloudinary URLs are returned untouched.
export function cloudinaryImageUrl(
  url: string,
  { width, height }: { width: number; height?: number } = { width: 1200 }
) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const uploadMarker = '/upload/';
  const markerIndex = url.indexOf(uploadMarker);
  if (markerIndex === -1) return url;

  const transforms = [
    'f_auto',
    'q_auto',
    `w_${width}`,
    ...(height ? [`h_${height}`, 'c_fill'] : ['c_limit']),
    'dpr_2.0',
  ].join(',');

  const head = url.slice(0, markerIndex + uploadMarker.length);
  const tail = url.slice(markerIndex + uploadMarker.length);

  // Don't stack transformations if the URL already carries some
  if (/^[a-z]_[^/]+\//.test(tail)) return url;

  return `${head}${transforms}/${tail}`;
}

// Fails loudly instead of handing an empty string to an API client, which
// would surface as an opaque 401 or a silently blank page.
export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Set it in .env.local (see README) before starting the app.`
    );
  }

  return value;
}
