export type ElectricityCostBreakdownStage = {
  limit: number;
  rate: number;
  usageKwh: number;
  cost: number;
};

export type ElectricityCostBreakdown = {
  baseFee: number;
  total: number;
  stages: ElectricityCostBreakdownStage[];
};


