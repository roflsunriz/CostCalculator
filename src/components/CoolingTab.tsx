import Icon from "@mdi/react";
import {
  mdiSnowflake,
  mdiAlertCircleOutline,
  mdiClockOutline,
} from "@mdi/js";
import { formatNumber, formatYen } from "@/utils/format";
import { acModels, roomSizes, recommendedModelsForRoom } from "@/data";
import type { AirConditionerModel, ElectricityCompany } from "@/data";
import type { ElectricityCostBreakdown, ElectricityCostBreakdownStage } from "@/types/cost";

interface CoolingTabProps {
  selectedRoomSize: number;
  onRoomSizeChange: (size: number) => void;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  coolingHoursPerDay: number;
  onCoolingHoursChange: (hours: number) => void;
  heatingHoursPerDay: number;
  onHeatingHoursChange: (hours: number) => void;
  coolingCost: number;
  monthlyCoolingKwh: number;
  coolingBreakdown: ElectricityCostBreakdown;
  isModelRecommended: boolean;
  recommendedModels: AirConditionerModel[];
  electricityCompany: ElectricityCompany;
}

const DAYS_PER_MONTH = 30;

export function CoolingTab({
  selectedRoomSize,
  onRoomSizeChange,
  selectedModelId,
  onModelChange,
  coolingHoursPerDay,
  onCoolingHoursChange,
  heatingHoursPerDay,
  onHeatingHoursChange,
  coolingCost,
  monthlyCoolingKwh,
  coolingBreakdown,
  isModelRecommended,
  recommendedModels,
  electricityCompany,
}: CoolingTabProps) {
  const selectedModel =
    acModels.find((m: AirConditionerModel) => m.id === selectedModelId) ?? acModels[0];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Premium Settings Panel */}
      <div className="space-y-6 lg:col-span-1">
        {/* Room Size Selection */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 blur-xl" />
              <div className="relative rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-3">
                <Icon path={mdiSnowflake} size={1.2} className="text-cyan-300 drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                部屋のサイズ
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                推奨モデルが自動更新されます
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {roomSizes.map((size: number) => {
              const isActive = size === selectedRoomSize;
              const models = recommendedModelsForRoom(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onRoomSizeChange(size)}
                  className={`
                    relative rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200
                    ${
                      isActive
                        ? "neu-button bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white scale-105"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur" />
                  )}
                  <div className="relative">
                    <div className="text-base">{size}畳</div>
                    <div className="text-[10px] opacity-70">{models.length}モデル</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AC Model Selection */}
        <div className="glass-card rounded-3xl p-6">
          <label className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                ACモデル
              </p>
              <p className="text-xs text-gray-500 mt-1">
                消費電力を選択
              </p>
            </div>
            <div className="relative">
              <select
                value={selectedModel.id}
                onChange={(event) => onModelChange(event.target.value)}
                className="
                  w-full appearance-none rounded-xl 
                  bg-gradient-to-r from-white/5 to-white/3
                  border border-white/10 px-4 py-3 pr-10
                  text-sm font-medium text-white outline-none 
                  transition-all duration-200
                  focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]
                  hover:bg-white/[0.07]
                "
              >
                {acModels.map((model: AirConditionerModel) => {
                  const inRange = recommendedModels.some(
                    (item) => item.id === model.id,
                  );
                  return (
                    <option key={model.id} value={model.id}>
                      {model.id} / {formatNumber(model.coolingCapacity)}kW / 消費
                      {formatNumber(model.power)}kW {inRange ? "✓" : ""}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </label>

          {!isModelRecommended && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20 p-4">
              <div className="flex gap-3">
                <Icon
                  path={mdiAlertCircleOutline}
                  size={0.9}
                  className="shrink-0 text-amber-300 drop-shadow"
                />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-amber-200">
                    サイズ不一致
                  </p>
                  <p className="text-xs text-amber-100/80 leading-relaxed">
                    {selectedRoomSize}畳には非推奨です。最適なパフォーマンスを得るため、部屋サイズに合ったモデルを選択してください。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Operating Hours */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-gray-600/30 blur-xl" />
              <div className="relative rounded-2xl bg-gradient-to-br from-gray-400/20 to-gray-600/20 p-3">
                <Icon path={mdiClockOutline} size={1.1} className="text-gray-300 drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                運用条件
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                使用時間を設定
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                冷房時間 / 日
              </span>
              <div className="relative mt-2">
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={coolingHoursPerDay}
                  onChange={(event) =>
                    onCoolingHoursChange(Number(event.target.value) || 0)
                  }
                  className="
                    w-full rounded-xl
                    bg-gradient-to-r from-white/5 to-white/3
                    border border-white/10 px-4 py-3
                    text-sm font-medium text-white outline-none
                    transition-all duration-200
                    focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]
                    hover:bg-white/[0.07]
                  "
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  時間
                </span>
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                暖房時間 / 日
              </span>
              <div className="relative mt-2">
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={heatingHoursPerDay}
                  onChange={(event) =>
                    onHeatingHoursChange(Number(event.target.value) || 0)
                  }
                  className="
                    w-full rounded-xl
                    bg-gradient-to-r from-white/5 to-white/3
                    border border-white/10 px-4 py-3
                    text-sm font-medium text-white outline-none
                    transition-all duration-200
                    focus:border-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                    hover:bg-white/[0.07]
                  "
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  時間
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Premium Results Panel */}
      <div className="glass-card rounded-3xl p-8 lg:col-span-2">
        <h2 className="text-2xl font-bold text-white mb-8">
          月間電気代試算
        </h2>

        {/* Main Cost Display */}
        <div className="relative rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent p-8 mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-600/5 blur-xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 mb-4">
              月間推定費用
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-5xl font-black text-white tracking-tight">
                  {formatYen(coolingCost)}
                </p>
                <p className="text-sm text-gray-300 mt-3 font-medium">
                  消費電力量: <span className="text-cyan-300">{formatNumber(monthlyCoolingKwh)} kWh</span>
                </p>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 bg-gradient-to-r from-cyan-500/50 to-blue-600/50 rounded-full" />
                  <span className="text-gray-400">{coolingHoursPerDay} 時間 / 日</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-full" />
                  <span className="text-gray-400">{DAYS_PER_MONTH} 日 / 月</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 bg-gradient-to-r from-violet-500/50 to-pink-600/50 rounded-full" />
                  <span className="text-white font-semibold">{electricityCompany.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
              料金明細
            </p>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          
          {/* Base Fee */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/3 border border-white/10 px-5 py-4 transition-all hover:bg-white/[0.07]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400" />
                <span className="text-sm font-medium text-gray-300">基本料金</span>
              </div>
              <span className="text-sm font-bold text-white">
                {formatYen(coolingBreakdown.baseFee)}
              </span>
            </div>
            <div className="premium-hover" />
          </div>

          {/* Stage Costs */}
          {coolingBreakdown.stages.map((stage: ElectricityCostBreakdownStage, idx: number) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/3 border border-white/10 px-5 py-4 transition-all hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${
                    idx === 0 ? "from-cyan-400 to-blue-400" :
                    idx === 1 ? "from-blue-400 to-indigo-400" :
                    "from-indigo-400 to-purple-400"
                  }`} />
                  <span className="text-sm font-medium text-gray-300">
                    {Number.isFinite(stage.limit)
                      ? `～${formatNumber(stage.limit)} kWh`
                      : "超過分"}{" "}
                    <span className="text-xs text-gray-500">
                      × {formatNumber(stage.rate)}円
                    </span>
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {formatYen(stage.cost)}
                </span>
              </div>
              <div className="premium-hover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}