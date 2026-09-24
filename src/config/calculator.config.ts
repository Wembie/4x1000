export const CALCULATOR_CONFIG = {
  initialAmount: 1_000_000,
  presets: [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000],
  examples: [50_000, 100_000, 500_000, 1_000_000, 5_000_000, 10_000_000],
  slider: {
    min: 10_000,
    max: 50_000_000,
    steps: 200,
    significantDigits: 3,
  },
  monthly: {
    initialOperations: [500_000, 1_200_000, 800_000, 2_000_000],
    maxOperations: 12,
  },
} as const
