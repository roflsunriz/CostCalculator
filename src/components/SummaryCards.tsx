import Icon from "@mdi/react";
import { mdiSnowflake, mdiFire, mdiFlash } from "@mdi/js";
import { formatNumber, formatYen } from "@/utils/format";
import type { ElectricityCompany } from "@/data";

interface SummaryCardsProps {
  coolingCost: number;
  monthlyCoolingKwh: number;
  coolingHoursPerDay: number;
  leadingHeating:
    | {
        heater: {
          id: string;
          name: string;
        };
        cost: number;
      }
    | undefined;
  heatingHoursPerDay: number;
  electricityCompany: ElectricityCompany;
}

const DAYS_PER_MONTH = 30;

export function SummaryCards({
  coolingCost,
  monthlyCoolingKwh,
  coolingHoursPerDay,
  leadingHeating,
  heatingHoursPerDay,
  electricityCompany,
}: SummaryCardsProps) {
  const highlightStats = [
    {
      title: "月間冷房費",
      value: formatYen(coolingCost),
      icon: mdiSnowflake,
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/10 via-blue-600/5 to-transparent",
      iconBg: "from-cyan-500/20 to-blue-600/20",
      detail: `消費 ${formatNumber(monthlyCoolingKwh)} kWh`,
      meta: `${coolingHoursPerDay}時間 × ${DAYS_PER_MONTH}日`,
    },
    {
      title: "最安暖房機器",
      value: leadingHeating ? formatYen(leadingHeating.cost) : "—",
      icon: mdiFire,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/10 via-red-600/5 to-transparent",
      iconBg: "from-orange-500/20 to-red-600/20",
      detail: leadingHeating
        ? leadingHeating.heater.name
        : "比較対象を選択してください",
      meta: `${heatingHoursPerDay}時間 × ${DAYS_PER_MONTH}日`,
    },
    {
      title: "電力基本料金",
      value: formatYen(electricityCompany.baseFee),
      icon: mdiFlash,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 via-purple-600/5 to-transparent",
      iconBg: "from-violet-500/20 to-purple-600/20",
      detail: electricityCompany.name,
      meta: `${electricityCompany.rates.length}段階料金`,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {highlightStats.map((card, index) => (
        <div
          key={card.title}
          className="glass-card glass-card-hover group relative overflow-hidden rounded-3xl p-6"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Premium Background Gradient */}
          <div className="absolute inset-0 opacity-40">
            <div className={`h-full w-full bg-gradient-to-br ${card.bgGradient}`} />
          </div>
          
          {/* Content */}
          <div className="relative space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                  {card.title}
                </p>
                <div className="h-0.5 w-8 bg-gradient-to-r opacity-60 group-hover:w-12 transition-all duration-300 rounded-full">
                  <div className={`h-full bg-gradient-to-r ${card.gradient}`} />
                </div>
              </div>
              
              {/* Icon with Premium Effect */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.iconBg} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                <div className={`relative rounded-2xl bg-gradient-to-br ${card.iconBg} p-3`}>
                  <Icon 
                    path={card.icon} 
                    size={1.1} 
                    className="text-white drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Value with Animation */}
            <div className="space-y-2">
              <p className="text-4xl font-black text-white tracking-tight group-hover:scale-105 transition-transform origin-left">
                {card.value}
              </p>
              <p className="text-sm font-medium text-gray-300">
                {card.detail}
              </p>
            </div>
            
            {/* Meta Info */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <p className="text-xs text-gray-500">{card.meta}</p>
              <div className="flex h-1.5 w-12 overflow-hidden rounded-full bg-white/5">
                <div className={`shimmer h-full w-full bg-gradient-to-r ${card.gradient} opacity-50`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
