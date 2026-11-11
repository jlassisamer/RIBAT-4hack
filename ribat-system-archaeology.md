# RIBAT — System Archaeology

## Purpose

This document explains RIBAT from the first user action to the final lifecycle state of a receivable. It is intentionally more detailed than a standard architecture diagram: it follows the movement of the smallest meaningful objects — raw fields, canonical keys, blinded query packages, claim records, events, consensus timestamps, epoch roots and dispute orders.

The diagrams are split into two views:

1. **System map**: actors, components, trust boundaries and the complete end-to-end graph.
2. **Node lifecycle**: a sequence view showing how each object moves, changes form and reaches its final state.

## Status legend

- **Implemented in the MVP**: represented by the current React demo and local state.
- **Simulated**: shown in the UI but not connected to live Hedera, a real OPRF service or durable production storage.
- **Future production boundary**: required for a production deployment and intentionally shown as a dashed node.
- **Public / redacted**: safe-to-publish fields only; no names, documents, amounts, tax IDs or lender portfolio data.

## Files

- [System architecture source](./ribat-system-archaeology.mmd)
- [Node lifecycle source](./ribat-node-lifecycle.mmd)
- [System architecture PNG](./ribat-system-archaeology.png)
- [Node lifecycle PNG](./ribat-node-lifecycle.png)

## The complete flow

### 0. Actors and entry points

The lender is the first operational actor. A risk officer or operations officer opens the console and enters an invoice or bill of exchange. The supplier and debtor are data subjects or business participants, but they do not need to see another lender’s portfolio. Guardians are independent professionals who participate only when a claim is challenged. Regulators, insurers and auditors consume redacted proof or aggregate metrics.

The production entry point is a gateway that authenticates the member, rate-limits queries and records an audit trail. In the current MVP, the console acts as the entry point and the registry state is local to the browser.

### 1. Raw receivable candidate — `N0`

`N0` is the initial small node: one candidate receivable as entered by the lender. It may contain:

- instrument type: invoice or bill of exchange;
- supplier and buyer identifiers;
- invoice/reference number;
- issue date;
- amount;
- official TTN / El Fatoora reference, when available.

At this stage, the information is private to the lender. N0 must never be copied into the public audit layer.

### 2. Validation and canonicalisation

The local client validates the input and normalises formatting. It then derives three comparable key nodes:

- `K1 / INV1`: supplier + buyer + reference + issue date;
- `K2 / INV2`: official e-invoice or TTN reference;
- `K3 / INV3`: supplier + buyer + issue date + amount.

The goal is not to use one fragile invoice number. The three keys reduce the risk that a renumbered or reformatted reissue bypasses the check. A match on INV3 is a signal that can require mediated disclosure rather than an automatic fraud conclusion.

The current MVP represents this with `canonicalKeys()` in `client/src/lib/ribat-demo.ts`. It is a local demonstration and is not cryptographically private.

### 3. Privacy boundary — `Q`

The three key candidates become a query package `Q` after blinding or hashing. In production, a private-evaluation mechanism such as a threshold-operated OPRF or another approved privacy-preserving construction must sit here.

The desired invariant is:

> The registry can test whether a candidate collides without receiving the raw document, raw name, amount, tax ID or lender portfolio.

The gateway authenticates the member and applies query controls. It should also prevent low-entropy guessing, because a blinded representation does not eliminate all inference risk.

### 4. Collision evaluation

The registry index compares the blinded candidates against existing commitments. It returns one of three operational outcomes:

- `CLEAR`: no existing commitment is found; the lender may attempt registration.
- `COLLISION`: an existing commitment is found; return only the senior rank and consensus timestamp to the later lender.
- `AMBIGUOUS`: a possible false positive needs mediated disclosure or review.

The later lender must never receive the senior lender’s identity or underlying commercial document from the basic collision response.

### 5. Atomic registration and claim node — `C`

A clear result is not enough by itself. Registration must be atomic:

1. Check whether the commitment exists.
2. If absent, create the claim with `rank = 1`.
3. If present, reject the later claim as a collision.
4. Emit one deterministic state transition.

The claim node `C` contains the minimum registry representation:

- `nullifier`: pseudonymous claim identifier;
- `partyId`: pseudonymous member or party identifier;
- `docHash`: commitment to the private document;
- `status`: active, frozen, released or expired;
- `rank`: priority position;
- `seniorAt`: consensus timestamp;
- `detectionKey`: INV1, INV2 or INV3 signal.

The commercial document and source fields remain in a private store owned by the lender or an authorised off-chain service.

### 6. Public audit event — `EV`

The state change becomes an event envelope. A public event should contain only:

- event type;
- nullifier;
- pseudonymous party ID;
- rank;
- status;
- consensus timestamp;
- sequence number or topic reference;
- epoch/root reference when available.

The event is anchored to Hedera Consensus Service in the production design. The current MVP labels this layer as simulated and shows synthetic HCS sequence references.

### 7. Mirror index and Verify page

A mirror/indexer consumes the event and builds a searchable history. The public Verify page reads the redacted fields and presents:

- registered, blocked, frozen, released or expired status;
- priority rank and senior timestamp;
- nullifier and pseudonymous party ID;
- epoch root or proof-chain reference;
- anchor state: simulated in the MVP, live only after a real integration.

The Verify page is not a document viewer. It must not reveal the invoice, names, amount, tax IDs or lender portfolio.

### 8. Funding and settlement

RIBAT does not move money. After a clear registration, the lender funds through ordinary bank rails. Payment confirmation later triggers a release request. The claim state becomes `RELEASED` when policy and evidence requirements are satisfied.

This separation is deliberate: RIBAT is evidence and coordination infrastructure, not a payment rail or a crypto wallet.

### 9. Dispute and guardian flow

A challenge creates a freeze-order node `O`. It contains a reason, affected claim, proposer identity/signature and expiry. Guardians review it independently:

1. Guardian 1 approves, rejects or requests more evidence.
2. Guardian 2 approves, rejects or requests more evidence.
3. Guardian 3 remains pending or joins the decision.
4. A quorum, for example 2 of 3, is required.
5. A time-lock prevents immediate unilateral execution.
6. The order executes only after the time-lock and quorum.
7. The claim changes from `ACTIVE` to `FROZEN`.
8. The order auto-expires unless renewed through the same controlled path.
9. Appeal or arbitration remains available where the legal model requires it.

The public layer records the order and outcome, not the private evidence package.

### 10. Epoch root and historical integrity

The mirror/indexer periodically accumulates events into an epoch root or Merkle root. That root is anchored publicly. This allows a verifier to check that an event belongs to the declared history and that later edits have not silently changed the sequence.

The movement is:

`event envelope → mirror accumulator → epoch root → consensus timestamp → Verify evidence`

### 11. Link Card, LinkScore and metrics

The Link Card is a compact, redacted summary of a claim or pool:

- asset class;
- jurisdiction;
- current status;
- LinkScore v0;
- dispute/attestation state;
- audit anchor;
- aggregate HCS/event metrics.

LinkScore should eventually be a governed ruleset rather than a static number. Potential inputs include clean registration history, attestation strength, release behaviour, dispute history, false-positive history and confirmation quality. It must not become a hidden credit decision or substitute for legal review.

Aggregate metrics can show checks performed, collisions blocked, protected value, average cost, dispute decisions, HCS messages and release rates. Individual lender portfolios remain private.

## Small-node movement table

| Node | Created at | Transformation | Stored or transmitted to | Public? | End states |
|---|---|---|---|---|---|
| `N0` raw receivable | Lender intake | Validated and normalised | Lender custody / private store | No | checked, abandoned, registered or rejected |
| `K1` / `K2` / `K3` canonical keys | Local canonicaliser | Blinded or committed | Gateway and registry index | No | clear, collision, ambiguous |
| `Q` query package | Privacy boundary | Authenticated, rate-limited query | Gateway → private evaluator | No | response returned, audit logged |
| `C1` senior claim | Atomic registration | Adds nullifier, rank, timestamp, status | Registry database | Only redacted fields | active, frozen, released, expired |
| `C2` later candidate | Collision path | Receives blocked response | Lender workflow | No commercial details | rejected, mediated, re-submitted |
| `EV` event envelope | State transition | Minimal public encoding | HCS topic and mirror | Yes, redacted | indexed, rooted, verified |
| `ROOT` epoch root | Mirror accumulation | Consensus-anchored checkpoint | HCS and public verifier | Yes | verified or disputed |
| `O` freeze order | Dispute proposal | Guardian approvals + time-lock | Registry + HCS | Order metadata only | pending, executed, expired, appealed |
| Link Card | Claim/pool summary | Score and anchor projection | Lender, insurer, public Verify | Redacted | active, frozen, released |
| Metric point | Event aggregation | Counts and anonymisation | Analytics / regulator view | Aggregate only | reported, compared, audited |

## State machine

```text
NEW
  └─ validate + canonicalise → CHECKING
       ├─ no match → CLEAR → ATOMIC REGISTER → ACTIVE
       ├─ match → BLOCKED → REJECTED / MEDIATED REVIEW
       └─ ambiguous → REVIEW → CLEAR or BLOCKED

ACTIVE
  ├─ paid/discharged → RELEASED
  ├─ challenge + quorum + time-lock → FROZEN
  └─ policy expiry → EXPIRED

FROZEN
  ├─ valid renewal → FROZEN
  ├─ appeal decision → ACTIVE or RELEASED
  └─ no renewal → EXPIRED or RELEASED according to policy
```

## MVP versus production archaeology

| Layer | Current MVP | Production requirement |
|---|---|---|
| Intake | React form and synthetic fields | API adapters for lender core systems and TTN/El Fatoora |
| Canonicalisation | Local `canonicalKeys()` | Governed canonical schemas, versioning and jurisdiction adapters |
| Privacy | Simulated local check | Cryptographic blind/OPRF protocol, threshold key management and rate limits |
| Registry | React local state | Durable transactional database with compare-and-set / serializable registration |
| Audit | Synthetic HCS labels | Live Hedera topic, Mirror Node indexer and epoch roots |
| Public proof | Redacted Verify page | Signed proof responses, public verification library and availability SLA |
| Due process | Local 2-of-3 UI and timer | Authenticated guardian identities, signed votes, policy engine and legally reviewed expiry |
| LinkScore | Demonstration score | Versioned, governed scoring rules with explainability and model-risk controls |
| Data protection | No sensitive data in public UI | Threat model, cryptographic review, incident response, retention and access controls |
| Money | No settlement in product | Bank integrations remain external; RIBAT records evidence of release |

## Reading the graph

Follow the thick path from the lender on the left through `N0 → K1/K2/K3 → Q → collision result → atomic registry`. Then follow two branches:

- **clear branch**: claim becomes senior, produces a public event, is indexed, verified and later released;
- **collision branch**: later candidate is blocked, then either mediated or sent into due process.

The dashed privacy nodes show where production cryptography and durable services must be inserted. The public proof branch is intentionally narrower than the private data branch: many private inputs collapse into a small, redacted set of public fields.
