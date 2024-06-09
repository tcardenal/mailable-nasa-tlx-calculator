export const subscales: { [id: string]: string } = {
  MD: "Mental Demand",
  PD: "Physical Demand",
  TD: "Temporal Demand",
  PF: "Performance",
  EF: "Effort",
  FR: "Frustration",
};

export const subscalesRev: { [id: string]: string } = {
  "Mental Demand": "MD",
  "Physical Demand": "PD",
  "Temporal Demand": "TD",
  Performance: "PF",
  Effort: "EF",
  Frustration: "FR",
};

export const pairwises: string[] = [
  "MD-PD",
  "MD-TD",
  "MD-PF",
  "MD-EF",
  "MD-FR",
  "PD-TD",
  "PD-PF",
  "PD-EF",
  "PD-FR",
  "TD-PF",
  "TD-EF",
  "TD-FR",
  "PF-EF",
  "PF-FR",
  "EF-FR",
];
