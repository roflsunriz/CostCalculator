import Icon from "@mdi/react";
import {
  mdiMapMarkerRadius,
  mdiFlash,
  mdiGasStation,
  mdiOil,
} from "@mdi/js";
import { formatNumber, formatYen } from "@/utils/format";
import { regions } from "@/data";
import type { ElectricityCompany, GasCompany, KeroseneRegion } from "@/data";

interface RegionTabProps {
  selectedRegionId: string;
  onRegionChange: (regionId: string) => void;
  electricityCompany: ElectricityCompany;
  gasCompany: GasCompany;
  keroseneRegion: KeroseneRegion;
}

export function RegionTab({
  selectedRegionId,
  onRegionChange,
  electricityCompany,
  gasCompany,
  keroseneRegion,
}: RegionTabProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Premium Region Selection Card */}
      <div className="glass-card rounded-3xl p-6 lg:col-span-1">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 blur-xl" />
            <div className="relative rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 p-3">
              <Icon path={mdiMapMarkerRadius} size={1.2} className="text-blue-300 drop-shadow-lg" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">地域設定</h2>
            <p className="text-xs text-gray-400 mt-1">
              地域を選択すると、電力・ガス・灯油単価が自動更新されます。
            </p>
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
            地域を選択
          </span>
          <div className="relative mt-2">
            <select
              value={selectedRegionId}
              onChange={(event) => onRegionChange(event.target.value)}
              className="
                w-full appearance-none rounded-xl 
                bg-gradient-to-r from-white/5 to-white/3
                border border-white/10 px-4 py-3 pr-10
                text-sm font-medium text-white outline-none 
                transition-all duration-200
                focus:border-blue-400/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]
                hover:bg-white/[0.07]
              "
            >
              {regions.map((region: typeof regions[number]) => (
                <option key={region.id} value={region.id}>
                  {region.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </label>
      </div>

      {/* Premium Utility Companies Info */}
      <div className="glass-card rounded-3xl p-8 lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">ユーティリティ料金</h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Electricity Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent border border-cyan-400/20 p-5 transition-all hover:scale-105 hover:border-cyan-400/30">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">
                    電力
                  </p>
                  <p className="text-sm font-bold text-white mt-1">
                    {electricityCompany.name}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 blur-lg" />
                  <div className="relative rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-2.5">
                    <Icon path={mdiFlash} size={1} className="text-cyan-300 drop-shadow" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">
                    {formatYen(electricityCompany.baseFee)}
                  </span>
                  <span className="text-xs text-gray-400">/ 月</span>
                </div>
                <div className="mt-2 text-xs text-gray-400 font-medium">
                  {electricityCompany.rates.length}段階料金制
                </div>
              </div>
              
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div className="shimmer h-full w-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-30" />
              </div>
            </div>
          </article>

          {/* Gas Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-600/5 to-transparent border border-emerald-400/20 p-5 transition-all hover:scale-105 hover:border-emerald-400/30">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
                    ガス
                  </p>
                  <p className="text-sm font-bold text-white mt-1">
                    {gasCompany.name}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-green-600/30 blur-lg" />
                  <div className="relative rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 p-2.5">
                    <Icon path={mdiGasStation} size={1} className="text-emerald-300 drop-shadow" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">
                    {formatNumber(gasCompany.rate)}
                  </span>
                  <span className="text-xs text-gray-400">円 / m³</span>
                </div>
                <div className="mt-2 text-xs text-gray-400 font-medium">
                  都市ガス料金
                </div>
              </div>
              
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div className="shimmer h-full w-full bg-gradient-to-r from-emerald-400 to-green-400 opacity-30" />
              </div>
            </div>
          </article>

          {/* Kerosene Card */}
          <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-600/5 to-transparent border border-amber-400/20 p-5 transition-all hover:scale-105 hover:border-amber-400/30">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
                    灯油
                  </p>
                  <p className="text-sm font-bold text-white mt-1">
                    {keroseneRegion.name}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-600/30 blur-lg" />
                  <div className="relative rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 p-2.5">
                    <Icon path={mdiOil} size={1} className="text-amber-300 drop-shadow" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">
                    {formatNumber(keroseneRegion.rate)}
                  </span>
                  <span className="text-xs text-gray-400">円 / L</span>
                </div>
                <div className="mt-2 text-xs text-gray-400 font-medium">
                  配達灯油価格
                </div>
              </div>
              
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div className="shimmer h-full w-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-30" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}