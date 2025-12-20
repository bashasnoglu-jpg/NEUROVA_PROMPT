(() => {
  "use strict";
  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  const P = [{
    id:"SAMPLE_01",
    title:"Sample Prompt Card",
    category:"Hamam Ritüelleri",
    role:"Therapist",
    tags:["sample","hamam","akış"],
    safeNote:"Fully draped. Non-medical. Non-sexual.",
    tr:"Bu bir örnek karttır. Gerçek pack.*.js dosyalarını NEUROVA_PROMPT/packs/ içine koyduğunda otomatik görünecek.",
    en:"This is a sample card. Put real pack.*.js files into NEUROVA_PROMPT/packs/ and they will appear automatically."
  }];
  const seen = new Set(window.NV_PROMPTS.map(x => x && x.id).filter(Boolean));
  for (const x of P) if (!seen.has(x.id)) window.NV_PROMPTS.push(x);
})();
