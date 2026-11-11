import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Ban,
  BellRing,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Database,
  FileCheck2,
  FileKey2,
  Fingerprint,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRoundCheck,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  canonicalKeys,
  DEMO_NULLIFIER,
  DEMO_REF,
  initialClaims,
  initialEvents,
  initialFreeze,
  initialMetrics,
  makeNullifier,
  type CheckStatus,
  type Claim,
  type FreezeState,
  type Metrics,
  type RegistryEvent,
} from "@/lib/ribat-demo";

type Section = "overview" | "check" | "journal" | "scenarios";

type FormState = {
  ref: string;
  type: "Facture" | "Traite";
  supplier: string;
  buyer: string;
  issueDate: string;
  amount: string;
};

const initialForm: FormState = {
  ref: "",
  type: "Facture",
  supplier: "Fournisseur synthétique",
  buyer: "Acheteur synthétique",
  issueDate: "2026-10-27",
  amount: "10 100",
};

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Vue d’ensemble", icon: LayoutDashboard },
  { id: "check", label: "Vérifier une créance", icon: ScanSearch },
  { id: "journal", label: "Journal du registre", icon: Activity },
  { id: "scenarios", label: "Scénarios de démo", icon: Sparkles },
];

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "teal" | "orange" | "violet" }) {
  return <span className={`status-pill status-pill-${tone}`}>{children}</span>;
}

function Metric({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof ShieldCheck; tone: "teal" | "orange" | "violet" | "ink" }) {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className={`metric-icon metric-${tone}`}><Icon size={17} strokeWidth={1.8} /></span>
        <span className="metric-note">{note}</span>
      </div>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </div>
  );
}

function Logo() {
  return (
    <div className="brand-lockup">
      <div className="brand-mark" aria-hidden="true"><span>R</span></div>
      <div><span className="brand-name">RIBAT</span><span className="brand-subtitle">LINK INTEGRITY</span></div>
    </div>
  );
}

function RegistryEventRow({ event }: { event: RegistryEvent }) {
  return (
    <div className="event-row">
      <div className={`event-marker marker-${event.tone}`}><span /></div>
      <div className="event-time">{event.time}</div>
      <div className="event-copy"><p>{event.title}</p><span>{event.detail}</span></div>
      <span className={`event-tag event-tag-${event.tone}`}>{event.tag}</span>
    </div>
  );
}

function CheckPanel({ form, setForm, status, onCheck, onRegister, keys, claim }: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  status: CheckStatus;
  onCheck: () => void;
  onRegister: () => void;
  keys: ReturnType<typeof canonicalKeys>;
  claim?: Claim;
}) {
  const field = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => setForm(current => ({ ...current, [key]: event.target.value }));
  return (
    <section className="panel check-panel" id="check-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">ÉTAPE 01 / CONTRÔLE PRIVÉ</span><h2>Vérifier avant d’avancer.</h2></div>
        <StatusPill tone="teal"><LockKeyhole size={12} /> OPRF blindé</StatusPill>
      </div>
      <p className="panel-intro">RIBAT dérive jusqu’à trois clés canoniques. Le registre ne reçoit ni nom, ni montant, ni document.</p>
      <div className="form-grid">
        <label className="field"><span>Référence TEIF / traite</span><input value={form.ref} onChange={field("ref")} placeholder="Ex. INV-2026-00418" /></label>
        <label className="field"><span>Nature</span><select value={form.type} onChange={event => setForm(current => ({ ...current, type: event.target.value as FormState["type"] }))}><option>Facture</option><option>Traite</option></select></label>
        <label className="field"><span>Fournisseur</span><input value={form.supplier} onChange={field("supplier")} /></label>
        <label className="field"><span>Acheteur / débiteur</span><input value={form.buyer} onChange={field("buyer")} /></label>
        <label className="field"><span>Date d’émission</span><input type="date" value={form.issueDate} onChange={field("issueDate")} /></label>
        <label className="field"><span>Montant (TND)</span><input value={form.amount} onChange={field("amount")} /></label>
      </div>
      <div className="canonical-strip">
        <span className="canonical-label"><Fingerprint size={14} /> Clés dérivées localement</span>
        <div className="key-list">{keys.map(key => <span className={key.matched ? "key-chip key-chip-hit" : "key-chip"} key={key.name}><b>{key.name}</b>{key.value}</span>)}</div>
      </div>
      <div className="check-actions">
        <Button className="primary-button" onClick={onCheck}><ScanSearch size={16} /> Lancer le contrôle <ArrowUpRight size={15} /></Button>
        <span className="action-hint"><ShieldCheck size={14} /> Authentifié · journalisé</span>
      </div>
      {status === "clear" && <div className="result-card result-clear"><div className="result-icon"><Check size={18} /></div><div><span className="result-kicker">CLEAR / aucune antériorité</span><h3>Cette créance est libre.</h3><p>Trois clés ont été contrôlées. Elle peut maintenant être enregistrée atomiquement.</p></div><Button className="result-button" onClick={onRegister}>Enregistrer <ChevronRight size={15} /></Button></div>}
      {status === "registered" && <div className="result-card result-clear"><div className="result-icon"><BadgeCheck size={18} /></div><div><span className="result-kicker">REGISTERED / rang 1</span><h3>Créance enregistrée sur le registre.</h3><p>{claim?.nullifier} · Consensus {claim?.seniorAt}</p></div><Link className="result-button result-link" href={`/verify/${encodeURIComponent(claim?.nullifier ?? DEMO_NULLIFIER)}`}>Ouvrir Verify <ArrowUpRight size={15} /></Link></div>}
      {status === "collision" && <div className="result-card result-collision"><div className="result-icon"><Ban size={18} /></div><div><span className="result-kicker">BLOCKED / double promesse</span><h3>Cette créance est déjà senior.</h3><p>Rang 1 détenu par un membre enregistré à {DEMO_REF === form.ref ? "09:42:16" : "09:41:52"}. Aucun détail commercial n’est révélé.</p><div className="collision-meta"><span><b>Rang senior</b> #1</span><span><b>Clé en collision</b> {keys.find(key => key.matched)?.name ?? "INV3"}</span></div></div><Button variant="outline" className="result-outline" onClick={() => setForm(initialForm)}>Réinitialiser <RefreshCcw size={14} /></Button></div>}
    </section>
  );
}

function DueProcess({ freeze, onApprove, onExecute }: { freeze: FreezeState; onApprove: () => void; onExecute: () => void }) {
  const done = freeze.status === "executed" || freeze.status === "expired";
  return <section className="panel due-panel"><div className="panel-heading"><div><span className="eyebrow">ÉTAPE 03 / DUE PROCESS</span><h2>Un gel ne se fait jamais seul.</h2></div><StatusPill tone={freeze.status === "executed" ? "teal" : freeze.status === "expired" ? "neutral" : "violet"}><UsersRound size={12} /> {freeze.status === "expired" ? "EXPIRÉ" : freeze.status === "executed" ? "EXÉCUTÉ" : "TIME-LOCK"}</StatusPill></div><div className="due-body"><div className="due-copy"><p>Ordre <code>ord_83A2…F1D0</code> · Freeze / pool party_38D1</p><div className="approval-count"><strong>{freeze.approvals}</strong><span>/ 3 gardiens approuvés</span></div><div className="approval-bar"><span style={{ width: `${Math.min(freeze.approvals / 2 * 100, 100)}%` }} /></div><p className="muted">ETA d’exécution : <b>{freeze.eta}</b><br />Auto-expiration : <b>{freeze.expiresAt}</b></p></div><div className="guardian-list"><div className="guardian-row"><span className="guardian-avatar">AM</span><span>Arbitre A. M.</span><span className="guardian-check"><Check size={13} /></span></div><div className="guardian-row"><span className="guardian-avatar">NS</span><span>Juriste N. S.</span><span className={`guardian-action ${freeze.approvals > 1 ? "approved" : ""}`} onClick={freeze.approvals < 2 ? onApprove : undefined}>{freeze.approvals > 1 ? <Check size={13} /> : "Approuver"}</span></div><div className="guardian-row"><span className="guardian-avatar">YK</span><span>Notaire Y. K.</span><span className="guardian-pending">En attente</span></div><Button disabled={done || freeze.approvals < 2} className="execute-button" onClick={onExecute}>{done ? "Ordre terminé" : "Exécuter après quorum"} <TimerReset size={14} /></Button></div></div></section>;
}

function LinkCard({ metrics }: { metrics: Metrics }) {
  const [copied, setCopied] = useState(false);
  const copyCard = async () => {
    const payload = JSON.stringify({ assetClass: "receivable.invoice", jurisdiction: "TN · TEIF", score: 82, anchor: "HCS topic 0.0.741920 · simulated" });
    try { await navigator.clipboard?.writeText(payload); } catch { /* clipboard can be unavailable in embedded preview */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <section className="panel link-card-panel"><div className="panel-heading"><div><span className="eyebrow">LINK CARD / POOL 38D1</span><h2>Une preuve lisible, pas un token.</h2></div><StatusPill tone="orange"><Sparkles size={12} /> SCORE V0</StatusPill></div><div className="score-row"><div className="score-ring"><strong>82</strong><span>/ 100</span></div><div><p className="score-label">LinkScore</p><p className="score-copy">Historique propre · identité e-invoice · confirmation débiteur en attente.</p></div></div><div className="link-card-json"><div><span>assetClass</span><b>receivable.invoice</b></div><div><span>jurisdiction</span><b>TN · TEIF</b></div><div><span>anchor</span><b>HCS topic 0.0.741920 · simulated</b></div><div><span>HCS tx / coût</span><b>{metrics.hederaTx.toLocaleString("fr-FR")} · 0,09 TND</b></div><button aria-label="Copier le JSON" onClick={copyCard}>{copied ? <Check size={14} /> : <Copy size={14} />}</button></div></section>;
}

function ScenarioBoard({ onScenario }: { onScenario: (scenario: "double" | "reissue" | "freeze") => void }) {
  return <section className="scenario-board"><div className="section-heading"><div><span className="eyebrow">LABORATOIRE DE DÉMO</span><h2>Trois scénarios, un même registre.</h2></div><span className="small-note">Données 100% synthétiques</span></div><div className="scenario-grid"><button className="scenario-card scenario-orange" onClick={() => onScenario("double")}><span className="scenario-index">01</span><span className="scenario-icon"><Ban size={19} /></span><span className="scenario-title">Double financement</span><span className="scenario-copy">Le lender B tente de financer la même facture.</span><span className="scenario-cta">Jouer le scénario <ArrowUpRight size={14} /></span></button><button className="scenario-card scenario-teal" onClick={() => onScenario("reissue")}><span className="scenario-index">02</span><span className="scenario-icon"><KeyRound size={19} /></span><span className="scenario-title">Réémission renumérotée</span><span className="scenario-copy">INV1 change, INV3 détecte le lien économique.</span><span className="scenario-cta">Jouer le scénario <ArrowUpRight size={14} /></span></button><button className="scenario-card scenario-violet" onClick={() => onScenario("freeze")}><span className="scenario-index">03</span><span className="scenario-icon"><LockKeyhole size={19} /></span><span className="scenario-title">Gel avec recours</span><span className="scenario-copy">Deux gardiens, un time-lock, puis expiration.</span><span className="scenario-cta">Jouer le scénario <ArrowUpRight size={14} /></span></button></div></section>;
}

export default function Home() {
  const [section, setSection] = useState<Section>("overview");
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [events, setEvents] = useState<RegistryEvent[]>(initialEvents);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [freeze, setFreeze] = useState<FreezeState>(initialFreeze);
  const [mobileMenu, setMobileMenu] = useState(false);
  const keys = useMemo(() => canonicalKeys(form.ref, form.supplier, form.buyer, form.issueDate, form.amount), [form]);
  const activeClaim = claims.find(claim => claim.ref === form.ref) ?? claims[0];

  useEffect(() => {
    if (freeze.status !== "executed") return;
    const timeout = window.setTimeout(() => {
      setFreeze(current => current.status === "executed" ? { ...current, status: "expired" } : current);
      addEvent({ id: `evt-${Date.now()}`, time: "à l’instant", title: "Gel auto-expiré", detail: "party_38D1 · fenêtre de recours terminée", tone: "ink", tag: "EXPIRED" });
    }, 6500);
    return () => window.clearTimeout(timeout);
  }, [freeze.status]);

  const addEvent = (event: RegistryEvent) => setEvents(current => [event, ...current].slice(0, 7));
  const runCheck = () => {
    const collision = form.ref.trim().toUpperCase() === DEMO_REF || form.ref.toUpperCase().includes("REISSUE") || form.ref.toUpperCase().includes("418");
    setStatus(collision ? "collision" : "clear");
    if (collision) {
      setMetrics(current => ({ ...current, collisions: current.collisions + 1 }));
      addEvent({ id: `evt-${Date.now()}`, time: "à l’instant", title: "Collision détectée", detail: `${form.ref || "Créance test"} · ${keys.find(key => key.matched)?.name ?? "INV3"}`, tone: "orange", tag: "BLOCKED" });
    }
  };
  const registerClaim = () => {
    const newClaim: Claim = { id: `clm-${Date.now()}`, ref: form.ref || "INV-NEW-001", type: form.type, partyId: "party_4B7E", nullifier: makeNullifier(form.ref, form.buyer, form.amount), rank: 1, seniorAt: "27 oct. 2026 · à l’instant", registeredAt: "27 oct. 2026 · à l’instant", status: "active", detectionKey: "INV1", lender: "Lender A · Tunis" };
    setClaims(current => [newClaim, ...current]);
    setStatus("registered");
    setMetrics(current => ({ ...current, protected: current.protected + 1, tnd: "4,2 M", hederaTx: current.hederaTx + 2 }));
    addEvent({ id: `evt-${Date.now()}`, time: "à l’instant", title: "Créance enregistrée", detail: `${newClaim.ref} · rang 1 · HCS #8,491,${String(208 + claims.length).padStart(3, "0")}`, tone: "teal", tag: "REGISTERED" });
  };
  const onScenario = (scenario: "double" | "reissue" | "freeze") => {
    setSection(scenario === "freeze" ? "overview" : "check");
    if (scenario === "double") setForm({ ...initialForm, ref: DEMO_REF });
    if (scenario === "reissue") setForm({ ...initialForm, ref: "INV-REISSUE-418", buyer: "Acheteur synthétique" });
    if (scenario === "freeze") document.getElementById("due-process")?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (scenario !== "freeze") setTimeout(() => document.getElementById("check-panel")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };
  const approveFreeze = () => setFreeze(current => ({ ...current, approvals: Math.min(2, current.approvals + 1), eta: "27 oct. · 10:37" }));
  const executeFreeze = () => {
    setFreeze(current => ({ ...current, status: "executed" }));
    setClaims(current => current.map(claim => claim.ref === "INV-2026-00372" ? { ...claim, status: "frozen" } : claim));
    addEvent({ id: `evt-${Date.now()}`, time: "à l’instant", title: "Gel exécuté par quorum", detail: "party_38D1 · 2 / 3 gardiens · HCS ORDER", tone: "violet", tag: "EXECUTED" });
  };

  const renderContent = () => {
    if (section === "journal") return <section className="panel journal-panel"><div className="panel-heading"><div><span className="eyebrow">EVENT STREAM / APPEND-ONLY</span><h2>Journal du registre.</h2></div><StatusPill tone="teal"><Network size={12} /> miroir synchronisé</StatusPill></div><p className="panel-intro">Tout événement métier est rejouable depuis les événements de chaîne. Les identifiants commerciaux restent hors chaîne.</p><div className="event-list full-list">{events.map(event => <RegistryEventRow key={event.id} event={event} />)}</div></section>;
    if (section === "scenarios") return <><ScenarioBoard onScenario={onScenario} /><div className="scenario-explainer"><div className="explainer-icon"><CircleHelp size={19} /></div><div><span className="eyebrow">À PROPOS DE LA DÉMO</span><h3>Un registre de preuve, pas un registre de contenu.</h3><p>Les valeurs affichées sont synthétiques. Le prototype simule le contrôle OPRF, les timestamps de consensus et les messages HCS pour rendre le parcours testable sans exposer de document ni exiger de compte crypto.</p></div></div></>;
    if (section === "check") return <div className="content-stack"><CheckPanel form={form} setForm={setForm} status={status} onCheck={runCheck} onRegister={registerClaim} keys={keys} claim={activeClaim} /><ScenarioBoard onScenario={onScenario} /></div>;
    return <div className="content-stack"><div className="metric-grid"><Metric label="Créances protégées" value={metrics.protected.toLocaleString("fr-FR")} note="+12,4% ce mois" icon={ShieldCheck} tone="teal" /><Metric label="Collisions bloquées" value={metrics.collisions.toString()} note="18 dossiers évités" icon={Ban} tone="orange" /><Metric label="TND protégés" value={metrics.tnd} note="estimation pilote" icon={Gauge} tone="violet" /><Metric label="Coût / créance" value={metrics.cost} note="frais opérateur" icon={Zap} tone="ink" /></div><div className="main-split"><CheckPanel form={form} setForm={setForm} status={status} onCheck={runCheck} onRegister={registerClaim} keys={keys} claim={activeClaim} /><div className="side-stack"><section className="panel activity-panel"><div className="panel-heading"><div><span className="eyebrow">LIVE / REGISTRY</span><h2>Derniers événements</h2></div><button className="icon-button" aria-label="Plus d’options"><MoreHorizontal size={18} /></button></div><div className="event-list">{events.slice(0, 5).map(event => <RegistryEventRow key={event.id} event={event} />)}</div><button className="text-button" onClick={() => setSection("journal")}>Voir tout le journal <ArrowUpRight size={14} /></button></section><LinkCard metrics={metrics} /></div></div><div id="due-process"><DueProcess freeze={freeze} onApprove={approveFreeze} onExecute={executeFreeze} /></div><ScenarioBoard onScenario={onScenario} /></div>;
  };

  return <div className="app-shell"><aside className={`app-sidebar ${mobileMenu ? "sidebar-open" : ""}`}><div className="sidebar-top"><Logo /><button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Fermer le menu"><X size={18} /></button></div><div className="workspace-switcher"><span className="workspace-dot" /><div><span className="workspace-label">Workspace</span><b>Tunis · Pilot</b></div><ChevronRight size={15} /></div><nav className="main-nav"><span className="nav-caption">REGISTRY CONSOLE</span>{navItems.map(item => <button key={item.id} className={`nav-item ${section === item.id ? "nav-item-active" : ""}`} onClick={() => { setSection(item.id); setMobileMenu(false); }}><item.icon size={17} strokeWidth={section === item.id ? 2.1 : 1.7} /><span>{item.label}</span>{item.id === "journal" && <span className="nav-count">5</span>}</button>)}</nav><div className="sidebar-lower"><div className="network-card"><div className="network-card-head"><span className="network-pulse" /> Hedera network</div><p>Testnet · operator paid</p><span className="network-id">0.0.741920</span></div><button className="help-button"><CircleHelp size={16} /> Centre d’aide <ArrowUpRight size={13} /></button><div className="user-card"><span className="user-avatar">LA</span><div><b>Lender A</b><span>Risk operations</span></div><MoreHorizontal size={15} /></div></div></aside>{mobileMenu && <button className="sidebar-scrim" onClick={() => setMobileMenu(false)} aria-label="Fermer le menu" />}<main className="app-main"><header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Ouvrir le menu"><Menu size={19} /></button><span className="breadcrumb">RIBAT <ChevronRight size={13} /> {navItems.find(item => item.id === section)?.label}</span></div><div className="topbar-right"><div className="live-status"><span className="live-dot" /> Registre opérationnel</div><span className="topbar-divider" /><button className="notification-button" aria-label="Notifications"><BellRing size={17} /><span /></button><span className="operator-label">Opérateur / <b>LA</b></span></div></header><div className="page-content"><div className="page-intro"><div><span className="eyebrow">MARDI 27 OCTOBRE 2026 · TUNISIE</span><h1>{section === "overview" ? "Vérifier avant d’avancer." : navItems.find(item => item.id === section)?.label}</h1><p>{section === "overview" ? "La couche de preuve qui empêche une créance d’être promise deux fois." : section === "check" ? "Contrôlez une facture ou une traite sans révéler l’opération au réseau." : section === "journal" ? "La chronologie append-only des décisions prises par le registre." : "Parcourez les situations qui rendent la promesse tangible."}</p></div><div className="page-actions"><StatusPill tone="orange"><span className="demo-dot" /> MODE DÉMO</StatusPill><Button variant="outline" className="new-check-button" onClick={() => { setSection("check"); setStatus("idle"); setForm(initialForm); }}><Plus size={16} /> Nouvelle vérification</Button></div></div>{renderContent()}<footer className="app-footer"><span><span className="footer-mark">R</span> RIBAT · Receivable Link Integrity</span><span>Prototype de validation · Hedera live non connecté <span className="footer-separator">/</span> <Link href="/verify/0x7ac4-9e21">Verify public</Link></span></footer></div></main></div>;
}
