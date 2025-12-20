(() => {
  "use strict";

  /**
   * Template for NEUROVA pack entries.
   * Copy-paste this file, rename to pack.your-name.js, and replace the metadata.
   */

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];

  const template = {
    id: "PACK_TEMPLATE_01", // unique across all packs
    title: "Pack Template",
    category: "Hamam Ritüelleri", // match NV_ENUMS.categories
    role: "Therapist", // match NV_ENUMS.roles
    tags: ["template", "example"],
    safeNote: "Fully draped. Non-medical. Non-sexual.",
    tr: "Bu TR içeriği placeholder'dır.",
    en: "Replace with EN content when ready."
  };

  const already = new Set(window.NV_PROMPTS.map(p => p && p.id).filter(Boolean));
  if (!already.has(template.id)) {
    window.NV_PROMPTS.push(template);
  }
})();
