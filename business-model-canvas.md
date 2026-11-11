# RIBAT — Business Model Canvas and Operating Model

## 1. Executive definition

**RIBAT is a privacy-preserving receivable link-integrity registry for Tunisia, then MENA.** Before a bank, factor, leasing company or other lender advances money against an invoice or a bill of exchange, RIBAT answers one operational question:

> Has this exact receivable already been promised to someone else, and who is senior?

   RIBAT returns the answer without exposing the invoice, debtor, supplier, amount or lender portfolio. It records the claim order using a tamper-evident public audit layer, while keeping commercial data off-chain. The product is designed as evidence and coordination infrastructure, not as a cryptocurrency, payment rail or lending marketplace.

---

## 2. The core problem

Receivables are often financed based on fragmented evidence. The same invoice or bill of exchange can be discounted, pledged, assigned or presented to multiple financiers because each institution sees only its own relationship with the customer. Existing checks are expensive, slow, inconsistent and generally reveal more information than competitors want to share.

The result is a **link-integrity problem**: the legal or economic right may exist, but the market cannot reliably determine whether that right has already been promised, to whom, and in what priority order.

### Primary problems

1. **Double financing and duplicate pledges**: the same receivable may be promised to more than one lender.

1. **Weak priority evidence**: lenders may not be able to prove who registered or received the right first.

1. **Privacy conflict**: lenders need a yes/no answer, not access to competitors’ invoices, prices, customers or portfolios.

1. **Small-ticket economics**: manual diligence and minimum fees make smaller receivables uneconomic to finance.

1. **Instrument substitution risk**: when policy changes reduce cheque use, risk can move into bills of exchange and other instruments without a matching registry layer.

1. **Dispute and freeze risk**: when a claim is challenged, an operator should not be able to freeze it unilaterally without a controlled due-process process.

1. **Limited trust between competitors**: rival lenders need a neutral shared record rather than trusting one commercial intermediary.

### The core job-to-be-done

> Before funding a receivable, let me verify its prior encumbrance and priority in seconds, without revealing my customer relationship or exposing my portfolio.

---

## 3. Problem tree: causes and consequences

### Root causes

- Receivable data is distributed across banks, factors, leasing companies, SMEs, debtors and accounting systems.

- Financing institutions use different formats and reference conventions.

- Invoice numbers can be changed, reissued or formatted differently across systems.

- Government e-invoicing identifiers prove that an invoice exists, but do not necessarily prove whether it has already been pledged.

- There is no broadly trusted, neutral, asset-level encumbrance layer for the relevant market participants.

- Manual checks are costly and often designed for larger customers and tickets.

- Legal priority and enforceability are not automatically created by technology; they require contractual and regulatory support.

- Commercial competitors are reluctant to share raw invoices, names, amounts or portfolio data.

### Immediate consequences

- Duplicate financing may be discovered late or only after payment default.

- Lenders increase haircuts, prices and documentation requirements.

- SMEs receive less credit, especially for smaller invoices.

- Factors and leasing companies carry avoidable operational and fraud risk.

- Disputes are difficult to resolve because timestamps, evidence and authority are fragmented.

- Regulators and insurers lack reliable aggregate data about link failures and prevented losses.

### System-level consequences

- Credit remains concentrated among larger companies and larger ticket sizes.

- The same legal or economic receivable may support multiple competing claims.

- Market participants underinvest in a shared infrastructure because no single lender captures all of the benefit.

- Trust remains an institutional barrier to SME finance.

---

## 4. The solution

RIBAT combines six product capabilities:

### A. Private canonicalisation

The lender submits structured invoice or bill-of-exchange fields locally. RIBAT derives multiple canonical keys so that different formatting or a renumbered reissue can still be compared. The initial key families are:

- **INV1**: supplier, buyer, invoice number and issue date.

- **INV2**: official e-invoicing or TTN reference.

- **INV3**: supplier, buyer, issue date and amount, used as a reissue signal.

A collision on one key is not automatically treated as fraud. It can trigger mediated disclosure or review to manage false positives such as two legitimate same-day, same-amount invoices.

### B. Privacy-preserving collision check

The production design uses blinded or threshold-operated evaluation so the registry can answer clear/collision without receiving the raw invoice. Queries are authenticated, rate-limited and audit-logged because low-entropy guesses remain a residual risk.

### C. Priority registry

A clear receivable can be registered atomically. The first valid registration receives rank 1. A later registration receives a collision response with the senior timestamp and rank rather than silently creating an ambiguous state.

### D. Publicly verifiable audit layer

RIBAT publishes hashes, pseudonymous identifiers, consensus timestamps, status and epoch roots to a public audit layer such as Hedera Consensus Service. Commercial documents, amounts, names and portfolios remain off-chain. A lender, regulator, court or rival institution can independently verify the history.

### E. Due-process bridge

Disputed claims can enter a guardian workflow. A proposal requires a defined quorum, time-lock and public order events. The operator cannot freeze a claim alone. Orders expire automatically and can be reviewed through an appeal or arbitration path.

### F. Link Card, score and data products

Each receivable pool can have a redacted Link Card containing asset class, jurisdiction, status, score, attestation state and audit anchor. Aggregated incident data can support risk analytics, insurance, underwriting and regulator reporting.

---

## 5. Business Model Canvas

| Canvas block | RIBAT model |
| --- | --- |
| **Customer segments** | Banks and bank discount desks; factoring companies; leasing companies; supply-chain finance providers; guarantee funds and insurers; large debtors that want controlled reverse factoring; regulators and public institutions as oversight or data partners; SME networks as distribution channels. |
| **Early adopter segment** | One factor, leasing house or bank with a meaningful invoice/traite book, a senior risk or credit-operations sponsor, and enough cross-customer activity to produce measurable collision signals. The initial atomic network is one lender, 20–50 SME clients and their top debtors. |
| **Value propositions** | Verify in seconds whether a receivable has already been promised; avoid duplicate financing; preserve lender privacy; establish a neutral order of claims; reduce manual diligence cost; support small-ticket financing; make disputes auditable; provide a path from evidence to insurance and better risk pricing. |
| **Channels** | Design-partner lender pilots; BCT regulatory sandbox route; direct enterprise sales to risk/credit operations; partnerships with TTN/El Fatoora ecosystem participants; TunTrust/PKI providers; insurer and guarantee-fund channels; SME associations; Hedera ecosystem and regional fintech partnerships. |
| **Customer relationships** | Founder-member or consortium model; 90-day measurement pilot; implementation support; API and dashboard access; named risk-operations sponsor; quarterly governance; incident and dispute SLAs; transparent charter, fee cap and exit rights. |
| **Revenue streams** | Per-check or per-registration usage fee paid by lenders; lender SaaS subscription; attestation and debtor-confirmation fees; data and risk-score products; insurance or warranty distribution/MGA economics once a licensed insurer is involved; integration and onboarding fees for larger institutions. SMEs should initially be free or subsidised to encourage network formation. |
| **Key resources** | Neutral governance and legal recognition; canonical-key and privacy technology; registry contracts and APIs; Hedera audit topics and mirror-node indexing; lender network; historical collision and loss dataset; guardian panel; jurisdiction schedules; legal opinion library; security and compliance processes; insurer relationships. |
| **Key activities** | Operate the registry gateway; authenticate members; derive and evaluate keys; register and release claims; publish and index audit events; operate guardian workflows; maintain LinkScore rules; onboard lenders; measure collision rates; maintain legal and jurisdiction schedules; manage incidents; prepare insurer and regulator reporting. |
| **Key partners** | BCT sandbox and fintech stakeholders; TTN/El Fatoora ecosystem; lenders and factors; TunTrust/PKI providers; regulated lawyers, arbitrators and bailiffs as guardians; insurers, reinsurers and guarantee funds; Hedera ecosystem partners; SME associations; development-finance institutions; cybersecurity and audit firms. |
| **Cost structure** | Product and security engineering; legal opinions and regulatory work; guardian and arbitration costs; infrastructure, Hedera fees and key management; lender onboarding and support; compliance and KYC; audits; insurance/MGA setup; sales and validation; regional localisation. |

---

## 6. Who will use RIBAT?

### Primary users

**Lender risk or credit officer.** Runs a check before approving an advance, interprets clear/collision, sees the senior timestamp and decides whether to proceed, pause or escalate.

**Lender operations officer.** Submits structured receivable data, registers a clear claim, releases it when paid and maintains operational records.

**Factor or leasing-company manager.** Monitors collision rates, protected volume, prevented duplicate cases and portfolio-level economics.

### Secondary users

**Guardian, lawyer, arbitrator or regulated professional.** Reviews a dispute, approves or rejects a freeze order and acts within the time-lock and quorum rules.

**Large debtor or accounts-payable team.** Confirms a receivable or participates in reverse factoring without exposing its full accounts-payable book.

**Insurer or guarantee fund.** Uses verified link history, incident data and score outputs to underwrite a warranty or first-loss product.

**Regulator or public institution.** Verifies the audit trail and receives aggregated anonymised statistics, without accessing lender portfolios or commercial documents.

**SME, accountant or finance manager.** Benefits from a clean receivable proof and faster access to funding; should not need to manage crypto or interact with Hedera directly.

---

## 7. End-to-end usage steps

### Standard financing flow

1. **Member authentication**: the lender signs in as an approved member.

1. **Receivable intake**: the lender enters or imports structured invoice/traite fields from its existing workflow.

1. **Local canonicalisation**: the client derives INV1, INV2 and INV3 candidates.

1. **Blinding and submission**: the candidates are blinded before leaving the lender environment.

1. **Privacy-preserving evaluation**: RIBAT returns evaluated points or a verified clear/collision result.

1. **Clear result**: if no collision is found, the lender can proceed to registration.

1. **Atomic registration**: RIBAT registers the claim and records the consensus timestamp, rank, pseudonymous party ID and document hash.

1. **Funding decision**: the lender advances cash through normal bank rails; RIBAT does not settle money.

1. **Public verification**: the lender, regulator or court can open a redacted Verify page and independently inspect the audit anchor.

1. **Release on repayment**: the lender releases the claim when the receivable is paid or otherwise discharged.

### Collision flow

1. A second lender submits its candidate keys.

1. RIBAT detects a collision on one or more keys.

1. The system returns `BLOCKED`, the senior rank and consensus timestamp, without revealing the senior lender’s identity or commercial details.

1. If the collision is a possible false positive, the parties can use mediated disclosure or a dispute process.

1. If the claim is genuinely disputed, a guardian order can be proposed.

### Due-process flow

1. A member or authorised party proposes a freeze order with a reason, affected claim and expiry.

1. Independent guardians review the order.

1. The required quorum approves it.

1. A time-lock prevents immediate unilateral execution.

1. The order executes only after the delay and required approvals.

1. The order and its outcome are publicly auditable.

1. The freeze auto-expires unless renewed through the defined process.

1. The final outcome is recorded and the claim is released, frozen or escalated to arbitration.

---

## 8. Impact model

### Direct customer impact

- Fewer duplicate-financing losses.

- Faster and cheaper pre-funding checks.

- More consistent priority evidence.

- Less sensitive data shared between competitors.

- Lower operational friction for small-ticket receivables.

- More controlled handling of disputes and freezes.

### SME and market impact

- More receivables become financeable because diligence costs fall.

- SMEs can access a clean receivable proof without holding crypto or understanding Hedera.

- Lenders can price risk using evidence rather than broad haircuts.

- A shared infrastructure can reduce the incentive to move risk between instruments when one payment instrument is reformed.

### Regulator and insurer impact

- Auditable asset-level evidence complements central incident registers.

- Aggregated, anonymised collision and loss data can support supervision.

- Insurers and guarantee funds can underwrite a measurable link-warranty product.

- Public institutions can verify history without receiving the underlying commercial book.

### Impact metrics

| Metric | Definition | First pilot target |
| --- | --- | --- |
| Collision rate | Collisions detected per receivable checked | Establish baseline across 3–5 lenders |
| Prevented duplicate value | TND value of advances stopped or escalated | Measure with lender evidence |
| Cost per check | Staff time and direct cost before vs after RIBAT | Reduce to approximately seconds and low single-digit millimes/dinars |
| Coverage | Share of lender receivable flow checked | 25%+ for a live design-partner book |
| False-positive rate | Single-key collisions resolved as legitimate twins | Track by key and instrument |
| Time to dispute decision | Proposal to guardian outcome | Define SLA with legal partner |
| SME access | Number and value of smaller-ticket receivables financed | Compare pre/post pilot cohort |
| Network adoption | Active lenders and cross-lender collision observations | 3 lenders for proof of network value |

---

## 9. How RIBAT makes money

The initial business should prioritise measurement and network formation over maximising usage fees. A practical sequence is:

### Phase 0 — Free measurement pilot

RIBAT works with 3–5 lenders using blinded keys only. It measures collision rate, current check cost, false positives and duplicate-financing stories. This phase produces evidence for legal, regulatory and insurer conversations.

### Phase 1 — Paid registry usage

Lenders pay a small per-check or per-registration fee. SMEs are free or subsidised. The fee is positioned as a loss-prevention and diligence cost, not as an innovation budget.

### Phase 2 — SaaS and attestation

Larger institutions pay for portfolio dashboards, API access, debtor confirmations, SLA tiers, audit exports and operational analytics.

### Phase 3 — Warranty and risk data

With a licensed insurer or guarantee partner, RIBAT supports a link-warranty product. This can become the largest revenue line, but it must not be treated as RIBAT’s own balance-sheet insurance risk without the right licence and capital structure.

### Phase 4 — Regional infrastructure

The same core registry is adapted to Morocco, Egypt, Jordan, Gulf markets and other jurisdictions through jurisdiction schedules, local e-invoice adapters, local legal opinions and local partners.

---

## 10. Adoption strategy

1. Secure one design-partner lender with a measurable receivable book.

1. Run a free, privacy-preserving collision measurement pilot.

1. Quantify the lender’s current cost per check and at least one duplicate-financing story.

1. Obtain a Tunisian legal opinion on assignment, registration priority, enforceability and data protection.

1. Apply through the BCT sandbox route with the crypto-invisible design: no customer wallets, no token trading, operator-paid fees and hashes only on the public audit layer.

1. Add a second lender to create cross-institution collisions and prove network value.

1. Add a third lender, an insurer and a guardian panel.

1. Convert the founding group into a neutral governance structure with voting caps, member exit rights, fee caps and open-source contracts.

1. Publish aggregated impact metrics and a transparent incident process.

1. Expand to the next MENA jurisdiction only after the Tunisia pilot demonstrates measurable value and legal/regulatory viability.

---

## 11. Key risks and assumptions

The most important assumption is the actual rate of link failures or duplicate-financing attempts. The first milestone is therefore measurement, not broad launch.

The most important legal question is whether registration and contractual priority can be made enforceable among relevant parties in Tunisia. If not, RIBAT should reposition as an evidence, verification and reporting layer rather than claim to determine legal priority.

The most important commercial risk is adoption. A partial registry can displace activity rather than eliminate the problem, so the first network must include a founder lender, enough SMEs and enough shared debtors to generate meaningful collisions.

The most important product risk is privacy. The system must minimise on-chain data, authenticate and rate-limit queries, protect operator keys, use threshold key management in production and maintain a documented incident response process.

The most important revenue risk is the warranty line. RIBAT should not depend on insurance economics until a licensed carrier, MGA or guarantee partner is engaged.

---

## 12. Validation plan and go/no-go criteria

### Interviews and evidence

Conduct ten structured conversations: three lender risk or credit officers, three SME finance managers, one large-debtor accounts-payable lead, one Tunisian lawyer, one TTN or fintech ecosystem contact, and one insurer or guarantee-fund contact.

The interviews should produce at least three written pilot intents, one baseline cost-per-check number, two real duplicate-financing stories and one named objection that has been answered in the product or pilot terms.

### Pilot gates

Advance to a sandbox pilot when at least three lenders agree to participate, a credible legal route is identified, the collision measurement is operational and the first guardian panel is available.

Advance to a commercial registry when the product has measured prevented duplicates, a security review, a live operational SLA, a local authentication path and an insurer or guarantee partner willing to explore warranty economics.

Kill or pivot if the measured collision/link-failure rate is materially below the break-even assumption, if counsel finds no credible route to enforceable priority, or if no insurer/guarantee partner engages within the planned period. The fallback product is a pure evidence and reporting service.

---

## 13. One-page summary

**Problem:** lenders cannot cheaply and privately know whether the same receivable has already been promised to someone else.

**Causes:** fragmented records, inconsistent identifiers, reissued instruments, expensive manual diligence, competitor privacy concerns, weak priority evidence and limited trust in intermediaries.

**Solution:** RIBAT canonically identifies receivables, performs a privacy-preserving collision check, records priority, anchors redacted proof on a public audit layer and provides a guardian-controlled dispute path.

**Users:** banks, factors, leasing companies, supply-chain finance providers, insurers, guarantee funds, guardians, regulators, large debtors and SMEs.

**Value:** fewer duplicate-financing losses, cheaper checks, better priority evidence, more financeable small tickets and auditable disputes.

**Business model:** lender usage fees, SaaS, attestations, risk data and insurer-backed warranty economics.

**First step:** run a 3–5 lender anonymous measurement pilot and replace the loss-rate assumption with observed data.

