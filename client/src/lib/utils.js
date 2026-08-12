import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = "http://localhost:8080";
export const TOKEN_KEY = "arthrix_token";
export const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`;

export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];
export const DIET_OPTIONS = ["VEG", "NON_VEG"];
export const FITNESS_GOAL_OPTIONS = ["LOSE_FAT", "MAINTAIN", "GAIN_MUSCLE"];
export const DIFFICULTY_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
export const MEAL_TYPE_OPTIONS = ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"];
export function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}