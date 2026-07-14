import type { LucideIcon } from "lucide-react";
import {
  Bolt,
  Briefcase,
  Bus,
  Car,
  CircleQuestionMark,
  Coffee,
  Dumbbell,
  Gamepad,
  Gift,
  GraduationCap,
  Heart,
  House,
  Music,
  PawPrint,
  PiggyBank,
  Plane,
  Receipt,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  TrendingUp,
  Tv,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import { m } from "../paraglide/messages";
import type { Locale } from "../paraglide/runtime";
import type { Category } from "../types/categories";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    name: "categories.food",
    icon: "utensils",
    id: 0,
  },
  {
    name: "categories.transport",
    icon: "car",
    id: 1,
  },
  {
    name: "categories.housing",
    icon: "home",
    id: 2,
  },
  {
    name: "categories.entertainment",
    icon: "gamepad",
    id: 3,
  },
  {
    name: "categories.health",
    icon: "heart",
    id: 4,
  },
  {
    name: "categories.shopping",
    icon: "shoppingBag",
    id: 5,
  },
  {
    name: "categories.salary",
    icon: "wallet",
    id: 6,
  },
  {
    name: "categories.investments",
    icon: "trendingUp",
    id: 7,
  },
  {
    name: "categories.gifts",
    icon: "gift",
    id: 8,
  },
  {
    name: "categories.others",
    icon: "helpCircle",
    id: 9,
  },
];

type Language = {
  label: string;
  value: Locale;
};

export const LANGUAGES: Language[] = [
  {
    label: "Español",
    value: "es",
  },
  { label: "English", value: "en" },
];

export const CURRENCIES = [
  { value: "USD", label: m["currencies.usd"]() },
  { value: "EUR", label: m["currencies.eur"]() },
  { value: "JPY", label: m["currencies.jpy"]() },
  { value: "GBP", label: m["currencies.gbp"]() },
  { value: "AUD", label: m["currencies.aud"]() },
  { value: "CAD", label: m["currencies.cad"]() },
  { value: "CHF", label: m["currencies.chf"]() },
  { value: "CNY", label: m["currencies.cny"]() },
  { value: "MXN", label: m["currencies.mxn"]() },
  { value: "NZD", label: m["currencies.nzd"]() },
];

export const TRANSACTION_TYPES_DICTIONARY = {
  expense: m["transaction_types.expense"],
  income: m["transaction_types.income"],
};

export const TRANSACTION_TYPES = Object.entries(TRANSACTION_TYPES_DICTIONARY).map(
  ([value, label]) => ({ label, value }),
);

export const APP_STATE_KEY = "app_state";

export const QUERY_PARAMS = {
  yearMonth: new Date().toISOString().slice(0, 7),
};

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  bolt: Bolt,
  car: Car,
  home: House,
  gamepad: Gamepad,
  heart: Heart,
  shoppingBag: ShoppingBag,
  wallet: Wallet,
  trendingUp: TrendingUp,
  gift: Gift,
  helpCircle: CircleQuestionMark,
  bus: Bus,
  plane: Plane,
  education: GraduationCap,
  fitness: Dumbbell,
  coffee: Coffee,
  health: Stethoscope,
  work: Briefcase,
  utilities: Zap,
  bill: Receipt,
  savings: PiggyBank,
  mobile: Smartphone,
  entertainment: Music,
  pets: PawPrint,
  electronics: Tv,
};

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
