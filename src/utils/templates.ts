// templates.ts

import { Round } from "./round";

export interface Template {
  name: string;
  rounds: Round[];
}

export const TEMPLATES: Template[] = [
  {
    name: "Tech Startup",
    rounds: [
      { amount: 500000, valuation: 5000000, series: "seed" },
      { amount: 1500000, valuation: 15000000, series: "A" },
      // ... add other rounds
    ],
  },
  {
    name: "Biotech Firm",
    rounds: [
      { amount: 1000000, valuation: 4000000, series: "seed" },
      { amount: 2500000, valuation: 20000000, series: "A" },
      // ... add other rounds
    ],
  },
  // ... add other templates
];
