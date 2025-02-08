import { Contact } from "@/app/dashboard/admin/contacts-organizations/ContactActionsModal";

// utils/locations.ts
export const DEPARTMENT_CAPITALS: { [key: string]: string } = {
    "75": "Paris",
    "77": "Melun",
    "78": "Versailles",
    "91": "Évry",
    "92": "Nanterre",
    "93": "Bobigny",
    "94": "Créteil",
    "95": "Pontoise",
    // Add more departments as needed
    "13": "Marseille",
    "69": "Lyon",
    "31": "Toulouse",
    "06": "Nice",
    "59": "Lille"
  };
  
  export const getWeatherLocation = (contact: Contact): string => {
    if (contact.mailingAddress) return contact.mailingAddress;
    if (contact.department) return DEPARTMENT_CAPITALS[contact.department] || "Paris";
    return "Paris";
  };