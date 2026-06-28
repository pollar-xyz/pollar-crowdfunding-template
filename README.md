# Pollar Crowdfunding Template

A milestone-based crowdfunding template built on [Pollar](https://pollar.xyz)'s [Trustless Work](https://www.trustlesswork.com/) escrow adapter on Stellar testnet.

Creators launch campaigns with goals and milestones. Backers contribute USDC via their Pollar wallet into a non-custodial escrow. Funds are released to the creator as each milestone is approved. A dispute path is available if something goes wrong.

## Stack

- Next.js 16 (App Router), React 19, TypeScript 5, Tailwind 4
- `@pollar/core@^0.9.0`, `@pollar/react@^0.9.0`
- Trustless Work adapter via `useEscrow` — no custom escrow contracts

## Quick Start

```bash
cp .env.example .env.local
# Set your Pollar publishable key (self-serve at https://dashboard.pollar.xyz)
npm install
npm run dev
```

## Architecture

### Isolated Adapter Layer

All escrow operations are isolated in `src/services/campaignService.ts`. The UI components only call campaign-level business functions — never raw escrow terms. This makes it easy to swap or extend the adapter later.

```
src/
├── services/campaignService.ts   ← isolated adapter layer (useEscrow wrapper)
├── hooks/useCampaign.ts          ← React state management
├── components/                   ← UI components
├── app/                          ← Next.js App Router pages
└── types/index.ts                ← shared TypeScript types
```

### Campaign Flow

1. **Create** — Creator deploys an escrow with title, description, goal, and milestones
2. **Back** — Backers fund the campaign in USDC via their Pollar wallet
3. **Approve** — Campaign approver reviews milestones
4. **Release** — Approved milestone funds are released to the creator
5. **Dispute** — Backers can dispute a milestone (pauses release)

### Campaign States

| Status | Description |
|--------|-------------|
| `draft` | Created but not yet funded |
| `live` | Accepting contributions |
| `funded` | Goal reached, awaiting milestone approvals |
| `releasing` | Milestones being released |
| `disputed` | A dispute has been raised |
| `complete` | All milestones released |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_POLLAR_API_KEY` | Yes | Your Pollar publishable key (`pub_testnet_...`) |

## Spike Findings

### Multi-funder behavior

The Trustless Work escrow supports multiple funders into one pool. A campaign maps to a single escrow — backers all fund the same escrow, and progress is tracked by total `amount` vs goal.

### Trustless Work key

The Pollar adapter (`useEscrow`) runs entirely client-side with just the publishable key. No Trustless Work secret key is required for the escrow flow.

## Role Mapping

| Role | Description |
|------|-------------|
| Creator (serviceProvider) | Receives funds on milestone release |
| Approver | Reviews and approves/disputes milestones |
| Platform | Receives platform fees |

## License

MIT
