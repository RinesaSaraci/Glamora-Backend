const getOpenAI = require("../lib/openai");
const prisma = require("../lib/prisma");

// ─────────────────────────────────────────────
// OPSIONI 1: CHATBOT PËR KLIENTËT
// Klienti pyet për shërbime, disponueshmëri, çmime
// ─────────────────────────────────────────────
const chat = async (salonId, message, conversationHistory = []) => {
  const salon = await prisma.salon.findUnique({
    where: { id: Number(salonId) },
    include: {
      services: { select: { name: true, duration: true, price: true, description: true } },
      employees: { select: { name: true } },
    },
  });

  if (!salon) throw new Error("Salon not found");

  const serviceList = salon.services
    .map((s) => `- ${s.name}: ${s.duration} min, €${s.price}${s.description ? ` (${s.description})` : ""}`)
    .join("\n");

  const employeeList = salon.employees.map((e) => `- ${e.name}`).join("\n");

  const systemPrompt = `Je asistentja e ${salon.name} në ${salon.city}. Sillet si recepsioniste e ngrohtë dhe mikpritëse — si dikush që kënaqet kur ndihmon klientët. Shkurt, natyrale, 1-2 fjali.

Rregulla:
- Mos shpik emra, identitete apo shërbime. Vetëm faktet e mëposhtme.
- Mos bëj pyetje të tepërta — thjesht përgjigju dhe shto një notë të ngrohtë.
- Nëse pyet çka bëni: listo shërbimet me entuziazëm të lehtë.
- Nëse shërbimi nuk ekziston: "Për momentin nuk e ofrojmë, por kemi alternativa të shkëlqyera!"
- Nëse pyet për rezervim: "Mund të rezervosh lehtë direkt këtu në aplikacion, do të kënaqemi t'ju presim! 😊"
- Për "ckemi/hej/hi": "Hej! Mirë se vini, si mund t'ju ndihmoj sot? 😊"

Shërbimet:
${serviceList || "Pa shërbime."}

Punonjësit:
${employeeList || "Pa punonjës."}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: message },
  ];

  const response = await getOpenAI().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  return {
    reply: response.choices[0].message.content,
    usage: response.usage,
  };
};

// ─────────────────────────────────────────────
// OPSIONI 2: REKOMANDIME INTELIGJENTE
// Bazuar në historikun e rezervimeve të userit
// ─────────────────────────────────────────────
const getRecommendations = async (userId) => {
  const reservations = await prisma.reservation.findMany({
    where: {
      customerId: Number(userId),
      status: { in: ["COMPLETED", "CONFIRMED"] },
    },
    include: {
      service: { select: { name: true, duration: true, price: true } },
      salon: { select: { name: true, city: true } },
      employee: { select: { name: true } },
    },
    orderBy: { date: "desc" },
    take: 10,
  });

  const allSalons = await prisma.salon.findMany({
    include: {
      services: { select: { name: true, duration: true, price: true } },
    },
    take: 20,
  });

  if (reservations.length === 0) {
    return {
      recommendations: [],
      message: "Nuk ka histori rezervimesh për të gjeneruar rekomandime.",
    };
  }

  const historyText = reservations
    .map((r) => `- ${r.service.name} te "${r.salon.name}" (${r.salon.city}) me ${r.employee.name}`)
    .join("\n");

  const salonsText = allSalons
    .map((s) => `"${s.name}" (${s.city}): ${s.services.map((sv) => sv.name).join(", ")}`)
    .join("\n");

  const prompt = `Bazuar në historikun e rezervimeve të klientit:
${historyText}

Salonet dhe shërbimet e disponueshme:
${salonsText}

Gjenero 3 rekomandime të personalizuara. Kthe një JSON me këtë format:
{
  "recommendations": [
    { "salonName": "...", "serviceName": "...", "reason": "..." }
  ]
}
Përgjigju vetëm me JSON, pa tekst shtesë.`;

  const response = await getOpenAI().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return { recommendations: parsed.recommendations || [], usage: response.usage };
};

// ─────────────────────────────────────────────
// OPSIONI 3: GJENERIM I PËRSHKRIMEVE
// ADMIN/OWNER jep emrin → AI gjeneron përshkrim
// ─────────────────────────────────────────────
const generateDescription = async ({ serviceName, duration, price, salonCity }) => {
  const prompt = `Shkruaj një përshkrim profesional dhe tërheqës për këtë shërbim kozmetik:
Emri: ${serviceName}
Kohëzgjatja: ${duration} minuta
Çmimi: €${price}
Qyteti i salonit: ${salonCity || "Kosovë"}

Përshkrimi duhet të jetë:
- 2-3 fjali
- Profesional dhe tërheqës për klientët
- Në gjuhën shqipe
- Maksimumi 80 fjalë`;

  const response = await getOpenAI().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.8,
  });

  return {
    description: response.choices[0].message.content.trim(),
    usage: response.usage,
  };
};

module.exports = { chat, getRecommendations, generateDescription };
