export type TieredRate = {
  limit: number;
  rate: number;
};

export type ElectricityCompany = {
  id: string;
  name: string;
  baseFee: number;
  rates: TieredRate[];
};

export const electricityCompanies: ElectricityCompany[] = [
  {
    id: "tokyo",
    name: "東京電力",
    baseFee: 935.25,
    rates: [
      { limit: 120, rate: 29.8 },
      { limit: 300, rate: 36.4 },
      { limit: Infinity, rate: 40.49 },
    ],
  },
  {
    id: "kyushu",
    name: "九州電力",
    baseFee: 948.72,
    rates: [
      { limit: 120, rate: 18.37 },
      { limit: 300, rate: 23.97 },
      { limit: Infinity, rate: 26.97 },
    ],
  },
  {
    id: "kansai",
    name: "関西電力",
    baseFee: 0,
    rates: [{ limit: Infinity, rate: 22.48 }],
  },
  {
    id: "chubu",
    name: "中部電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 21.04 },
      { limit: 300, rate: 25.78 },
      { limit: Infinity, rate: 28.29 },
    ],
  },
  {
    id: "tohoku",
    name: "東北電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 20.32 },
      { limit: 300, rate: 25.8 },
      { limit: Infinity, rate: 29.29 },
    ],
  },
  {
    id: "hokkaido",
    name: "北海道電力",
    baseFee: 1045,
    rates: [
      { limit: 120, rate: 22.32 },
      { limit: 280, rate: 28.3 },
      { limit: Infinity, rate: 32.3 },
    ],
  },
  {
    id: "chugoku",
    name: "中国電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 19.66 },
      { limit: 300, rate: 25.15 },
      { limit: Infinity, rate: 28.52 },
    ],
  },
  {
    id: "shikoku",
    name: "四国電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 20.32 },
      { limit: 300, rate: 25.8 },
      { limit: Infinity, rate: 29.29 },
    ],
  },
  {
    id: "hokuriku",
    name: "北陸電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 17.46 },
      { limit: 300, rate: 22.94 },
      { limit: Infinity, rate: 26.31 },
    ],
  },
];

export type RegionOption = {
  id: string;
  label: string;
  electricityCompanyId: ElectricityCompany["id"];
  gasCompanyId: string;
  keroseneRegionId: string;
};

export type AirConditionerModel = {
  id: string;
  coolingCapacity: number;
  power: number;
  applicableRoomSizes: number[];
};

export const roomSizes = [6, 8, 10, 12, 14, 16, 18, 20];

export const acModels: AirConditionerModel[] = [
  {
    id: "S22YTES",
    coolingCapacity: 2.2,
    power: 0.485,
    applicableRoomSizes: [6, 8, 10],
  },
  {
    id: "S25YTES",
    coolingCapacity: 2.5,
    power: 0.575,
    applicableRoomSizes: [8, 10, 12],
  },
  {
    id: "S28YTES",
    coolingCapacity: 2.8,
    power: 0.675,
    applicableRoomSizes: [10, 12, 14],
  },
  {
    id: "S36YTES",
    coolingCapacity: 3.6,
    power: 0.975,
    applicableRoomSizes: [12, 14, 16],
  },
  {
    id: "S40YTES",
    coolingCapacity: 4,
    power: 1.265,
    applicableRoomSizes: [14, 16, 18],
  },
  {
    id: "S56YTES",
    coolingCapacity: 5.6,
    power: 1.785,
    applicableRoomSizes: [18, 20],
  },
];

export type GasCompany = {
  id: string;
  name: string;
  baseFee: number;
  rate: number;
};

export const gasCompanies: GasCompany[] = [
  { id: "tokyo-gas", name: "東京ガス", baseFee: 759, rate: 145.31 },
  { id: "osaka-gas", name: "大阪ガス", baseFee: 759, rate: 145.31 },
  { id: "toho-gas", name: "東邦ガス", baseFee: 759, rate: 145.31 },
  { id: "seibu-gas", name: "西部ガス", baseFee: 759, rate: 145.31 },
  { id: "hokkaido-gas", name: "北海道ガス", baseFee: 759, rate: 145.31 },
  { id: "shizuoka-gas", name: "静岡ガス", baseFee: 759, rate: 145.31 },
  { id: "tosai-gas", name: "東彩ガス", baseFee: 759, rate: 145.31 },
  { id: "keiyo-gas", name: "京葉ガス", baseFee: 759, rate: 145.31 },
];

export type KeroseneRegion = {
  id: string;
  name: string;
  rate: number;
};

export const keroseneRegions: KeroseneRegion[] = [
  { id: "hokkaido", name: "北海道", rate: 119.7056 },
  { id: "tohoku", name: "東北", rate: 114.613 },
  { id: "kanto", name: "関東", rate: 117.4746 },
  { id: "chubu", name: "中部", rate: 116.1302 },
  { id: "kansai", name: "関西", rate: 114.9241 },
  { id: "chugoku", name: "中国", rate: 119.3244 },
  { id: "shikoku", name: "四国", rate: 117.9667 },
  { id: "kyushu", name: "九州", rate: 115.3786 },
];

export type Heater =
  | {
      id: string;
      name: string;
      type: "electric";
      power: number;
      efficiency: number;
    }
  | {
      id: string;
      name: string;
      type: "kerosene" | "gas";
      consumption: number;
      efficiency: number;
    };

export const heaters: Heater[] = [
  { id: "ac", name: "エアコン", type: "electric", power: 1, efficiency: 3.5 },
  {
    id: "electric-radiant",
    name: "電気ヒーター（セラミック/ハロゲン/カーボン）",
    type: "electric",
    power: 1,
    efficiency: 1,
  },
  {
    id: "oil-panel",
    name: "電気ヒーター（オイル/パネル）",
    type: "electric",
    power: 1.2,
    efficiency: 1,
  },
  {
    id: "kerosene",
    name: "灯油ヒーター",
    type: "kerosene",
    consumption: 0.2,
    efficiency: 0.9,
  },
  {
    id: "gas",
    name: "ガスヒーター",
    type: "gas",
    consumption: 0.15,
    efficiency: 0.85,
  },
];

export const regions: RegionOption[] = [
  {
    id: "hokkaido",
    label: "北海道",
    electricityCompanyId: "hokkaido",
    gasCompanyId: "hokkaido-gas",
    keroseneRegionId: "hokkaido",
  },
  {
    id: "tohoku",
    label: "東北",
    electricityCompanyId: "tohoku",
    gasCompanyId: "toho-gas",
    keroseneRegionId: "tohoku",
  },
  {
    id: "kanto",
    label: "関東",
    electricityCompanyId: "tokyo",
    gasCompanyId: "tokyo-gas",
    keroseneRegionId: "kanto",
  },
  {
    id: "chubu",
    label: "中部",
    electricityCompanyId: "chubu",
    gasCompanyId: "toho-gas",
    keroseneRegionId: "chubu",
  },
  {
    id: "kansai",
    label: "関西",
    electricityCompanyId: "kansai",
    gasCompanyId: "osaka-gas",
    keroseneRegionId: "kansai",
  },
  {
    id: "chugoku",
    label: "中国",
    electricityCompanyId: "chugoku",
    gasCompanyId: "seibu-gas",
    keroseneRegionId: "chugoku",
  },
  {
    id: "shikoku",
    label: "四国",
    electricityCompanyId: "shikoku",
    gasCompanyId: "seibu-gas",
    keroseneRegionId: "shikoku",
  },
  {
    id: "kyushu",
    label: "九州",
    electricityCompanyId: "kyushu",
    gasCompanyId: "seibu-gas",
    keroseneRegionId: "kyushu",
  },
];

export const findElectricityCompany = (id: string) =>
  electricityCompanies.find((company) => company.id === id) ??
  electricityCompanies[0];

export const findGasCompany = (id: string) =>
  gasCompanies.find((company) => company.id === id) ?? gasCompanies[0];

export const findKeroseneRegion = (id: string) =>
  keroseneRegions.find((region) => region.id === id) ?? keroseneRegions[0];

export function calculateElectricityCost(
  company: ElectricityCompany,
  usageKwh: number,
) {
  let remaining = usageKwh;
  let total = company.baseFee;
  let previousLimit = 0;

  for (const band of company.rates) {
    if (remaining <= 0) break;

    const stageLimit = Number.isFinite(band.limit) ? band.limit : Infinity;
    const stageCap = Number.isFinite(stageLimit)
      ? stageLimit - previousLimit
      : remaining;
    const usage = Math.min(remaining, stageCap);

    total += usage * band.rate;
    remaining -= usage;
    previousLimit = stageLimit;
  }

  return Math.round(total);
}

import type { ElectricityCostBreakdownStage } from "./types/cost.ts";

export function calculateElectricityCostBreakdown(
  company: ElectricityCompany,
  usageKwh: number,
) {
  let remaining = usageKwh;
  let total = company.baseFee;
  let previousLimit = 0;
  const stages: ElectricityCostBreakdownStage[] = [];

  for (const band of company.rates) {
    if (remaining <= 0) break;

    const stageLimit = Number.isFinite(band.limit) ? band.limit : Infinity;
    const stageCap = Number.isFinite(stageLimit)
      ? stageLimit - previousLimit
      : remaining;
    const usage = Math.max(0, Math.min(remaining, stageCap));
    const cost = usage * band.rate;

    stages.push({
      limit: band.limit,
      rate: band.rate,
      usageKwh: usage,
      cost: Math.round(cost),
    });

    total += cost;
    remaining -= usage;
    previousLimit = stageLimit;
  }

  return {
    baseFee: Math.round(company.baseFee),
    total: Math.round(total),
    stages,
  } as const;
}

export function calculateAcMonthlyCost(
  model: AirConditionerModel,
  hoursPerDay: number,
  company: ElectricityCompany,
  daysPerMonth = 30,
) {
  const monthlyKwh = model.power * hoursPerDay * daysPerMonth;
  return calculateElectricityCost(company, monthlyKwh);
}

export function calculateHeaterMonthlyCost(
  heater: Heater,
  hoursPerDay: number,
  company: ElectricityCompany,
  keroseneRegion: KeroseneRegion,
  gasCompany: GasCompany,
  daysPerMonth = 30,
) {
  const monthlyHours = hoursPerDay * daysPerMonth;

  if (heater.type === "electric") {
    const powerConsumption = heater.power / heater.efficiency;
    const monthlyKwh = powerConsumption * monthlyHours;
    return calculateElectricityCost(company, monthlyKwh);
  }

  if (heater.type === "kerosene") {
    const hourlyLiters = heater.consumption / heater.efficiency;
    return Math.round(hourlyLiters * keroseneRegion.rate * monthlyHours);
  }

  const hourlyGasUsage = heater.consumption / heater.efficiency;
  return Math.round(hourlyGasUsage * gasCompany.rate * monthlyHours);
}

export const recommendedModelsForRoom = (size: number) =>
  acModels.filter((model) => model.applicableRoomSizes.includes(size));
