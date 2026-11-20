# OTP Lifestart — Prototype Implementation Plan (v2)

**Goal:** A high-polish, phone-framed interactive web prototype demonstrating the complete **0 → 25** customer lifecycle in a **3–5 minute live class & OTP Bank stakeholder demo**.  
**Audience & Scrutiny:** University service design class **with OTP Bank stakeholders attending** — requires crisp service-design storytelling *and* defensible Hungarian banking, tax (TBSZ), and retention math.  
**Build Approach:** AI-assisted build in this workspace (`React + TypeScript + Vite + Tailwind CSS v4 + Recharts + Lucide + Vitest`).  
**Core Thesis:** *"OTP Junior is free until 24/25, so young adults leave. OTP Lifestart builds a compounding asset, locks in skill & life habits early, rolls into a tax-free TBSZ at 18, and proves at 25 that staying with OTP GO beats a 'free' neobank by over +231,000 Ft/year."*

---

## 1. Overview & Strategic Framing

### Why v2 Upgrades the Original Plan
An audit of v1 surfaced math bugs, accounting ambiguities, live-demo hazards, and Hungarian regulatory mismatches that OTP stakeholders would challenge during Q&A. This v2 plan resolves all of them:

1. **Real Hungarian Banking & Tax Alignment:** Explicitly aligns with real **OTP Junior** (free until age 24, transitioning at 24–25 to adult/OTP GO packages), **OTP Alapkezelő** youth investing (0–18), and a **real 5-year OTP TBSZ** opened at age 18 (maturing **0% tax** right before 24–25, shielding returns from Hungary's **28% tax = 15% SZJA + 13% SZOCHO**).
2. **Defensible Age-25 Value Proof ("Stay vs. Leave"):** Replaces the raw single-column table (which previously had a `+258k` vs `+240k` sum error and counted total market yield as OTP-exclusive) with a **Self-Funding Fee Coverage** proof *plus* a **Side-by-Side "Stay with OTP GO vs. Switch to a Free Neobank"** comparison isolating Lifestart-exclusive incremental value (`+231,997 Ft/yr` baseline).
3. **Airtight Conservation of Money:** Enforces `totalBalance === long + mid + short + skillWallet` across every simulation tick and user action, implements Piggy Bank goals as **OTP Persely**-style earmarked sub-buckets inside `short` (zero phantom money), and verifies every invariant with **Vitest** unit tests.
4. **Live-Demo Resilience:** Replaces the forward-only slider with **bidirectional snapshot time-travel** (free forward/backward scrubbing during Q&A), boots cleanly at Age 0 on page load (with manual *"Restore last session"*), and auto-opens default state if the presenter jumps directly to a later stage.

---

## 2. Prototype Concept & Projector Stage Layout

- **Projector-First Viewport (`100vh` locked, zero page scroll):** Designed specifically for local `npm run dev` presentation on 1280×720 and 1920×1080 classroom projectors.
- **Stage Composition:**
  - **Center:** Interactive **Phone Frame** (`390×844` logical viewport, scaled cleanly to fit `100vh`) displaying the live mobile app.
  - **Right Side:** Minimal, uncluttered **Demo Control Panel** (visible to the audience as the presenter's time-travel remote; zero backstage/blueprint text clutter).
  - **Bottom Bar:** Compact **5-Stage Timeline** (`Seed 0–6` · `Learn 7–14` · `Grow 15–17` · `Launch 18–24` · `OTP GO 25+`) highlighting the active stage so the audience always knows where they are in the journey.
- **Persistence & Clean Boot:**
  - Every page load starts **fresh at Age 0** (preventing accidental Age-25 boot after rehearsal).
  - Active sessions are saved to `localStorage` under a separate recovery key, accessible via an explicit **"Restore last session"** button in the Demo Control Panel.
- **Disclaimer:** Subtle `"Concept prototype – simulated data"` pill in the stage corner; custom `"OTP Lifestart"` wordmark (not the official OTP corporate logo).

---

## 3. Scope & Cohesive 4-Tab Mobile Architecture

Instead of scattering 21 disconnected screens, every life stage fits into a realistic **4-tab bottom navigation bar**, supported by **Quick-Action Drawers** and **Full-Screen Milestone Takeovers** (`Onboarding`, `Age 18 Handover`, `Age 25 OTP GO`).

### Feature Prioritization (MoSCoW)

| Priority | Feature | Role in Demo |
|---|---|---|
| **MUST** | `100vh` Projector Stage + Phone Frame + Minimal Demo Control Panel | Carries the 3–5 minute live presentation |
| **MUST** | Bidirectional Snapshot Simulation Engine + Vitest Suite | Believable, bug-free numbers under OTP scrutiny |
| **MUST** | Onboarding at Age 0 (name, monthly amount, 60/25/15 split, `+25,000 Ft` grant) | "Lock in early" acquisition hook |
| **MUST** | Parent Home with **3 Pockets**, **Super Bond Card**, and **Growth Chart** | Core wealth-building product architecture |
| **MUST** | Monthly Contribution & Dynamic Pocket Allocation Sliders (`100%` sum lock) | Customizable family planning |
| **MUST** | **Skill Wallet** (restricted category/partner spending + `"❌ Not a skill purchase"` block) | Primary product differentiator |
| **MUST** | **Age 18 Full-Access Handover** + **5-Year OTP TBSZ Rollover / Reinvest Choice** | Emotional & structural retention peak |
| **MUST** | **Age 25 OTP GO** + **Self-Funding Fees** + **Side-by-Side "Stay vs. Leave"** | Proves the core thesis against neobanks |
| **SHOULD** | Easy Gifting (shareable gift QR card + 1-tap *"Grandma sent 15,000 Ft"* demo) | Multi-generational funding story |
| **SHOULD** | Kid **Piggy Bank (OTP Persely)** goals with confetti purchase completion | Early money habits from age 7 |
| **SHOULD** | **Achievements → Skill Wallet Cashback** (Language exam, Driving licence, First job) | Positive-behavior partner network |
| **SHOULD** | **Partner Benefits Directory** (Parent, Youth, and 25+ Mortgage/Career perks) | Ecosystem stickiness |
| **COULD** | **Odd-Job Earnings Tracker** (unlocked at 15+, folded into Piggy Bank tab) | Teen financial agency |
| **COULD** | **3-Question Gamified Finance Quiz** (`+0.25%` dividend bonus, inside Milestones tab) | Financial literacy incentive |
| **COULD** | **Parent Milestone Tips / Notifications Feed** (inside Benefits tab) | Stage-triggered engagement |
| **COULD** | **Personal OTP Advisor Chat** (4 curated Q&A prompts, 18+ tab) | High-touch young adult guidance |
| **SKIP** | Real login/auth, real payment rails, backend API, live market data feeds | Out of scope for concept demo |

### Cohesive 4-Tab Navigation Map

| View / Age | Tab 1 | Tab 2 | Tab 3 | Tab 4 | Full-Screen Takeovers & Drawers |
|---|---|---|---|---|---|
| **Parent (`0–17`)** | **Home** (Total, 3 Pockets, Super Bond, Chart, quick Contribute/Gift drawers) | **Pockets** (60/25/15 sliders, Pocket Transfers, Pocket Goals) | **Gifting** (QR Gift Link card, 1-tap Grandma Gift, Gift History) | **Benefits** (Partner Perks + Age-Triggered Parent Tips Feed) | **Onboarding** (Age 0), **Contribute Drawer**, **Approval Toast** |
| **Kid (`7–17`)** | **Home** (Persely preview, Skill Wallet balance, Read-Only Vault, 18+ Locks) | **Piggy Bank** (Persely goals + Confetti Buy + *Earnings Tracker at 15+*) | **Skill Wallet** (Whitelisted Partners, *Anna Approval at 7–14*, Direct Pay at 15+, *Blocked Item Demo*) | **Milestones** (*Achievements → Cashback at 15+* + *3-Question Finance Quiz*) | **Skill Purchase Modal**, **Blocked Purchase Alert**, **In-App Anna Approval Toast** |
| **Adult / GO (`18–25+`)** | **Home** (Full Pocket Control, **5-Yr TBSZ Tracker**, Reinvest/Spend Toggle, Optional Contribution) | **Skills** (Career/Uni Skill Wallet + Achievements + *TBSZ Rollover option at 25+*) | **Value / GO** (`18–24`: Loyalty Preview; `25+`: **Stay vs. Leave** + Gold Tier + 25+ Perks) | **Advisor** (Personal OTP Advisor Chat + Q&A Prompts) | **Age 18 Handover Takeover**, **Age 25 OTP GO Welcome Takeover** |

---

## 4. Tech Stack & TypeScript Folder Structure

| Part | Choice | Reason |
|---|---|---|
| Language | **TypeScript** (strict mode) | Prevents silent property/math bugs in simulation & state |
| Framework | **React 19 + Vite** | Fast HMR and clean component isolation |
| Styling | **Tailwind CSS v4** | Rapid, disciplined 4-stage visual theming & `100vh` stage lock |
| Charts | **Recharts** | Responsive historical + projected 0–25 growth curves & value bars |
| Icons | **lucide-react** | Crisp banking & youth-friendly iconography |
| Testing | **Vitest** | Unit tests proving financial invariants, tax math, and time-travel integrity |
| State | React Context + `useReducer` + Snapshot Timeline | Predictable deterministic updates + instant bidirectional scrubbing |

```text
otp-lifestart/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ vitest.config.ts
├─ src/
│  ├─ main.tsx
│  ├─ index.css                        # Tailwind v4 + 4-stage theme tokens + tabular-nums utilities
│  ├─ App.tsx                          # 100vh projector stage: PhoneFrame + DemoPanel + StageBar
│  ├─ types/
│  │  └─ lifestart.ts                  # Strong types for State, Snapshots, Actions, Stage, Merchants
│  ├─ engine/
│  │  ├─ config.ts                     # Single source of truth for rates, fees, persona, thresholds
│  │  ├─ rules.ts                      # Life stages (0-6, 7-14, 15-17, 18-24, 25+), feature locks
│  │  ├─ finance.ts                    # Totals, bond/TBSZ math, projections, Stay-vs-Leave calculator
│  │  ├─ simulate.ts                   # stepOneMonth(), bidirectional snapshot scrubbing, autoOpen()
│  │  └─ __tests__/
│  │     ├─ simulate.test.ts           # Conservation of money, gift cadence, snapshot scrubbing
│  │     └─ finance.test.ts            # Age 7/15/18/25 benchmarks, Stay-vs-Leave exact reconciliation
│  ├─ state/
│  │  ├─ initialState.ts               # Clean Age-0 state + seeded Piggy Bank defaults
│  │  ├─ actions.ts                    # Typed action creators
│  │  └─ store.tsx                     # Context + reducer + manual session recovery localStorage
│  ├─ data/
│  │  ├─ partners.ts                   # OTP ecosystem + realistic Hungarian generic partners
│  │  ├─ skillCatalog.ts               # Whitelisted skill merchants + blocked non-skill demo items
│  │  ├─ achievements.ts               # Language exam, driving licence, first job, quiz badge
│  │  ├─ quiz.ts                       # 3-question financial literacy quiz (+0.25% bonus)
│  │  ├─ advisorScripts.ts             # 4 curated Personal OTP Advisor Q&A threads (18+)
│  │  └─ parentTips.ts                 # Age-triggered milestone notifications & tips
│  ├─ components/
│  │  ├─ stage/
│  │  │  ├─ PhoneFrame.tsx             # 390x844 mobile viewport with stage-aware header & BottomNav
│  │  │  ├─ DemoPanel.tsx              # Minimal presenter remote (slider, jumps, view, quick actions)
│  │  │  └─ StageTimeline.tsx          # Bottom 5-stage progress bar
│  │  ├─ shared/
│  │  │  ├─ PocketCard.tsx
│  │  │  ├─ BondCard.tsx               # Switches seamlessly: Youth Fund (0-17) -> OTP TBSZ (18+)
│  │  │  ├─ GrowthChart.tsx            # Historical solid line + dashed projection to 18 & 25
│  │  │  ├─ BottomNav.tsx              # Stage-adaptive 4-tab bar
│  │  │  ├─ Toast.tsx                  # Milestone & Anna approval toasts
│  │  │  └─ ConfettiBurst.tsx          # Lightweight celebratory feedback for Grant, Piggy Buy, 18
│  └─ screens/
│     ├─ parent/                       # OnboardingFlow, ParentHome, ParentPockets, ParentGifting, ParentBenefits
│     ├─ kid/                          # KidHome, KidPiggyBank, KidSkillWallet, KidMilestones
│     └─ adult/                        # Handover18, OtpGo25Takeover, AdultHome, AdultSkills, AdultValueGo, AdultAdvisor
└─ IMPLEMENTATION_PLAN.md
```

---

## 5. Life Stages, Hungarian Product Realism & Unlock Rules (`engine/rules.ts`)

| Stage | Age (`monthIndex`) | Real OTP Alignment | Controller | Unlocked Capabilities |
|---|---|---|---|---|
| **1. Seed** | `0–6` (`0–83`) | **OTP Junior** (0 Ft) + **OTP Alapkezelő Youth Fund** (6.5% nominal: 3% inflation + 3.5% real) | Parent only | Onboarding + `25,000 Ft` welcome grant, monthly deposits, 3-pocket allocation, easy gifting, parent partner perks |
| **2. Learn** | `7–14` (`84–179`) | Junior card + **OTP Persely** + **Skill Wallet** funded by 15% of monthly yield | Parent + Restricted Kid | Kid app unlocks: read-only pockets, Persely goals, Skill Wallet spending (**in-app Anna approval toast** required) |
| **3. Grow** | `15–17` (`180–215`) | Teen autonomy + career prep | Parent + Teen | Direct Skill Wallet pay (no parent approval), **Achievements → Cashback**, **Odd-Job Earnings Tracker**, **Finance Quiz (`+0.25%`)** |
| **4. Launch** | `18–24` (`216–299`) | Parent deposits pause; **Auto-Rollover into 5-Year OTP TBSZ** (Collection Year at 18 → **0% tax** right before 24–25). Note: Junior stays free to 24. | Young Adult (Full) | **Handover Takeover**, full pocket/allocation control, **Reinvest (`+0.25%/yr` up to `+1.50%`) vs. Spend** toggle, optional own monthly deposit, **Personal OTP Advisor**, university/career Skill Wallet |
| **5. OTP GO** | `25+` (`300+`) | Junior expires at 24 → transitions to **OTP GO** (`~1,500 Ft/mo` all-in fees). **TBSZ matures tax-free** (28% SZJA+SZOCHO avoided) & rolls forward. | Young Adult (Gold) | **OTP GO Takeover**, **Self-Funding Fees**, **Side-by-Side Stay vs. Leave (`+231,997 Ft/yr`)**, **Gold Loyalty Tier**, OTP Lakáshitel `-0.30%` mortgage perk, optional Skill Wallet → TBSZ rollover |

### Key Rule Helpers (`engine/rules.ts`)
```ts
export type LifeStageId = 'seed' | 'learn' | 'grow' | 'launch' | 'go';
export type Controller = 'parent' | 'shared' | 'adult';

export function getStage(age: number): LifeStageId;
export function getController(age: number): Controller;
export function getAvailableViews(age: number): Array<'parent' | 'kid' | 'adult'>;
export function isFeatureUnlocked(featureId: FeatureId, age: number): boolean;
export function getTbszStatus(monthIndex: number, tbszOpenedAtMonth: number | null): {
  yearsHeld: number;
  earlyExitTaxRate: 0.28 | 0.18 | 0; // <3 yrs: 28%, 3-5 yrs: 18%, 5+ yrs: 0%
  label: string;
};
```
*Note on Junior Cutoff:* While the demo milestones use crisp round stops (`0 → 7 → 15 → 18 → 25`), copy at Stage 4/5 transparently notes *"OTP Junior runs to age 24; OTP Lifestart bridges the 24–25 transition into OTP GO seamlessly"* so OTP stakeholders recognize exact product knowledge.

---

## 6. Data Model, Accounting Invariants & Config

### Core Accounting Invariants (Enforced & Unit-Tested)
1. **Strict Conservation of Money:**
   $$\text{totalBalance}(state) = \text{pockets.long} + \text{pockets.mid} + \text{pockets.short} + \text{skillWallet.balance}$$
2. **Earmarked Piggy Bank (OTP Persely):**
   - `piggyGoals[].saved` is an **earmark inside `pockets.short`**, never extra money created out of thin air.
   - `shortAvailable = Math.max(0, pockets.short - sum(piggyGoals.saved))`
   - Completing & buying a goal deducts `goal.saved` from **both** `pockets.short` and removes/resets the goal.
3. **Invested Super Bond / TBSZ Principal:**
   - `bondValue(state) = pockets.long + pockets.mid`
   - `pockets.short` is liquid cash (`0%` bond dividend).
4. **Skill Wallet Rules:**
   - Funded from age 7 through age 24 (`85 <= monthIndex <= 300`) by **`15%` of monthly Super Bond yield** + achievement cashback + optional manual top-ups.
   - At age 25+ (`monthIndex > 300`), automatic yield diversion stops (`0%`) so 100% of post-fee yield compounds in TBSZ/short; the adult can spend remaining Skill Wallet funds on career courses or roll the balance into `long` (TBSZ).

### Data Model (`types/lifestart.ts`)
```ts
export interface LifestartCoreState {
  monthIndex: number; // 0 = birth, 84 = age 7, 180 = age 15, 216 = age 18, 300 = age 25
  family: {
    parentName: string;
    childName: string;
    parentIsOtpCustomer: boolean;
  };
  account: {
    opened: boolean;
    openedAtMonth: number | null;
    pockets: { long: number; mid: number; short: number };
    allocation: { long: number; mid: number; short: number }; // always sums to 100
    monthlyContribution: number;       // parent deposit (months 1..216)
    adultMonthlyContribution: number;  // optional Bence deposit (months 217+, default 0)
    tbszOpenedAtMonth: number | null;  // set to 216 at age 18 handover / arrival
    dividendMode: 'reinvest' | 'spend';
    reinvestMonthsAfter18: number;
    skillWallet: {
      balance: number;
      totalFundedFromYield: number;
      totalCashbackEarned: number;
      spent: Array<{ id: string; month: number; merchant: string; category: string; amount: number }>;
    };
    totals: {
      welcomeGrant: number;
      contributions: number;
      gifts: number;
      grossYieldEarned: number;
      feesPaid: number;
    };
  };
  piggyGoals: Array<{ id: string; name: string; target: number; saved: number; emoji: string; purchasedAtMonth?: number }>;
  gifts: Array<{ id: string; from: string; occasion: string; amount: number; month: number }>;
  achievements: Array<{ id: string; title: string; unlockedAtMonth: number | null; cashback: number }>;
  earnings: Array<{ id: string; source: string; amount: number; month: number }>;
  transactions: Array<{ id: string; month: number; type: string; pocket: string; amount: number; label: string }>;
  notifications: Array<{ id: string; month: number; text: string; type: 'milestone' | 'tip' | 'approval' }>;
  historySnapshots: Array<{ month: number; total: number; bond: number; contributed: number }>;
  quizCompleted: boolean;
  handoverAccepted: boolean;
  goWelcomeSeen: boolean;
}

export interface AppStoreState {
  core: LifestartCoreState;
  snapshots: Record<number, LifestartCoreState>; // exact immutable snapshots for 0..maxVisitedMonth
  maxVisitedMonth: number;
  ui: {
    activeView: 'parent' | 'kid' | 'adult';
    activeTab: string;
    activeToast: { id: string; text: string; tone: 'success' | 'info' | 'error' } | null;
  };
}
```

### Configuration (`engine/config.ts`)
```ts
export const CONFIG = {
  PERSONA: { parentName: 'Anna', childName: 'Bence' },
  WELCOME_GRANT: 25_000,               // Ft at opening -> pockets.long
  DEFAULT_MONTHLY: 10_000,             // Ft parent contribution (ages 0-17)
  DEFAULT_ADULT_MONTHLY: 15_000,       // Ft optional preset if Bence enables deposits at 18+
  DEFAULT_ALLOCATION: { long: 60, mid: 25, short: 15 },

  // Return & Bonus Model (HUF Multi-Asset Youth Fund -> OTP TBSZ)
  INFLATION_PROTECTION_RATE: 0.03,     // 3.00%/yr inflation shield
  BASE_REAL_RETURN_RATE: 0.035,        // 3.50%/yr real return (6.50%/yr base nominal)
  REINVEST_BONUS_PER_YEAR: 0.0025,     // +0.25%/yr after 18 when reinvesting
  MAX_REINVEST_BONUS: 0.015,           // caps at +1.50%/yr (8.00% before quiz)
  QUIZ_BONUS_RATE: 0.0025,             // +0.25%/yr one-time literacy bonus (8.25% ceiling)

  // Skill Wallet & Gifts
  SKILL_WALLET_YIELD_SHARE: 0.15,      // 15% of monthly Super Bond yield (months 85..300)
  GIFT_AMOUNT: 15_000,                 // Ft per gift event -> pockets.long
  // Fixed cadence: Birthday = m > 0 && m % 12 === 0; Christmas = m % 12 === 6 (ages 0-17)

  // Persely auto-save simulation (within short pocket only)
  AUTO_PERSELY_MONTHLY: 2_500,         // Ft/mo moved from shortAvailable -> active piggyGoal (ages 7-17)

  // Age 25 OTP GO & Hungarian Tax Reality
  MONTHLY_FEES_AFTER_25: 1_500,        // 18,000 Ft/yr (all-in account + card + transfers + custody)
  TBSZ_TAX_RATE: 0.28,                 // 15% SZJA + 13% SZOCHO saved in matured TBSZ
  TBSZ_MID_EXIT_TAX_RATE: 0.18,        // 10% SZJA + 8% SZOCHO (3-5 yr withdrawal)
  GOLD_PARTNER_CASHBACK_ANNUAL: 35_000,// Ft/yr Gold-tier partner cashback (25-yr tenure)
  MORTGAGE_DISCOUNT_BPS: 30,           // -0.30% APR on OTP Lakashitel (~90,000 Ft/yr on 30M Ft loan)
  DEFAULT_MORTGAGE_PRINCIPAL: 30_000_000,
} as const;
```

---

## 7. Simulation Engine, Bidirectional Snapshots & Finance Math

### Bidirectional Time-Travel (`engine/simulate.ts`)
- **Forward (`targetMonth > core.monthIndex`):**
  - If `!core.account.opened`, call `autoOpenDefaultAccount(core)` first so jumping straight to Age 7/15/18/25 from Age 0 never hits an uninitialized account.
  - For each month `m` from `core.monthIndex + 1` to `targetMonth`, execute `stepOneMonth(current)` and store an immutable snapshot at `snapshots[m]`.
- **Backward (`targetMonth < core.monthIndex`):**
  - Immediately restore `snapshots[targetMonth]` in $O(1)$ without resetting the demo!
- **Branch Truncation on Mid-History Edits:**
  - If the presenter scrubs back (say, to Age 15) and performs a *mutating action* (like buying a course or receiving an extra gift), drop cached `snapshots` strictly greater than `monthIndex` (`m > currentMonth`) and recompute cleanly forward from the edited state whenever time advances again.

### Exact Order Inside `stepOneMonth(prev)` (Advancing to Month `m = prev.monthIndex + 1`)
1. **Monthly Contribution:**
   - `amount = m <= 216 ? prev.account.monthlyContribution : prev.account.adultMonthlyContribution`
   - Split by `allocation` (`long / mid / short`) and record `totals.contributions += amount`.
2. **Scheduled Family Gifts (`1 <= m <= 216`):**
   - Birthday when `m % 12 === 0` (`15,000 Ft` → `long`).
   - Christmas when `m % 12 === 6` (`15,000 Ft` → `long`).
   - *(Note: fixes v1's impossible `month: 12` bug and `month: 0` birth collision.)*
3. **Super Bond / TBSZ Yield:**
   - `annualRate = CONFIG.INFLATION_PROTECTION_RATE + CONFIG.BASE_REAL_RETURN_RATE + reinvestBonus + (quizCompleted ? CONFIG.QUIZ_BONUS_RATE : 0)`
   - `bond = long + mid`
   - `monthlyYield = bond * (annualRate / 12)`
   - If `m > 300` (Age 25+, OTP GO): deduct `CONFIG.MONTHLY_FEES_AFTER_25` (`1,500 Ft`) from `monthlyYield` first (with fallback to `short` if needed) and increment `totals.feesPaid`.
4. **Skill Wallet & Dividend Distribution:**
   - If `85 <= m <= 300` (from age 7 up to turning 25): divert `15%` of distributable yield to `skillWallet.balance`.
   - Remaining yield goes to `long` if `dividendMode === 'reinvest'`, or `short` if `dividendMode === 'spend'`.
   - At `m > 216`: if `dividendMode === 'reinvest'`, increment `reinvestMonthsAfter18`.
5. **Persely (Piggy Bank) Allocation (`85 <= m <= 216`):**
   - Compute `shortAvailable = short - sum(piggyGoals.saved)`.
   - Earmark up to `min(AUTO_PERSELY_MONTHLY, shortAvailable, goal.target - goal.saved)` into the first incomplete Piggy Bank goal (strictly within `short`).
6. **Milestone Triggers (`m === 84, 180, 216, 300`):**
   - At `m === 216` (Age 18): set `tbszOpenedAtMonth = 216` (auto-rollover into 5-year OTP TBSZ).
   - Push milestone notification + trigger celebratory toast.
7. **Chart Snapshot:** Append `{ month: m, total: totalBalance, bond: long + mid, contributed }` to `historySnapshots`.

### Verified Baseline Mathematical Benchmarks (Zero Demo Withdrawals, Quiz Not Yet Completed)

| Age (`monthIndex`) | Total Balance | Super Bond (`long + mid`) | Long | Mid | Short | Skill Wallet | Cumulative Breakdown |
|---|---|---|---|---|---|---|---|
| **Age 7 (`84`)** | **1,334,234 Ft** | 1,208,234 Ft | 998,234 Ft | 210,000 Ft | 126,000 Ft | 0 Ft *(unlocks at 7)* | Grant 25k + Contrib 840k + Gifts 210k + Growth 259,234 |
| **Age 15 (`180`)** | **3,640,632 Ft** | 3,204,672 Ft | 2,754,672 Ft | 450,000 Ft | 270,000 Ft | **165,960 Ft** | Grant 25k + Contrib 1.80M + Gifts 450k + Growth 1,365,632 |
| **Age 18 (`216`)** | **4,809,203 Ft** | 4,211,458 Ft | 3,671,458 Ft | 540,000 Ft | 324,000 Ft | **273,745 Ft** | Grant 25k + Contrib 2.16M + Gifts 540k + Growth 2,084,203 |
| **Age 25 (`300`)** *(0 Ft/mo after 18, Reinvested)* | **7,473,155 Ft** | **6,475,817 Ft** | 5,935,817 Ft | 540,000 Ft | 324,000 Ft | **673,338 Ft** | Grant 25k + Contrib 2.16M + Gifts 540k + Growth 4,748,155 |

*Note: During the live demo, actions like Grandma's extra 15k Ft gift, buying a language course from the Skill Wallet, unlocking exam cashback, or finishing the quiz dynamically update these numbers in real time while preserving exact conservation of money.*

### Age 25 "Stay with OTP GO vs. Switch to a Free Neobank" Formula (`finance.ts`)
Calculated live from `bondValue = 6,475,817 Ft` at Age 25 (`8.00%` annual rate = `6.50%` base market + `1.50%` loyalty bonus):

- **Proof 1 — Self-Funding Account:**  
  Annual Super Bond yield (`518,065 Ft/yr`) covers the `18,000 Ft/yr` all-in OTP GO fees **28.8× over**, leaving **`+500,065 Ft/yr`** net cash/compounding surplus after fees.
- **Proof 2 — Side-by-Side Comparison (Baseline Numbers Reconciled to the Exact Forint):**

| Value Component (Annualized at Age 25) | Stay: OTP GO + Lifestart | Leave: Free Neobank / Broker | Lifestart Exclusive Advantage |
|---|---|---|---|
| **Base Market Return (`6.50%` gross = `420,928 Ft`)** | `+420,928 Ft` *(0% tax in matured TBSZ)* | `+303,068 Ft` *(after 28% SZJA + SZOCHO)* | **`+117,860 Ft/yr`** *(Unbroken TBSZ Tax Shield)* |
| **Loyalty Reinvest Bonus (`+1.50%`, tax-free)** | `+97,137 Ft` | `0 Ft` | **`+97,137 Ft/yr`** |
| **Gold-Tier Partner Cashback (25-yr tenure)** | `+35,000 Ft` | `0 Ft` | **`+35,000 Ft/yr`** |
| **All-In Fees (Account + Card + Transfers + Custody)** | `-18,000 Ft` | `0 Ft` | **`-18,000 Ft/yr`** |
| **TOTAL ANNUAL NET BENEFIT** | **`+535,065 Ft/yr`** | **`+303,068 Ft/yr`** | **`+231,997 Ft/yr` (Stay Wins!)** |

*Column check:* `420,928 + 97,137 + 35,000 - 18,000 = 535,065 Ft` | `535,065 - 303,068 = +231,997 Ft` | `117,860 + 97,137 + 35,000 - 18,000 = +231,997 Ft`.  
*Optional Interactive Toggle on Screen:* **"Include First-Home Mortgage Scenario (30M Ft OTP Lakáshitel, -0.30% APR)"** adds **`+90,000 Ft/yr`** (`+321,997 Ft/yr` total advantage) + included Personal OTP Advisor.

### Required Vitest Unit Tests (`engine/__tests__/`)
1. **Conservation of Money:** Stepping 0 → 300 months plus random deposits, pocket moves, Persely goal buys, Skill Wallet spends, and cashback must always satisfy `totalBalance === long + mid + short + skillWallet` within floating-point tolerance (`< 1 Ft` or exact integer rounding).
2. **Gift Cadence:** `0` gifts at `monthIndex === 0`; exact `2` gifts per year (`15,000 Ft` each = `30,000 Ft/yr`) across ages 0–17 (`36` gifts = `540,000 Ft` at `m = 216`); `0` automatic gifts after `m = 216`.
3. **Bidirectional Snapshot Integrity:** Advancing `0 → 25`, scrubbing back to `15`, and jumping forward to `25` yields bit-for-bit identical balances; mutating at `15` invalidates `> 15` snapshots cleanly.
4. **Skill Wallet Whitelist & Persely Bounds:** Non-skill merchants are rejected with zero balance change; `sum(piggyGoals.saved) <= pockets.short` at all times.
5. **Benchmark & Stay-vs-Leave Reconciliation:** Exact match against Age 7 (`1,334,234`), Age 15 (`3,640,632`), Age 18 (`4,809,203`), Age 25 (`7,473,155`), and `otpGoNet - neobankNet === exclusiveDeltaSum`.

---

## 8. Screens & Flows in Detail

### 8.1 Parent App (`0–17`)
- **Takeover — Onboarding (Age 0, `!account.opened`):**
  1. Greeting: *"Anna, you're an OTP customer. Congratulations on baby Bence! 🎉"*
  2. Monthly contribution selector (`5,000` / `10,000` / `20,000` Ft / custom) + 3-pocket allocation preset (`60 / 25 / 15` recommended).
  3. Confirm → **Welcome Grant `+25,000 Ft` Celebration** (confetti + `"Early-bird bonus"` badge into Long pocket).
- **Tab 1 — Parent Home:** Stage header (`Stage 1 · Seed`), total balance + annual yield callout, 3 `PocketCard` tiles (*Long: First Car/Home · Mid: Next 1–3 Yrs · Short: Everyday + Persely*), `BondCard` (*OTP Alapkezelő Youth Fund · 6.50% · Inflation-protected*), `GrowthChart` (solid history + dashed projection to 18 & 25), encouraging parent copy, quick-action triggers for **One-Off Deposit Drawer** and **Send Gift Link**.
- **Tab 2 — Pockets:** Interactive linked sliders (`long + mid + short === 100%`), instant `movePocketMoney(from, to, amount)`, and goal progress bars.
- **Tab 3 — Gifting:** Shareable QR Gift Card (*"Send Bence a birthday gift that grows"*), 1-tap demo trigger **"🎁 Grandma sent 15,000 Ft"**, and chronological family gift feed.
- **Tab 4 — Benefits & Tips:** Partner perks directory (`OTP SZÉP`, `BabyCare Shop`, `SwimClub Kids`, `OTP Simple`) + age-triggered milestone tips feed (*"Bence turned 7: unlock his Persely together"*).

### 8.2 Kid App (`7–17`)
- **Tab 1 — Kid Home:** Playful `"Hi Bence 👋"` header, active Persely goal ring, Skill Wallet spendable card, read-only Future Vault banner (*"Your parents saved 3,640,632 Ft for your future 🚀"*), and greyed-out `"Unlocks at 18 🔒"` teasers.
- **Tab 2 — Piggy Bank (OTP Persely) + Earnings:** Create/fund goals (`Bike 🚲`, `Console 🎮`, `Summer Camp ⛺`) earmarked inside `short`; hitting 100% unlocks **"Buy it!"** with confetti; **from age 15+**, an **Odd-Job Earnings Tracker** section lets Bence log tutoring/babysitting/chore income directly into `short`.
- **Tab 3 — Skill Wallet ⭐:** Balance card + `"Spend only on your skills & future"`.
  - **Whitelisted Skill Partners:** `Budapest Language School` (e.g., `45,000 Ft`), `City Driving Academy` (e.g., `65,000 Ft`), `CodeCamp HU` (`38,000 Ft`), `Sports Club Pass` (`22,000 Ft`).
  - **Blocked Non-Skill Demo Items:** `GameStore – 24,990 Ft`, `Sneaker Drop – 49,990 Ft`, `FastBite Delivery – 5,400 Ft` → tapping Pay triggers immediate red shake/alert: **`"❌ Not a skill purchase — Skill Wallet is protected for your future"`**.
  - **Age 7–14 vs. 15+ Approval:** At `7–14`, valid skill purchases show a **1.2s in-app simulated approval toast** (*"Request sent to Anna → Anna approved ✓"*); at `15+`, Bence pays directly.
- **Tab 4 — Milestones & Quiz:**
  - **Achievements → Cashback (unlocked at 15+):** Passing Language Exam (`+20,000 Ft` Skill Wallet cashback), Completing KRESZ/Driving Licence (`+25,000 Ft`), First Summer Job (`+15,000 Ft`).
  - **3-Question Finance Quiz (unlocked at 15+):** Short interactive quiz on compounding, inflation, and TBSZ → awards badge + **`+0.25%` permanent Super Bond dividend bonus**.

### 8.3 Young Adult & OTP GO (`18–25+`)
- **Takeover — Age 18 Handover (auto-triggers on first arrival at age 18):**
  - *"Bence, you're 18. Together your family built 4,809,203 Ft. It's yours now."*
  - Transparent stack breakdown: Parent contributions (`2.16M`) + Family gifts (`540k`) + Welcome grant (`25k`) + Super Bond growth (`2.08M`).
  - Emotional parent note card + **TBSZ Decision Card:** **Roll into 5-Year OTP TBSZ & Reinvest** (`+0.25%/yr` loyalty bonus up to `+1.50%`, **28% tax-free** at 5-yr maturity) vs. **Spend Dividends / Cash Out** (live preview showing exact forint forfeited by age 25 if cashed out or spent early).
- **Takeover — Age 25 OTP GO Welcome (auto-triggers at age 25):**
  - *"OTP Junior ends at 24–25. Lifestart becomes OTP GO — and it pays for itself 28× over."*
- **Tab 1 — Adult Home:** Full control of all 3 pockets, **5-Year OTP TBSZ Countdown & Tax-Bracket Pill** (`<3 yrs: 28%` · `3–5 yrs: 18%` · `5+ yrs: 0% Tax-Free ✓`), **Reinvest vs. Spend Dividend Toggle**, and **Optional Own Monthly Contribution** (parent deposits paused; 1-tap toggle to start e.g. `15,000 Ft/mo` first-job saving).
- **Tab 2 — Skills:** Career/university Skill Wallet (coding bootcamps, professional certs, master's prep) + 18+ Achievements; at `25+`, offers optional **"Roll Unused Skill Balance into TBSZ"**.
- **Tab 3 — Value & OTP GO ⭐:**
  - *Ages 18–24:* Live **"Road to Age 25 Gold"** preview showing accrued loyalty rate and TBSZ countdown.
  - *Ages 25+:* **Self-Funding Fee Banner** (`518,065 Ft/yr` yield vs `18,000 Ft/yr` fees) + **Side-by-Side "Stay with OTP GO vs. Free Neobank"** verdict card (**`+231,997 Ft/yr` net exclusive advantage**) + **Interactive First-Home Mortgage Toggle (`OTP Lakáshitel -0.30% APR`)** + **Gold Loyalty Tier Card** (`25 years with OTP`) + 25+ life-event partners.
- **Tab 4 — Personal OTP Advisor:** Clean chat interface with 4 instant Q&A scenarios (*"Should I keep my TBSZ or cash out for a car?"*, *"How does OTP GO stay cheaper than Revolut?"*, *"How do I use my Gold mortgage discount?"*, *"What happens to my Skill Wallet?"*).

---

## 9. Minimal Demo Control Panel (`components/stage/DemoPanel.tsx`)

Kept intentionally sleek and minimal for the classroom projector (zero backstage clutter):
1. **Bidirectional Age Slider (`0–25`):** Continuous/yearly scrubbing with marked snaps at `0 · 7 · 15 · 18 · 25` (plus `+1 mo` / `+1 yr` fine-steppers).
2. **Stage Quick-Jump Pills:** `0` · `7` · `15` · `18` · `25` (auto-opens account with defaults if jumping past 0).
3. **View Switcher:** `👩 Parent (Anna)` ↔ `🧒 Kid / 🎓 Young Adult (Bence)` (Kid disabled before age 7; auto-labels `🎓 Young Adult` at 18+ and `🥇 OTP GO` at 25+).
4. **3 Quick Demo Triggers:**
   - `🎁 Grandma Gift (+15k)`
   - `🏆 Language Exam (+20k)` (active 15+)
   - `🚗 Driving Licence (+25k)` (active 15+)
5. **Session Controls:** `↺ Reset to Age 0` (primary) and `💾 Restore Last Session` (only shown if a prior saved session exists in `localStorage`).

---

## 10. Updated 4-Minute Demo Script & Q&A Defense

1. **Age 0 — Parent View (`0:00–0:45`):** Anna opens OTP Lifestart for newborn Bence → selects `10,000 Ft/mo` & `60/25/15` split → **`+25,000 Ft` welcome grant** lands in Long. Tap **🎁 Grandma Gift** (`+15,000 Ft`). *(Hook: Lock in early at birth.)*
2. **Jump to Age 7 — Kid View (`0:45–1:25`):** Balance hits **`1.33M Ft`**. Switch to Bence's playful **Kid App** → pockets are read-only, Skill Wallet unlocks (`15%` of yield starting now) → add to **Persely goal ("Bike 🚲")** and hit `"Buy it!"` with confetti. *(Habits start at 7.)*
3. **Jump to Age 15 — Teen Skill Wallet (`1:25–2:15`):** Balance is **`3.64M Ft`**, Skill Wallet has **`~166k Ft`**. Buy a **`45,000 Ft` course** at *Budapest Language School* (instant direct pay), then tap *GameStore (`24,990 Ft`)* → **`❌ Not a skill purchase`**. Unlock **Language Exam Passed** → **`+20,000 Ft` cashback** into Skill Wallet. *(Differentiator: protected skill capital.)*
4. **Jump to Age 18 — Handover & TBSZ (`2:15–3:00`):** Handover takeover reveals **`~4.81M Ft`** (adjusted live for the course/cashback/gift). Choose **Roll into 5-Year OTP TBSZ & Reinvest** (`+0.25%/yr` loyalty bonus, 28% tax shield). Show that **Scrubbing Back** works seamlessly if asked. *(Emotional + tax-lock bridge.)*
5. **Jump to Age 25 — OTP GO & Stay vs. Leave (`3:00–4:00`):** Balance reaches **`~7.47M Ft`** (baseline). OTP GO takeover shows fees (`18,000 Ft/yr`) covered **28× over** by yield (`~518k Ft/yr`), and the **Side-by-Side Stay vs. Leave** card proves staying beats a free neobank by **`+231,997 Ft/yr`** (plus `-0.30%` OTP Lakáshitel mortgage savings). *(Core thesis proven.)*

### Anticipated OTP Stakeholder Q&A Defenses Built Into the Math
- *"Can't a 25-year-old just move their portfolio to Revolut or IBKR for 0 Ft account fees?"* → Even against a **0 Ft fee** competitor earning the exact same `6.50%` market return, breaking or leaving outside Lifestart's matured TBSZ + loyalty tier sacrifices **`117,860 Ft/yr`** in 28% Hungarian SZJA/SZOCHO tax shield, **`97,137 Ft/yr`** in earned loyalty yield, and **`35,000 Ft/yr`** in Gold cashback — netting **`+231,997 Ft/yr`** in favor of staying at OTP GO.
- *"Why does TBSZ start at 18 instead of birth?"* → Under Hungarian law, TBSZ accounts are 18+ with a 5-year holding clock. Lifestart compounds inside an **OTP Alapkezelő Youth Fund** until 18, then auto-rolls into a 5-year TBSZ so it reaches **0% tax maturity right before OTP Junior expires at 24–25**.
- *"What about OTP's unit economics?"* → OTP retains a `~6.5M Ft` sticky AUM customer entering peak earning & mortgage years (vs. losing a low-balance Junior account at 24), while partner cashback is co-funded by the career/retail partner network.

---

## 11. Phased Build & Verification Order

| Phase | Scope | Verification Gate |
|---|---|---|
| **1. Scaffold & Theme** | Vite + React + TS + Tailwind v4 + Vitest setup; `100vh` `App.tsx`, `PhoneFrame`, `DemoPanel`, `StageTimeline`, 4-stage CSS tokens | `npm run dev` renders empty phone + minimal controls cleanly inside `1280×720` with zero scroll |
| **2. Engine & Unit Tests** | `types/lifestart.ts`, `config.ts`, `rules.ts`, `finance.ts`, `simulate.ts` (bidirectional snapshots + Persely + Stay-vs-Leave) | **`npx vitest run`** passes all 5 invariant & exact-benchmark test suites |
| **3. State & Data Catalogs** | `store.tsx`, `initialState.ts`, `partners.ts`, `skillCatalog.ts`, `achievements.ts`, `quiz.ts`, `advisorScripts.ts`, `parentTips.ts` | Clean Age-0 boot + manual `"Restore last session"` verified |
| **4. Parent App (`0–17`)** | `OnboardingFlow` (+25k grant), `ParentHome` (3 pockets, BondCard, Recharts `GrowthChart`), `ParentPockets`, `ParentGifting`, `ParentBenefits` | Steps 1–2 of demo script run smoothly; sliders locked to `100%` |
| **5. Kid App (`7–17`)** | `KidHome`, `KidPiggyBank` (+ confetti buy + 15+ Earnings), `KidSkillWallet` (+ Anna toast + ❌ block), `KidMilestones` (+ Cashback + Quiz) | Steps 2–3 of demo script work end-to-end with conservation of money intact |
| **6. Adult / OTP GO (`18–25+`)** | `Handover18`, `OtpGo25Takeover`, `AdultHome` (TBSZ tracker, Reinvest/Spend, optional contribution), `AdultSkills`, `AdultValueGo` (Stay vs. Leave + Mortgage toggle + Gold tier), `AdultAdvisor` | Steps 4–5 + bidirectional Q&A scrubbing verified; TypeScript build (`npm run build`) & Vitest clean |
| **7. Rehearsal & Polish** | Tabular figures check, animations/confetti pacing, full 4-minute timed walkthrough from Age 0 → 25 and back | Zero console errors, zero overflow at `1280×720`, exact timed script verified |

---

## 12. Visual Design System ("UI Grows Up with the User")

- **Core OTP-Inspired Palette:** Deep Emerald `#00664F` (primary brand), Fresh Lime `#52AE30` (growth & OTP accent), Crisp Off-White `#F6F8F7` (canvas), Dark Forest `#0B2E26` (18+ headers), Warm Gold `#C89B3C` (Age 25+ Gold Tier), Alert Crimson `#DC2626` (blocked non-skill purchase).
- **Pocket Color Semantics:** Long-Term = Deep Emerald `#00664F` · Mid-Term = Teal `#0D9488` · Short-Term / Persely = Fresh Lime `#52AE30` · Skill Wallet = Amber-Gold `#D97706`.
- **4-Stage Visual Maturity:**
  1. **Parent (`0–17`):** Warm family banking — soft rounded cards, approachable typography, milestone banners.
  2. **Kid (`7–14`):** Playful & visual — extra-rounded tiles, prominent emojis, celebratory confetti, simplified labels.
  3. **Teen (`15–17`):** Sleek modern fintech — cleaner card density, achievement badges, direct tap-to-pay feel.
  4. **Young Adult / OTP GO (`18–25+`):** Refined private-banking-lite — crisp `1px` borders, subtle dark emerald/gold accents, high-trust financial data hierarchy.
- **Typography:** Clean geometric/humanist sans (`Inter` / `Plus Jakarta Sans`), with mandatory `font-variant-numeric: tabular-nums` on every `Ft` amount and percentage so numbers never jitter during time-travel.

---

## 13. Summary of Key Upgrades from v1

| Area | v1 Plan | v2 Upgraded Plan |
|---|---|---|
| **Tech & QA** | Plain JSX, manual testing only | **TypeScript + Vitest** unit tests verifying every accounting invariant |
| **Gift Bug** | `month: 12` never fired; `month: 0` collided with birth | Fixed cadence (`m > 0 && m % 12 === 0` Birthday, `m % 12 === 6` Christmas) |
| **Yield & Inflation** | `INFLATION_PROTECTION` unused; `4%` missed `4.35M` claim | Wired **`6.50%`** (`3.0%` inflation + `3.5%` real) → **`4.81M Ft` at 18**, **`7.47M Ft` at 25** |
| **Age 25 Proof** | Sum error (`+258k` vs `+240k`); vulnerable to neobank objection | **Self-Funding (28.8×)** + **Side-by-Side Stay vs. Leave (`+231,997 Ft/yr`)** |
| **TBSZ & Junior Realism** | Conceptual 15% TBSZ from birth; ignored 24-yr cutoff | **0–18 Youth Fund → 18–23 5-Yr TBSZ (28% SZJA+SZOCHO)**; notes 24-yr Junior cutoff |
| **Skill Wallet & Persely** | `10%` yield too small; Piggy Bank created phantom money | **`15%` yield (ages 7–24)** + **OTP Persely** earmarked inside `short` (`100%` reconciled) |
| **Demo Resilience** | Forward-only slider; `localStorage` risked booting at 25 | **Bidirectional snapshots**, clean Age-0 boot + manual restore, auto-open safety |
| **Screen Architecture** | 21 fragmented screens | **Cohesive 4-Tab Mobile Nav** per stage + Drawers + Full-Screen Takeovers |
