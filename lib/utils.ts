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

export function formatTimespan(startDate: string, endDate: string) {
  // Handle missing dates
  if (!startDate && !endDate) {
    return "Present";
  }
  
  if (!startDate) {
    return "Present";
  }
  
  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    year: 'numeric'
  });
  
  // If endDate doesn't exist, it means the timespan is ongoing
  if (!endDate) {
    return `${formattedStartDate}-Present`;
  }
  
  // If both dates are the same, just return a single year
  if (startDate === endDate) {
    return formattedStartDate;
  }
  
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    year: 'numeric'
  });
  
  return `${formattedStartDate}-${formattedEndDate}`;
}

export function formatDate(date:string) {
  var formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric'
  });

  if (!date) {
    return ``
  }

  return `${formattedDate}`;
}