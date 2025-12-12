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
export const NATIONAL_AVERAGE_COST_2025_12 = {
  electricity_per_kWh: 30.54,
  cityGas_per_m3: 170.88,
  cityGas_per_kWh: 13.57,
  kerosene_per_L: 123.0,
  kerosene_per_kWh: 12.13,
} as const;

export const CITY_GAS_UNIT_PRICE_LIVE_2025_12 = 170.88 as const;

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
    // 2025年12月分料金 従量電灯A（3段階制）
    id: "kansai",
    name: "関西電力",
    baseFee: 522.58,
    rates: [
      { limit: 120, rate: 17.81 },
      { limit: 300, rate: 21.02 },
      { limit: Infinity, rate: 23.52 },
    ],
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
    // 2025年12月分料金 https://www.hepco.co.jp/home/price/ratemenu/pdf/meterratelight_chart2512.pdf
    id: "hokkaido",
    name: "北海道電力",
    baseFee: 1254,
    rates: [
      { limit: 120, rate: 35.69 },
      { limit: 280, rate: 41.98 },
      { limit: Infinity, rate: 45.7 },
    ],
  },
  {
    // 2025年12月分料金
    id: "chugoku",
    name: "中国電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 32.75 },
      { limit: 300, rate: 39.43 },
      { limit: Infinity, rate: 41.55 },
    ],
  },
  {
    // 2025年12月分料金
    id: "shikoku",
    name: "四国電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 27.26 },
      { limit: 300, rate: 32.79 },
      { limit: Infinity, rate: 35.71 },
    ],
  },
  {
    // 2025年12月分料金
    id: "hokuriku",
    name: "北陸電力",
    baseFee: 990,
    rates: [
      { limit: 120, rate: 30.82 },
      { limit: 300, rate: 34.71 },
      { limit: Infinity, rate: 36.42 },
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
 * 型番: AN225AES-W〜AN565AEP（2025年モデル）
 * データソース: https://www.ac.daikin.co.jp/roomaircon/products/e_series/spec 等
 */
export const acModels: AirConditionerModel[] = [
  {
    // AN225AES-W 主に6畳用 定格冷房消費電力580W
    id: "AN225AES-W",
    coolingCapacity: 2.2,
    power: 0.58,
    applicableRoomSizes: [6, 9],
  },
  {
    // AN255AES-W 主に8畳用 定格冷房消費電力720W
    id: "AN255AES-W",
    coolingCapacity: 2.5,
    power: 0.72,
    applicableRoomSizes: [7, 10],
  },
  {
    // AN285AES-W 主に10畳用 定格冷房消費電力780W
    id: "AN285AES-W",
    coolingCapacity: 2.8,
    power: 0.78,
    applicableRoomSizes: [8, 12],
  },
  {
    // AN365AES-W 主に12畳用 定格冷房消費電力1,180W
    id: "AN365AES-W",
    coolingCapacity: 3.6,
    power: 1.18,
    applicableRoomSizes: [10, 15],
  },
  {
    // AN405AEP-W 主に14畳用 定格冷房消費電力1,370W
    id: "AN405AEP-W",
    coolingCapacity: 4.0,
    power: 1.37,
    applicableRoomSizes: [11, 17],
  },
  {
    // AN565AEP-W 主に18畳用 定格冷房消費電力2,070W
    id: "AN565AEP-W",
    coolingCapacity: 5.6,
    power: 2.07,
    applicableRoomSizes: [15, 23],
  },
];

export type GasCompany = {
  id: string;
  name: string;
  baseFee: number;
  rate: number;
};

export const gasCompanies: GasCompany[] = [
  // 2025年12月分料金 20〜80m³/月の料金表B適用
  { id: "tokyo-gas", name: "東京ガス", baseFee: 1056, rate: 130.5 },
  // 2025年12月分料金 20〜50m³/月の料金表B適用
  { id: "osaka-gas", name: "大阪ガス", baseFee: 1056, rate: 144 },
  // 2025年12月分料金 20〜50m³/月の料金表B適用
  { id: "toho-gas", name: "東邦ガス", baseFee: 1056, rate: 169 },
  // 2025年12月分料金 15〜30m³/月の料金表（福岡地区）適用
  { id: "seibu-gas", name: "西部ガス", baseFee: 1056, rate: 232 },
  // 2025年12月分料金 15〜50m³/月の料金表B適用
  { id: "hokkaido-gas", name: "北海道ガス", baseFee: 1056, rate: 183 },
  // 2025年12月分料金 25〜60m³/月の料金表C適用
  { id: "shizuoka-gas", name: "静岡ガス", baseFee: 1056, rate: 208 },
  // 2025年12月分料金 15〜80m³/月の料金表B適用（参考値）
  { id: "tosai-gas", name: "東彩ガス", baseFee: 1056, rate: 149 },
  // 2025年12月分料金 20〜100m³/月の料金表B適用
  { id: "keiyo-gas", name: "京葉ガス", baseFee: 1056, rate: 152 },
];

export type KeroseneRegion = {
  id: string;
  name: string;
  rate: number;
};

// 2025年12月分料金 総務省「石油製品価格調査」地域別中央値
export const keroseneRegions: KeroseneRegion[] = [
  { id: "hokkaido", name: "北海道", rate: 126 },
  { id: "tohoku", name: "東北", rate: 120 },
  { id: "kanto", name: "関東", rate: 122 },
  { id: "chubu", name: "中部", rate: 122 },
  { id: "kansai", name: "関西", rate: 122 },
  { id: "chugoku", name: "中国", rate: 123 },
  { id: "shikoku", name: "四国", rate: 124 },
  { id: "kyushu", name: "九州", rate: 125 },
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
