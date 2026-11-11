# RIBAT — Competition Speech

## Title

**RIBAT: Trust Before Funding**

## Recommended duration

Approximately 6 minutes, including the product demonstration.

## Speech

Good morning, and thank you to the jury.

Every day, financial institutions make decisions based on receivables: invoices, bills of exchange and other promises of payment. These assets are essential because they turn future revenue into present working capital.

But there is a fundamental weakness in this process.

The same receivable can be presented to more than one lender. One institution sees its own customer relationship. Another institution sees a different relationship. Each may perform reasonable checks, yet neither can reliably know whether the same economic claim has already been promised somewhere else.

The result is a dangerous combination of fragmented information, expensive manual verification and weak priority evidence.

When this happens, the consequences are real. Lenders face avoidable losses. Credit decisions become slower and more conservative. SMEs pay more for financing or are rejected altogether. Debtors may receive conflicting payment instructions. And when a dispute begins, the question becomes extremely difficult to answer:

**Who registered the valid claim first?**

This is the problem RIBAT was created to solve.

RIBAT is a privacy-preserving receivable integrity registry. It allows a lender to check whether an invoice or bill of exchange has already been pledged or financed, without exposing the commercial document, the supplier, the buyer, the amount or the lender’s portfolio.

Our principle is simple:

> **Before funding, verify the link. Before trusting the claim, verify the order.**

Let me show how it works.

A lender begins with a receivable. The lender enters the reference, instrument type, supplier, buyer, issue date and amount into the RIBAT console. This information remains in the lender’s private environment.

RIBAT then derives several canonical representations instead of trusting one invoice number alone.

The first key, INV1, represents the commercial reference and the parties. The second, INV2, represents the official electronic-invoice or TTN reference when available. The third, INV3, compares the economic relationship through the parties, date and amount. This is important because a document can be renumbered or reformatted without changing the underlying economic claim.

These candidates are not published as raw commercial data. In the production design, they cross a privacy boundary through blinded or privacy-preserving evaluation. The registry should be able to answer “clear”, “collision” or “ambiguous” without receiving the original invoice or the lender’s portfolio.

If the result is clear, RIBAT performs an atomic registration. If no prior claim exists, the claim receives rank one. If a prior claim exists, the later request is blocked and receives the senior rank and consensus timestamp—without receiving the senior lender’s identity or commercial details.

This is the first demonstration point.

[**Demonstration cue: run the clear check, then register the claim. Show the registered status, rank one and the public Verify link.**]

Now we run the second scenario: a lender attempts to finance the same receivable again.

RIBAT identifies the collision and stops the process. It does not reveal another lender’s invoice, amount or portfolio. It simply communicates the operational fact that matters: this claim is already senior.

[**Demonstration cue: load the “Double financing” scenario. Run the check. Show `BLOCKED`, `rank 1` and the detected key.**]

This is not a cosmetic alert. It is an intervention at the point where a loss can still be prevented.

The third scenario demonstrates a renumbered reissue. The invoice reference changes, but INV3 detects a possible economic link. RIBAT does not automatically call this fraud. It creates an escalation path for mediated disclosure and review. That distinction matters because a good risk system must prevent losses without creating uncontrolled false positives.

Now let us address Hedera, because this is where the architecture becomes meaningfully different.

Hedera is not being used as the invoice database. It is not being used as the payment rail, the private matching engine or a cryptocurrency product.

RIBAT uses the Hedera Consensus Service as a neutral ordering and audit layer. After RIBAT accepts a state transition, it publishes a compact, redacted event to an HCS topic. The event may say that a claim was registered, blocked, frozen, expired or released. It contains a nullifier, a pseudonymous party identifier, a status, a rank and a commitment—not the invoice itself.

Hedera contributes three meaningful elements.

First, a consensus timestamp: evidence of when the event reached network consensus.

Second, an ordered topic sequence: a common answer to the question of what happened first.

Third, a replayable public history through a Mirror Node: a lender, auditor, regulator or insurer can retrieve the same event stream and verify the history independently.

This is precisely relevant to RIBAT. The central dispute is not only whether a claim exists. It is whether the claim was recorded before another claim, and whether that order can be demonstrated without trusting one institution’s private database.

Hedera strengthens that evidence. It does not create legal priority by itself. It does not prove that the invoice is valid. It does not prove that goods were delivered or that an assignment is enforceable. Those questions require contracts, governance, law and institutional adoption.

That honesty is important. In the current prototype, the Hedera events are clearly marked as simulated. We do not present a mock integration as a live network. The prototype demonstrates the intended architecture and user experience; the next production step is to connect the gateway to a controlled HCS topic and a Mirror Node indexer.

RIBAT also recognises that disputes cannot be solved by technology alone.

When a claim is challenged, a freeze order can be proposed. Independent guardians review the order. A quorum is required. A time-lock prevents immediate unilateral action. The order can execute, expire or move to appeal according to a defined process.

[**Demonstration cue: show the due-process panel. Approve the second guardian, show the quorum, execute the time-lock order and then show the expiration state.**]

This makes the system more than a collision detector. It becomes a controlled coordination layer for evidence, priority and disputes.

The impact is practical.

For lenders, RIBAT can reduce duplicate-financing risk and manual verification costs.

For SMEs, it can make more receivables financeable, especially smaller transactions that are currently too expensive to check manually.

For debtors, it can reduce conflicting payment and assignment instructions.

For insurers and guarantee funds, it can provide a more consistent event history for underwriting and claims analysis.

For regulators and auditors, it can provide redacted, replayable evidence without exposing private commercial portfolios.

The business model is B2B infrastructure. Potential revenue comes from per-check or registration fees, subscriptions, API access, audit exports and risk-data services. SMEs should initially be free or subsidised, because the network only becomes valuable when relevant lenders participate.

But we are not claiming that the market is already validated. The next milestone is evidence: a pilot with three to five lenders, anonymised data, measured collision rates, documented verification costs, a credible legal operating model and at least one institution willing to sponsor the pilot.

That is the discipline behind RIBAT.

We are not building technology because distributed ledgers are fashionable. We are using privacy-preserving computation because competitors cannot simply exchange raw portfolios. We are using Hedera because neutral ordering and replayable evidence matter. We are designing due process because a disputed financial claim cannot be governed by one operator alone.

RIBAT is differentiated by the combination of four properties:

- private verification instead of public document sharing;
- multi-key detection instead of dependence on one invoice number;
- neutral, auditable ordering instead of one institution’s database as the final authority;
- controlled dispute handling instead of unilateral freezing.

Our vision is not to put finance on-chain.

Our vision is to make the evidence behind finance more reliable.

A receivable should not be promised twice simply because institutions cannot see the same truth. A small business should not lose access to working capital because verification is too fragmented or expensive. And a dispute should not depend on whoever controls one private database.

RIBAT creates a shared trust layer while preserving commercial confidentiality.

One receivable. One verified priority. Trust before funding.

Thank you.

## Jury criteria alignment

### Problem relevance and clarity — 15%

The opening defines the concrete operational problem: duplicate financing, fragmented lender visibility and weak priority evidence. The speech connects the problem to lenders, SMEs, debtors and disputes rather than presenting it as a generic blockchain issue.

### Meaningful Hedera integration — 25%

The speech identifies HCS as the ordering and audit layer, explains consensus timestamps, topic sequence and Mirror Node replay, and clearly distinguishes Hedera’s contribution from RIBAT’s private registry and legal responsibilities. It also honestly states that the current prototype simulates the integration.

### Technical execution and functionality — 20%

The demonstration covers intake, canonical keys, collision detection, rank-one registration, public Verify, reissued-invoice detection and guardian due process. The speech explains the movement from private receivable to redacted public event.

### Innovation and differentiation — 15%

The differentiation is the combination of privacy-preserving verification, multi-key canonicalisation, neutral event ordering and governed dispute handling. The product is not positioned as a generic blockchain registry or token system.

### Real-world impact and adoption potential — 15%

The speech identifies benefits for lenders, SMEs, debtors, insurers, regulators and auditors. It also gives a credible adoption path: a measured three-to-five-lender pilot before production claims are made.

### Pitch and product demonstration — 10%

The story follows a clear sequence: problem, product, clear registration, blocked duplicate, reissue, Hedera meaning, dispute process, impact and next step. The demonstration cues are placed exactly where the relevant screen should be shown.

## Delivery guidance

Speak slowly during the opening problem and pause after the question: **“Who registered the valid claim first?”**

During the demonstration, do not narrate every UI field. Show the state change and explain why it matters commercially.

When discussing Hedera, emphasise the phrase **“neutral ordering and audit layer”**. Avoid saying that Hedera “guarantees legal priority” or that the prototype is “live on Hedera.”

The strongest closing line is:

> **One receivable. One verified priority. Trust before funding.**
