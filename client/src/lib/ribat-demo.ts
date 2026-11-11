export type ClaimStatus = "active" | "frozen" | "released" | "expired";
export type CheckStatus = "idle" | "clear" | "collision" | "registered";

export type Claim = {
  id: string;
  ref: string;
  type: "Facture" | "Traite";
  partyId: string;
  nullifier: string;
  rank: number;
  seniorAt: string;
  registeredAt: string;
  status: ClaimStatus;
  detectionKey: "INV1" | "INV2" | "INV3";
  lender: string;
};

export type RegistryEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: "teal" | "orange" | "ink" | "violet";
  tag: string;
};

export type Metrics = {
  protected: number;
  collisions: number;
  tnd: string;
  hederaTx: number;
  cost: string;
};

export type FreezeState = {
  status: "ready" | "pending" | "executed" | "expired";
  approvals: number;
  eta: string;
  expiresAt: string;
};

export const DEMO_REF = "INV-2026-00418";
export const DEMO_NULLIFIER = "0x7ac4…9e21";

export const initialClaims: Claim[] = [
  {
    id: "clm-00418",
    ref: DEMO_REF,
    type: "Facture",
    partyId: "party_7F2A",
    nullifier: DEMO_NULLIFIER,
    rank: 1,
    seniorAt: "27 oct. 2026 · 09:42:16",
    registeredAt: "27 oct. 2026 · 09:42:16",
    status: "active",
    detectionKey: "INV1",
    lender: "Lender A · Tunis",
  },
  {
    id: "clm-00396",
    ref: "TR-2026-0096",
    type: "Traite",
    partyId: "party_19C4",
    nullifier: "0x11b3…42a8",
    rank: 1,
    seniorAt: "27 oct. 2026 · 09:31:04",
    registeredAt: "27 oct. 2026 · 09:31:04",
    status: "active",
    detectionKey: "INV2",
    lender: "Lender B · Sfax",
  },
  {
    id: "clm-00372",
    ref: "INV-2026-00372",
    type: "Facture",
    partyId: "party_38D1",
    nullifier: "0x84f0…c115",
    rank: 1,
    seniorAt: "27 oct. 2026 · 09:18:50",
    registeredAt: "27 oct. 2026 · 09:18:50",
    status: "frozen",
    detectionKey: "INV1",
    lender: "Lender C · Nabeul",
  },
];

export const initialEvents: RegistryEvent[] = [
  { id: "evt-1", time: "09:42:16", title: "Créance enregistrée", detail: "INV-2026-00418 · rang 1 · HCS #8,491,208", tone: "teal", tag: "REGISTERED" },
  { id: "evt-2", time: "09:41:52", title: "Collision détectée", detail: "Réémission renumérotée · clé INV3", tone: "orange", tag: "BLOCKED" },
  { id: "evt-3", time: "09:37:09", title: "Ordre de gel proposé", detail: "Pool party_38D1 · 1 / 3 approbations", tone: "violet", tag: "ORDER" },
  { id: "evt-4", time: "09:31:04", title: "Créance enregistrée", detail: "TR-2026-0096 · rang 1 · HCS #8,491,154", tone: "teal", tag: "REGISTERED" },
  { id: "evt-5", time: "09:28:44", title: "Racine d’époque publiée", detail: "epoch 2026-W43 · miroir vérifié", tone: "ink", tag: "ROOT" },
];

export const initialMetrics: Metrics = {
  protected: 1248,
  collisions: 18,
  tnd: "4,2 M",
  hederaTx: 3854,
  cost: "0,09 TND",
};

export const initialFreeze: FreezeState = {
  status: "pending",
  approvals: 1,
  eta: "27 oct. · 10:37",
  expiresAt: "30 oct. · 10:37",
};

export function makeNullifier(ref: string, buyer: string, amount: string) {
  const input = `${ref}|${buyer}|${amount}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, "0");
  return `0x${hex}${hex.slice(0, 4)}…${hex.slice(-4)}`;
}

export function canonicalKeys(ref: string, supplier: string, buyer: string, issueDate: string, amount: string) {
  const suffix = ref.replace(/[^A-Z0-9]/gi, "").slice(-6).toUpperCase() || "NEW";
  const day = issueDate.replace(/-/g, "").slice(-4) || "0000";
  const amt = amount.replace(/[^0-9]/g, "").slice(-5) || "00000";
  return [
    { name: "INV1", value: `${supplier.slice(0, 3).toUpperCase()}·${buyer.slice(0, 3).toUpperCase()}·${suffix}`, matched: ref === DEMO_REF },
    { name: "INV2", value: `TTN·${suffix}·${day}`, matched: ref === DEMO_REF },
    { name: "INV3", value: `${supplier.slice(0, 2).toUpperCase()}·${buyer.slice(0, 2).toUpperCase()}·${day}·${amt}`, matched: ref.includes("REISSUE") || ref.includes("418") },
  ] as const;
}
