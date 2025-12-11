/**
 * 電気・ガス・灯油料金データ
 *
 * 最終更新日: 2025年12月
 * データソース:
 * - 電気料金: 各電力会社公式サイト（従量電灯B/A 30A契約基準）
 *   - 北海道電力: https://www.hepco.co.jp/home/price/ratemenu/meterratelight.html
 *   - 東京電力EP: https://www.tepco.co.jp/ep/private/plan/standard/index-j.html
 *   - 関西電力: https://www.kepco.co.jp/home/ryoukin/menu/dento_a.html
 * - ガス料金: 各ガス会社公式サイト（一般料金表 A/B表）
 * - 灯油価格: 資源エネルギー庁 石油製品価格調査
 *
 * 注意事項:
 * - 電気料金は燃料費調整額・再エネ賦課金を含まない基本単価です
 * - 実際の請求額は燃料費調整額・再エネ賦課金により変動します
 * - 最新の料金は各社公式サイトでご確認ください
 */
export const NATIONAL_AVERAGE_COST_2025_11 = {
  electricity_per_kWh: 30.54,
  cityGas_per_m3: 197.28,
  cityGas_per_kWh: 15.66,
  kerosene_per_L: 127.03,
  kerosene_per_kWh: 12.53,
} as const;

export const CITY_GAS_UNIT_PRICE_LIVE_2025_11 = 197.28 as const;

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
    baseFee: 1287,
    rates: [
      { limit: 120, rate: 21.2 },
      { limit: 300, rate: 25.67 },
      { limit: Infinity, rate: 28.62 },
    ],
  },
  {
    id: "tohoku",
    name: "東北電力",
    baseFee: 1108.8,
    rates: [
      { limit: 120, rate: 29.62 },
      { limit: 300, rate: 36.37 },
      { limit: Infinity, rate: 40.32 },
    ],
  },
  {
    // 2025年11月分料金 https://www.hepco.co.jp/home/price/ratemenu/pdf/meterratelight_chart2511.pdf
    id: "hokkaido",
    name: "北海道電力",
    baseFee: 2090,
    rates: [
      { limit: 120, rate: 35.69 },
      { limit: 280, rate: 41.98 },
      { limit: Infinity, rate: 45.7 },
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

/**
 * エアコンモデルデータ
 *
 * 最終更新日: 2025年12月
 * データソース: ダイキン公式サイト（Eシリーズ 2025年モデル）
 * https://www.daikin.co.jp/air/products/residential/e-series
 *
 * 注意事項:
 * - 消費電力は期間消費電力量から算出した目安値です
 * - 実際の消費電力は使用環境により変動します
 */
export type AirConditionerModel = {
  id: string;
  coolingCapacity: number;
  power: number;
  applicableRoomSizes: number[];
};

export const roomSizes = [6, 8, 10, 12, 14, 16, 18, 20];

/**
 * ダイキン Eシリーズ 2025年モデル
 * 型番: S225ATES〜S635ATES（2025年モデル）
 */
export const acModels: AirConditionerModel[] = [
  {
    id: "S225ATES",
    coolingCapacity: 2.2,
    power: 0.47,
    applicableRoomSizes: [6, 8, 10],
  },
  {
    id: "S255ATES",
    coolingCapacity: 2.5,
    power: 0.56,
    applicableRoomSizes: [8, 10, 12],
  },
  {
    id: "S285ATES",
    coolingCapacity: 2.8,
    power: 0.66,
    applicableRoomSizes: [10, 12, 14],
  },
  {
    id: "S365ATES",
    coolingCapacity: 3.6,
    power: 0.97,
    applicableRoomSizes: [12, 14, 16],
  },
  {
    id: "S405ATES",
    coolingCapacity: 4.0,
    power: 1.27,
    applicableRoomSizes: [14, 16, 18],
  },
  {
    id: "S565ATES",
    coolingCapacity: 5.6,
    power: 1.77,
    applicableRoomSizes: [18, 20],
  },
  {
    id: "S635ATES",
    coolingCapacity: 6.3,
    power: 2.0,
    applicableRoomSizes: [20],
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
  { id: "hokkaido", name: "北海道", rate: 130.0346 },
  { id: "tohoku", name: "東北", rate: 124.5026 },
  { id: "kanto", name: "関東", rate: 127.6111 },
  { id: "chubu", name: "中部", rate: 126.1507 },
  { id: "kansai", name: "関西", rate: 124.8405 },
  { id: "chugoku", name: "中国", rate: 129.6205 },
  { id: "shikoku", name: "四国", rate: 128.1457 },
  { id: "kyushu", name: "九州", rate: 125.3343 },
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

import type { ElectricityCostBreakdownStage } from "@/types/cost";

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
