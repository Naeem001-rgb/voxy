// Single source of truth for the product identity.
// Swap the name here and it propagates across the whole site.
export const BRAND = {
  name: "Voxy",
  tagline: "Voice to text for Linux",
  os: "Linux",
  price: "$29.99",
  hotkey: "Ctrl + Space",
  groqModel: "whisper-large-v3",
} as const;
