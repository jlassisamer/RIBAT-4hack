# RIBAT — Hedera Integration: Role, Importance and Meaning

## Direct answer

Hedera is not the RIBAT database, not the private invoice store, not the OPRF engine and not the payment rail. In RIBAT, Hedera is the **neutral ordering and audit layer**.

The core service is the **Hedera Consensus Service (HCS)**. RIBAT publishes small, redacted event messages to an HCS topic. Hedera assigns a consensus timestamp and an ordered sequence to those messages. A Mirror Node then exposes the topic history so RIBAT, a lender, an auditor or a regulator can retrieve the same event history and verify the order.

This matters because RIBAT’s central business question is not only “does a collision exist?” It is also “which valid claim was recorded first, and can every participant later prove that ordering without trusting one lender’s private database?” Hedera provides the neutral timestamp and ordering evidence. RIBAT still owns the privacy protocol, claim rules, legal agreements, member governance and business workflow.

## Where Hedera sits in the system

```text
Private lender data
  invoice / traite / parties / amount / tax IDs
                    │
                    │ never published to Hedera
                    ▼
RIBAT private layer
  canonicalisation → blinded collision check → atomic claim registry
                    │
                    │ minimal event only
                    ▼
Hedera Consensus Service
  topic message → consensus timestamp → sequence number
                    │
                    ▼
Hedera Mirror Node
  ordered query / filtering / replay / indexing
                    │
                    ▼
RIBAT public proof layer
  Verify page · audit export · epoch root · Link Card · regulator evidence
```

## What RIBAT should use from Hedera

### 1. HCS topics

RIBAT should create separate topics by environment and governance scope, for example:

- `ribat-testnet-events-v1` for development and sandbox work;
- `ribat-mainnet-events-v1` for production registry events;
- optionally a separate topic for guardian orders and another for epoch roots, if operational separation is valuable.

A topic is the ordered stream in which RIBAT publishes lifecycle events. The topic ID becomes part of RIBAT’s configuration and public proof metadata.

### 2. HCS message submission

After a state transition is accepted by the RIBAT registry, the gateway creates a compact event envelope and submits it to the correct topic. Example event types are:

- `REGISTERED`: a clear claim was atomically recorded;
- `BLOCKED`: a later candidate collided with an existing commitment;
- `ORDER_PROPOSED`: a freeze order was proposed;
- `TIME_LOCKED`: the order entered its waiting period;
- `FROZEN`: the order executed after quorum and time-lock;
- `EXPIRED`: the order or claim window expired;
- `RELEASED`: the claim was discharged or released;
- `EPOCH_ROOT`: a period integrity root was published.

Hedera documentation states that HCS messages are consensus-timestamped and immutable once published. HCS message size is limited to 1 KiB per message, so RIBAT should publish compact metadata or hashes rather than documents. [1] [2]

### 3. Consensus timestamp

The consensus timestamp is the key Hedera value for RIBAT. It is the network’s agreed timestamp for the message after consensus, not a timestamp selected by one lender or one RIBAT operator.

RIBAT uses it to support:

- seniority evidence between two valid registration events;
- deterministic ordering of guardian proposals and executions;
- replayable event history;
- an auditable “what happened first?” answer;
- evidence that is independent of a single institution’s internal clock.

The timestamp does not by itself create legal priority. Legal enforceability still depends on Tunisian law, contracts, member agreements, evidence rules and the regulator-approved operating model.

### 4. Sequence number

Each message in a topic receives a sequence number. RIBAT can use the combination of:

```text
(topicId, consensusTimestamp, sequenceNumber, eventHash)
```

to identify an event in an audit trail. A sequence number is useful for pagination, replay and human-readable event references. It is not a replacement for the claim’s nullifier or document commitment.

### 5. Mirror Node

RIBAT should use a Mirror Node for reading, indexing and replaying HCS history. The Mirror Node is not the authority that creates consensus; it is the query and delivery layer for already-consensed network data.

The official API exposes topic details and messages, including retrieval by topic ID, sequence number and consensus timestamp. The official tutorial also demonstrates filtering messages by sequence number and timestamp. [3] [4]

A production RIBAT indexer would:

1. subscribe to or poll the relevant topic;
2. decode each event envelope;
3. validate its schema and event hash;
4. store a local searchable projection;
5. rebuild the current claim state by replaying events;
6. expose public Verify responses without exposing private data;
7. detect missing, malformed or out-of-order application events.

### 6. HBAR only for network fees

RIBAT needs HBAR operationally to pay Hedera transaction fees, unless a different approved fee arrangement is used. HBAR is not the product’s asset, collateral, settlement currency or customer reward.

The current design is deliberately crypto-invisible to lenders, SMEs and debtors: an operator or platform treasury pays the network fee and includes it in the service cost. Hedera describes predictable USD-denominated network fees converted to HBAR at transaction time. [2]

### 7. Topic access keys

A production topic must have an intentional access model:

- **public submit topic**: anyone can submit messages; simple, but unsuitable for a controlled registry event stream;
- **submit-key protected topic**: only authorised gateway accounts can submit messages; better for RIBAT governance;
- **encrypted message content**: useful if the topic is not intended to expose even the event payload, but it reduces direct public verification.

Hedera’s documentation states that anyone can submit to a public topic, while a private topic requires the submit key to sign the transaction. [1] RIBAT should therefore use a controlled gateway and a submit-key protected topic for production state events, while publishing only the minimum redacted proof required for verification.

## What goes on Hedera and what stays off-chain

| Data | Location | Reason |
|---|---|---|
| Invoice PDF/XML | Off-chain | Sensitive commercial document; unnecessary for ordering proof |
| Supplier name | Off-chain | Privacy and data-minimisation |
| Buyer/debtor name | Off-chain | Privacy and competitive confidentiality |
| Amount and currency | Off-chain | Commercial confidentiality |
| Tax identifiers | Off-chain | Personal/business identity protection |
| Lender portfolio | Off-chain | Competitive confidentiality |
| Canonical raw keys | Off-chain or protected registry | Low-entropy and inference risk |
| Blinded commitments | Private RIBAT registry | Needed for collision checks without raw data |
| Nullifier | Public event, subject to policy | Stable reference without revealing the document |
| Pseudonymous party ID | Public event, subject to policy | Links events without exposing the legal identity |
| Rank and status | Public event | Core verification output |
| Consensus timestamp | Hedera event | Neutral event ordering evidence |
| Topic ID / sequence number | Hedera and public proof | Event location and replay reference |
| Event hash / document commitment | Public or selectively disclosed | Integrity link to private evidence |
| Epoch/Merkle root | Hedera event | Efficient historical integrity checkpoint |
| Guardian order metadata | Public minimal fields | Accountability without exposing private evidence |

## The meaning of the integration

### It creates neutral ordering

Without Hedera, the first-registration story is mainly a claim by RIBAT’s own database. With HCS, the system can show that a specific event reached network consensus at a specific time and appears at a specific position in an ordered topic. This reduces dependence on the operator’s clock and database logs.

### It creates shared evidence between competitors

Two competing lenders do not need to trust each other’s databases. They can inspect the same public event history or ask an independent auditor to replay it. This is the main network effect: shared evidence without shared raw documents.

### It supports independent replay

A Mirror Node allows an indexer to reconstruct the event history. A regulator, auditor or future dispute body can compare RIBAT’s database with the network history. If the two differ, there is a concrete inconsistency to investigate.

### It reduces unilateral control

The operator still controls the RIBAT gateway and business policy, but it cannot silently rewrite an already published event in the Hedera topic. This is especially important for `REGISTERED`, `FROZEN`, `EXPIRED` and `RELEASED` events.

### It supports public verification without public documents

A public verifier can confirm that a redacted proof is anchored and ordered without receiving the invoice itself. This is the correct balance for RIBAT: evidence is public; commercial content is private.

### It gives insurers and regulators a reliable event input

An insurer or regulator can consume aggregate, anonymised history and verify that metrics were calculated from a consistent event stream. Hedera does not make the metrics automatically truthful, but it makes the source event history harder to rewrite silently.

## What Hedera does not solve

Hedera does not prove that an invoice is legally valid. It does not prove that a supplier delivered goods, that a debtor accepts the debt, that a lender has a valid assignment, or that a party has authority to pledge the receivable.

Hedera does not perform private matching for RIBAT. The privacy-preserving collision protocol, key derivation, rate limits, anti-guessing controls and encrypted storage must be designed and audited by RIBAT.

Hedera does not provide RIBAT’s atomic business rule by itself. RIBAT must perform the compare-and-set operation before publishing the `REGISTERED` event. A careless implementation could publish two conflicting events even if Hedera orders them correctly.

Hedera does not replace a database. RIBAT still needs a durable private registry, an indexer, a state machine, member authentication, backups, monitoring and incident response.

Hedera does not create regulatory approval. The integration must still be reviewed through the relevant Tunisian legal and regulatory path, including evidence, data protection, assignment, priority and dispute handling.

## Recommended production event envelope

The HCS payload should be compact, versioned and deterministic. A conceptual event could look like this:

```json
{
  "v": 1,
  "event": "REGISTERED",
  "claim": "0x7ac4...9e21",
  "party": "party_7F2A",
  "rank": 1,
  "status": "active",
  "docCommitment": "sha256:...",
  "registryEpoch": "2026-W43",
  "previousEvent": "sha256:..."
}
```

The consensus timestamp and sequence number are supplied by the Hedera event result and should not be trusted from the client payload. The payload should never contain the invoice amount, names, PDF/XML content, tax IDs or lender identity unless a separately approved encrypted design requires it.

## Recommended implementation sequence

1. Create a Hedera testnet topic with a controlled submit key.
2. Define and version the RIBAT event schema.
3. Implement a gateway adapter that submits only after a successful atomic private-registry transition.
4. Store the Hedera transaction ID, topic ID, sequence number and consensus timestamp in the RIBAT event record.
5. Build a Mirror Node consumer that replays events and compares them with the private registry projection.
6. Add epoch-root publication after a defined number or time window of events.
7. Expose a Verify endpoint that checks the event hash, topic reference, sequence, timestamp and current status.
8. Run collision, duplicate-submission, delayed-Mirror-Node and malformed-event tests on testnet.
9. Conduct a privacy review to prove that event payloads cannot reveal low-entropy fields.
10. Conduct legal and governance review before mainnet or production use.

## Current RIBAT prototype status

The current RIBAT MVP shows Hedera topic IDs, HCS events, roots and Mirror verification as **simulated** values. It does not submit live HCS messages, read a real Mirror Node, use a production submit key or calculate legal priority. That label is intentional: the user interface demonstrates the intended evidence flow without presenting a prototype as a live registry.

## References

[1]: https://docs.hedera.com/native/consensus/submit-message "Hedera documentation — Submit a message to a consensus topic"
[2]: https://hedera.com/service/consensus-service/ "Hedera Consensus Service — Trusted timestamps and verified order"
[3]: https://docs.hedera.com/native/tutorials/consensus/query-mirror-node "Hedera documentation — Query messages with a Mirror Node"
[4]: https://docs.hedera.com/reference/rest-api/topics "Hedera documentation — Topics Mirror Node REST API"
