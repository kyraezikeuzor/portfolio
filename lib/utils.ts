import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(text:string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getPath(text:string) {
  let finalString = "/" + text.toLowerCase().replaceAll(" ", "-");
  return finalString;
}

export function formatDate(startDate:string, endDate:string) {
  var formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      year: 'numeric'
  });

  var formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric'
  });

  if (!startDate) {
    return `Present`
  }

  if (!endDate) {
    return `${formattedStartDate}-Present`;
  }

  return `${formattedStartDate}-${formattedEndDate}`;
}