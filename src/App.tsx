import { useEffect, useMemo, useState } from "react";
import {
  acModels,
  calculateAcMonthlyCost,
  calculateHeaterMonthlyCost,
  calculateElectricityCostBreakdown,
  findElectricityCompany,
  findGasCompany,
  findKeroseneRegion,
  heaters,
  recommendedModelsForRoom,
  regions,
  roomSizes,
} from "@/data";
import { formatNumber, formatYen } from "@/utils/format";
import type { ElectricityCostBreakdown } from "@/types/cost";

// Import PNG assets
import GarbageCan from "@/assets/GarbageCan.png";
import MyComputer from "@/assets/MyComputer.png";
import Start from "@/assets/Start.png";
import TitleBar from "@/assets/TitleBar.png";
import FileExplorer from "@/assets/FileExplorer.png";
import CostCalculator from "@/assets/CostCalculator.png";

const DAYS_PER_MONTH = 30;

type StepId = "region" | "cooling" | "heating" | "summary";

type StepConfig = {
  id: StepId;
  title: string;
  description: string;
  body: React.JSX.Element;
  canProceed: boolean;
  primaryLabel: string;
};

type HeaterOption = (typeof heaters)[number];

const defaultRegionId = regions[0]?.id ?? "";
const defaultRoomSize = roomSizes.includes(10) ? 10 : roomSizes[0];
const defaultModelId =
  recommendedModelsForRoom(defaultRoomSize)[0]?.id ?? acModels[0]?.id ?? "";
const defaultHeaters = (() => {
  const preferred = ["ac", "kerosene"].filter((id) =>
    heaters.some((heater) => heater.id === id),
  );
  return preferred.length
    ? preferred
    : heaters.slice(0, 1).map((heater) => heater.id);
})();

const clampHours = (value: number) =>
  Math.min(24, Math.max(0, Math.round(value * 2) / 2));

const describeHeater = (heater: HeaterOption) => {
  if (heater.type === "electric") {
    return `電気式 / 消費電力 ${formatNumber(heater.power)} kW / COP ${formatNumber(
      heater.efficiency,
    )}`;
  }

  if (heater.type === "kerosene") {
    return `灯油式 / 消費量 ${formatNumber(
      heater.consumption,
    )} L/h / 効率 ${Math.round(heater.efficiency * 100)}%`;
  }

  return `ガス式 / 消費量 ${formatNumber(
    heater.consumption,
  )} m³/h / 効率 ${Math.round(heater.efficiency * 100)}%`;
};

const formatHours = (hours: number) =>
  Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);

const formatClock = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Tokyo",
  }).format(date);
function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState(defaultRegionId);
  const [selectedRoomSize, setSelectedRoomSize] = useState(defaultRoomSize);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const [coolingHoursPerDay, setCoolingHoursPerDay] = useState(8);
  const [heatingHoursPerDay, setHeatingHoursPerDay] = useState(16);
  const [selectedHeaterIds, setSelectedHeaterIds] =
    useState<string[]>(defaultHeaters);
  const [taskbarTime, setTaskbarTime] = useState(() => formatClock(new Date()));

  const selectedRegion =
    useMemo(
      () =>
        regions.find((region) => region.id === selectedRegionId) ?? regions[0],
      [selectedRegionId],
    ) ?? regions[0];

  const electricityCompany = useMemo(
    () => findElectricityCompany(selectedRegion.electricityCompanyId),
    [selectedRegion],
  );

  const gasCompany = useMemo(
    () => findGasCompany(selectedRegion.gasCompanyId),
    [selectedRegion],
  );

  const keroseneRegion = useMemo(
    () => findKeroseneRegion(selectedRegion.keroseneRegionId),
    [selectedRegion],
  );

  const recommendedModels = useMemo(
    () => recommendedModelsForRoom(selectedRoomSize),
    [selectedRoomSize],
  );

  useEffect(() => {
    if (!recommendedModels.length) {
      return;
    }

    if (!recommendedModels.some((model) => model.id === selectedModelId)) {
      setSelectedModelId(recommendedModels[0].id);
    }
  }, [recommendedModels, selectedModelId]);

  const selectedModel =
    useMemo(
      () =>
        acModels.find((model) => model.id === selectedModelId) ?? acModels[0],
      [selectedModelId],
    ) ?? acModels[0];

  const monthlyCoolingKwh = useMemo(
    () => selectedModel.power * coolingHoursPerDay * DAYS_PER_MONTH,
    [selectedModel, coolingHoursPerDay],
  );

  const coolingCost = useMemo(
    () =>
      calculateAcMonthlyCost(
        selectedModel,
        coolingHoursPerDay,
        electricityCompany,
        DAYS_PER_MONTH,
      ),
    [selectedModel, coolingHoursPerDay, electricityCompany],
  );

  const coolingBreakdown: ElectricityCostBreakdown = useMemo(
    () =>
      calculateElectricityCostBreakdown(
        electricityCompany,
        monthlyCoolingKwh,
      ),
    [electricityCompany, monthlyCoolingKwh],
  );

  const heatingResults = useMemo(() => {
    const entries = selectedHeaterIds
      .map((id) => {
        const heater = heaters.find((item) => item.id === id);
        if (!heater) {
          return null;
        }

        return {
          heater,
          cost: calculateHeaterMonthlyCost(
            heater,
            heatingHoursPerDay,
            electricityCompany,
            keroseneRegion,
            gasCompany,
            DAYS_PER_MONTH,
          ),
        };
      })
      .filter(
        (entry): entry is { heater: HeaterOption; cost: number } =>
          entry !== null,
      );

    return entries.sort((a, b) => a.cost - b.cost);
  }, [
    selectedHeaterIds,
    heatingHoursPerDay,
    electricityCompany,
    keroseneRegion,
    gasCompany,
  ]);

  const leadingHeating = heatingResults[0];

  useEffect(() => {
    const updateClock = () => {
      setTaskbarTime(formatClock(new Date()));
    };

    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(intervalId);
  }, []);
  const handleToggleHeater = (id: string) => {
    setSelectedHeaterIds((current) => {
      if (current.includes(id)) {
        if (current.length === 1) {
          return current;
        }
        return current.filter((value) => value !== id);
      }

      return [...current, id];
    });
  };

  const handleCoolingHoursChange = (value: number) => {
    if (!Number.isNaN(value)) {
      setCoolingHoursPerDay(clampHours(value));
    }
  };

  const handleHeatingHoursChange = (value: number) => {
    if (!Number.isNaN(value)) {
      setHeatingHoursPerDay(clampHours(value));
    }
  };

  const handleCancel = () => {
    setSelectedRegionId(defaultRegionId);
    setSelectedRoomSize(defaultRoomSize);
    setSelectedModelId(defaultModelId);
    setCoolingHoursPerDay(8);
    setHeatingHoursPerDay(16);
    setSelectedHeaterIds(defaultHeaters);
    setCurrentStep(0);
  };
  const renderRegionStep = () => (
    <div className="space-y-4 text-sm">
      <div>
        <label className="mb-1 block font-semibold text-gray-800">
          地域を選択
        </label>
        <select
          value={selectedRegionId}
          onChange={(event) => setSelectedRegionId(event.target.value)}
          className="w-full border border-black bg-white px-2 py-1 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] focus:outline-none"
        >
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded border border-white bg-[#dfdfdf] p-3 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
            電力会社
          </p>
          <p className="mt-1 font-semibold text-gray-900">
            {electricityCompany.name}
          </p>
          <p className="mt-2 text-xs text-gray-700">
            基本料金 {formatYen(electricityCompany.baseFee)} / 月
          </p>
        </div>
        <div className="rounded border border-white bg-[#dfdfdf] p-3 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
            ガス会社
          </p>
          <p className="mt-1 font-semibold text-gray-900">{gasCompany.name}</p>
          <p className="mt-2 text-xs text-gray-700">
            単価 {formatNumber(gasCompany.rate)} 円 / m³
          </p>
        </div>
        <div className="rounded border border-white bg-[#dfdfdf] p-3 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
            灯油
          </p>
          <p className="mt-1 font-semibold text-gray-900">
            {keroseneRegion.name}
          </p>
          <p className="mt-2 text-xs text-gray-700">
            単価 {formatNumber(keroseneRegion.rate)} 円 / L
          </p>
        </div>
      </div>
    </div>
  );

  const renderCoolingStep = () => (
    <div className="space-y-4 text-sm">
      <div>
        <label className="mb-1 block font-semibold text-gray-800">
          部屋の広さ
        </label>
        <select
          value={selectedRoomSize}
          onChange={(event) => setSelectedRoomSize(Number(event.target.value))}
          className="w-full border border-black bg-white px-2 py-1 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] focus:outline-none"
        >
          {roomSizes.map((size) => (
            <option key={size} value={size}>
              {size} 畳
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-semibold text-gray-800">
          エアコン機種
        </label>
        <select
          value={selectedModelId}
          onChange={(event) => setSelectedModelId(event.target.value)}
          className="w-full border border-black bg-white px-2 py-1 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] focus:outline-none"
        >
          {acModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.id} (冷房能力 {formatNumber(model.coolingCapacity)} kW /
              消費電力 {formatNumber(model.power)} kW)
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-700">
          推奨機種: {recommendedModels.length} 件
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="block font-semibold text-gray-800">
            1日あたりの冷房時間
          </span>
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={coolingHoursPerDay}
            onChange={(event) =>
              handleCoolingHoursChange(Number(event.target.value))
            }
            className="w-full border border-black bg-white px-2 py-1 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] focus:outline-none"
          />
        </label>
        <div className="rounded border border-white bg-[#dfdfdf] p-3 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
            月間消費電力（予測）
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {formatNumber(Math.round(monthlyCoolingKwh))} kWh
          </p>
          <p className="mt-1 text-xs text-gray-700">
            {formatHours(coolingHoursPerDay)} 時間/日 × 30 日
          </p>
        </div>
      </div>
    </div>
  );

  const renderHeatingStep = () => (
    <div className="text-sm">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)]">
        <div className="space-y-4">
          <label className="space-y-1">
            <span className="block font-semibold text-gray-800">
              1日あたりの暖房時間
            </span>
            <input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={heatingHoursPerDay}
              onChange={(event) =>
                handleHeatingHoursChange(Number(event.target.value))
              }
              className="w-full border border-black bg-white px-2 py-1 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] focus:outline-none"
            />
          </label>

          <div className="rounded border border-white bg-[#dfdfdf] p-3 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
            <p className="mb-2 font-semibold text-gray-800">
              比較する暖房器具を選択
            </p>
            <div className="max-h-48 space-y-2 overflow-auto pr-1">
              {heaters.map((heater) => {
                const checked = selectedHeaterIds.includes(heater.id);
                const result = heatingResults.find(
                  (entry) => entry.heater.id === heater.id,
                );

                return (
                  <label
                    key={heater.id}
                    className="flex items-start gap-2 rounded border border-white bg-[#efefef] p-2 shadow-[1px_1px_0_0_rgba(255,255,255,0.6)_inset,-1px_-1px_0_0_rgba(0,0,0,0.35)_inset]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleHeater(heater.id)}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-semibold text-gray-900">
                        {heater.name}
                      </p>
                      <p className="text-xs text-gray-700 leading-tight">
                        {describeHeater(heater)}
                      </p>
                      {result ? (
                        <p className="text-xs font-medium text-gray-800">
                          {formatYen(result.cost)} / 月
                        </p>
                      ) : null}
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-gray-700">
              ※ 最低1つの暖房器具を選択してください
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded border border-white bg-[#dfdfdf] p-3 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
              暖房コスト比較
            </p>
            <div className="mt-2 space-y-2">
              {heatingResults.map(({ heater, cost }, index) => (
                <div
                  key={heater.id}
                  className="flex items-center justify-between rounded border border-white bg-[#f8f8f8] px-2 py-1 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.4)]"
                >
                  <span className="truncate text-gray-800">
                    {index === 0 ? "★ " : "- "}
                    {heater.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatYen(cost)}
                  </span>
                </div>
              ))}
              {!heatingResults.length && (
                <p className="text-xs text-gray-700">
                  暖房器具を選択してください
                </p>
              )}
            </div>
          </div>

          <div className="rounded border border-white bg-[#dfdfdf] p-3 text-xs text-gray-700 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
            <p className="font-semibold text-gray-800">計算条件</p>
            <p>
              {formatHours(heatingHoursPerDay)} 時間/日 × {DAYS_PER_MONTH} 日 =
              合計 {formatHours(heatingHoursPerDay * DAYS_PER_MONTH)} 時間
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-4 text-sm">
      <div className="rounded border border-white bg-[#dfdfdf] p-4 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
        <p className="mb-2 font-semibold text-gray-900">冷房コスト</p>
        <p className="text-lg font-bold text-gray-900">
          {formatYen(coolingCost)}
        </p>
        <p className="text-xs text-gray-700">
          月間使用量 {formatNumber(Math.round(monthlyCoolingKwh))} kWh（{formatHours(
            coolingHoursPerDay,
          )} 時間/日 × 30 日）
        </p>
        <div className="mt-3 border border-black bg-white">
          <table className="w-full text-left text-xs text-gray-800">
            <thead className="bg-[#000080] text-black">
              <tr>
                <th className="px-2 py-1">段階</th>
                <th className="px-2 py-1">単価</th>
                <th className="px-2 py-1">使用量</th>
                <th className="px-2 py-1">料金</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-t border-black px-2 py-1">基本料金</td>
                <td className="border-t border-black px-2 py-1">-</td>
                <td className="border-t border-black px-2 py-1">-</td>
                <td className="border-t border-black px-2 py-1">
                  {formatYen(coolingBreakdown.baseFee)}
                </td>
              </tr>
              {coolingBreakdown.stages.map((stage, index) => (
                <tr key={index}>
                  <td className="border-t border-black px-2 py-1">
                    第 {index + 1} 段階
                  </td>
                  <td className="border-t border-black px-2 py-1">
                    {formatNumber(stage.rate)} 円/kWh
                  </td>
                  <td className="border-t border-black px-2 py-1">
                    {formatNumber(stage.usageKwh)} kWh
                  </td>
                  <td className="border-t border-black px-2 py-1">
                    {formatYen(stage.cost)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border-t border-black px-2 py-1 font-semibold">
                  合計
                </td>
                <td className="border-t border-black px-2 py-1" />
                <td className="border-t border-black px-2 py-1" />
                <td className="border-t border-black px-2 py-1 font-semibold">
                  {formatYen(coolingBreakdown.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded border border-white bg-[#dfdfdf] p-4 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
        <p className="mb-2 font-semibold text-gray-900">暖房コスト比較</p>
        <div className="space-y-1">
          {heatingResults.map(({ heater, cost }, index) => (
            <div
              key={heater.id}
              className="flex items-center justify-between border border-white bg-[#efefef] px-3 py-2 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)]"
            >
              <span className="text-gray-800">
                {index === 0 ? "★" : "-"} {heater.name}
              </span>
              <span className="font-semibold text-gray-900">
                {formatYen(cost)}
              </span>
            </div>
          ))}
        </div>
        {leadingHeating ? (
          <p className="mt-2 text-xs text-gray-700">
            最安オプション: {leadingHeating.heater.name}（{formatYen(
              leadingHeating.cost,
            )} / 月）
          </p>
        ) : null}
      </div>
    </div>
  );
  const stepConfigs: StepConfig[] = [
    {
      id: "region",
      title: "ステップ1: 地域設定",
      description:
        "お住まいの地域を選択してください。電力・ガス・灯油の料金表が自動で読み込まれます。",
      body: renderRegionStep(),
      canProceed: Boolean(selectedRegionId),
      primaryLabel: "次へ >",
    },
    {
      id: "cooling",
      title: "ステップ2: 冷房設定",
      description:
        "部屋の広さとエアコン機種を選び、1日あたりの冷房使用時間を設定してください。",
      body: renderCoolingStep(),
      canProceed: Boolean(selectedModelId),
      primaryLabel: "次へ >",
    },
    {
      id: "heating",
      title: "ステップ3: 暖房設定",
      description:
        "比較したい暖房器具を選び、1日あたりの使用時間を設定してランニングコストを比較します。",
      body: renderHeatingStep(),
      canProceed: selectedHeaterIds.length > 0,
      primaryLabel: "次へ >",
    },
    {
      id: "summary",
      title: "ステップ4: 結果確認",
      description: "算出された月額コストをご確認ください。",
      body: renderSummaryStep(),
      canProceed: true,
      primaryLabel: "完了",
    },
  ];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === stepConfigs.length - 1;
  const step = stepConfigs[currentStep];

  const handleNext = () => {
    if (!step.canProceed) {
      return;
    }
    if (isLastStep) {
      handleCancel();
      return;
    }
    setCurrentStep((value) => Math.min(stepConfigs.length - 1, value + 1));
  };

  const handleBack = () => {
    setCurrentStep((value) => Math.max(0, value - 1));
  };
  return (
    <div
      className="relative min-h-screen bg-[#008080] text-black"
      style={{ fontFamily: "Tahoma, 'MS Sans Serif', sans-serif" }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[repeating-linear-gradient(135deg,#006666_0px,#006666_16px,#008080_16px,#008080_32px)] opacity-40" />

      <div className="absolute left-6 top-6 z-10 flex flex-col gap-8 text-white my-computer-container">
        <div className="flex flex-col items-center gap-2">
          <img src={MyComputer} alt="マイ コンピュータ" className="h-12 w-12 my-computer" />
          <span className="text-xs">マイ コンピュータ</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12" />
          <img src={FileExplorer} alt="エクスプローラ" className="h-12 w-12 file-explorer" />
          <span className="text-xs">エクスプローラ</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12" />
          <img src={CostCalculator} alt="コスト電卓" className="h-12 w-12 cost-calculator" />
          <span className="text-xs">コスト電卓</span>
        </div>
      </div>

      <div className="absolute right-8 top-8 z-10 flex flex-col items-center gap-2 text-white garbage-can-container">
        <img src={GarbageCan} alt="ごみ箱" className="h-12 w-12 garbage-can" />
        <span className="text-xs">ごみ箱</span>
      </div>

      <div className="relative z-20 mx-auto mt-24 w-[min(90%,720px)] border border-black bg-[#c0c0c0] shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] setup-window">
        <div className="flex items-center justify-between bg-[#000080] px-3 py-2 text-white">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border border-white bg-[#c0c0c0]" />
            <span className="text-sm font-semibold title-text">コスト電卓 セットアップ</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={TitleBar} alt="Minimize/Maximize/Close" className="h-5 w-8 cursor-pointer title-bar" />
          </div>
        </div>

        <div className="border border-[#808080] bg-[#dfdfdf] p-6">
          <div className="mb-4 border border-white bg-white/80 p-4 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
            <p className="text-lg font-bold text-gray-900">{step.title}</p>
            <p className="mt-2 text-sm text-gray-800">{step.description}</p>
            <p className="mt-2 text-xs text-gray-600">
              Step {currentStep + 1} / {stepConfigs.length}
            </p>
          </div>

          <div className="min-h-[220px] max-h-[320px] overflow-y-auto border border-white bg-[#f4f4f4] p-4 shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)]">
            {step.body}
          </div>

          <div className="mt-6 flex items-center justify-between border border-white bg-[#dfdfdf] px-4 py-3 shadow-[1px_1px_0_0_rgba(255,255,255,0.7)_inset,-1px_-1px_0_0_rgba(0,0,0,0.4)_inset]">
            <div className="text-xs text-gray-700">
              お問い合わせ: support@example.com
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="border border-black bg-[#dfdfdf] px-4 py-1 text-sm shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] hover:bg-white button-text"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirstStep}
                className={`border border-black px-4 py-1 text-sm shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] button-text ${
                  isFirstStep
                    ? "bg-[#bebebe] text-gray-500"
                    : "bg-[#dfdfdf] hover:bg-white"
                }`}
              >
                {"< 戻る"}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!step.canProceed}
                className={`border border-black px-4 py-1 text-sm shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)] button-text ${
                  step.canProceed
                    ? "bg-[#dfdfdf] hover:bg-white"
                    : "bg-[#bebebe] text-gray-500"
                }`}
              >
                {step.primaryLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 flex h-12 items-stretch border-t border-black bg-[#c0c0c0] taskbar">
        {/* Left section: Start & Window buttons */}
        <div className="flex items-center">
          <button className="p-0 m-0 border-none bg-transparent w-12 h-12 flex items-center justify-center">
            <img src={Start} alt="Start" className="w-full h-full object-contain start-button" />
          </button>
          <div className="border border-black bg-[#efefef] px-3 py-1 text-xs shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)]">
            コスト電卓 セットアップ
          </div>
        </div>
        {/* Spacer: take all available middle space */}
        <div className="flex-1" />
        {/* Right section: Clock */}
        <div className="flex items-center pr-3">
          <div className="border border-black bg-[#efefef] px-3 py-1 text-xs shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)]">
            {taskbarTime}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;



