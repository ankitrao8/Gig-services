import React from 'react';
import { Worker, SkillLevel } from '../../types';
import { Award, Star, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface SkillGraphProps {
  worker: Worker;
}

export const SkillGraph: React.FC<SkillGraphProps> = ({ worker }) => {
  // Formula: Completed Jobs * Average Rating * (On-Time % / 100)
  // Normalized score 0-100%
  const rawScore = worker.completedJobs * worker.averageRating * (worker.onTimePercentage / 100);
  const percentage = Math.min(100, Math.max(15, Math.round((rawScore / 300) * 100)));

  const getTierDetails = (level: SkillLevel) => {
    switch (level) {
      case 'MASTER':
        return {
          color: 'text-purple-700 bg-purple-100 border-purple-300',
          barColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          nextGoal: 'Maximum Master Tier Reached! Eligible for cooperative master trainer stipend.'
        };
      case 'GOLD':
        return {
          color: 'text-amber-700 bg-amber-100 border-amber-300',
          barColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
          nextGoal: 'Next: Master Tier (Requires 100+ jobs, 4.7+ rating, 90%+ on-time)'
        };
      case 'SILVER':
        return {
          color: 'text-slate-700 bg-slate-200 border-slate-300',
          barColor: 'bg-gradient-to-r from-slate-400 to-slate-600',
          nextGoal: 'Next: Gold Tier (Requires 40+ jobs, 4.4+ rating, 85%+ on-time)'
        };
      default:
        return {
          color: 'text-amber-800 bg-amber-50 border-amber-200',
          barColor: 'bg-gradient-to-r from-amber-600 to-amber-700',
          nextGoal: 'Next: Silver Tier (Requires 15+ jobs, 4.0+ rating)'
        };
    }
  };

  const tier = getTierDetails(worker.skillLevel);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Automated Cooperative Assessment
          </span>
          <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2 mt-0.5">
            <span>{worker.skills[0]?.name.toUpperCase() || 'GENERAL SERVICES'}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${tier.color}`}>
              {worker.skillLevel}
            </span>
          </h3>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-slate-900">{percentage}%</div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Skill Score</div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${tier.barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mt-1.5 px-0.5">
          <span>Bronze</span>
          <span>Silver</span>
          <span>Gold</span>
          <span>Master</span>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
          <div className="flex items-center justify-center text-slate-400 mb-1">
            <CheckCircle className="w-4 h-4 text-coop-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">{worker.completedJobs}</div>
          <div className="text-[10px] text-slate-500 font-medium">Completed Jobs</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
          <div className="flex items-center justify-center text-slate-400 mb-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-base font-extrabold text-slate-900">{worker.averageRating}</div>
          <div className="text-[10px] text-slate-500 font-medium">Avg Rating</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
          <div className="flex items-center justify-center text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-base font-extrabold text-slate-900">{worker.onTimePercentage}%</div>
          <div className="text-[10px] text-slate-500 font-medium">On-Time %</div>
        </div>
      </div>

      {/* Milestone Threshold Guidance */}
      <div className="p-3 rounded-2xl bg-coop-50/70 border border-coop-200/60 text-xs text-coop-900 flex items-start space-x-2.5">
        <TrendingUp className="w-4 h-4 text-coop-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Next Milestone: </span>
          <span>{tier.nextGoal}</span>
        </div>
      </div>
    </div>
  );
};
