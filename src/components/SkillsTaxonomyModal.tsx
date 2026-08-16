import React, { useState } from 'react';
import { Database, Search, Tag, Sparkles, X, Layers } from 'lucide-react';
import { SKILLS_MASTER } from '../data/skillsMaster';
import { SkillCategory } from '../types';

interface SkillsTaxonomyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillsTaxonomyModal: React.FC<SkillsTaxonomyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories: SkillCategory[] = [
    'Frontend',
    'Backend',
    'Data & AI',
    'Cloud & DevOps',
    'Databases',
    'Architecture',
    'Testing & QA',
    'Soft Skills & Leadership'
  ];

  const filteredSkills = SKILLS_MASTER.filter(skill => {
    if (selectedCategory !== 'ALL' && skill.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = skill.name.toLowerCase().includes(q);
      const matchAlias = skill.aliases.some(a => a.toLowerCase().includes(q));
      const matchDesc = skill.description?.toLowerCase().includes(q);
      if (!matchName && !matchAlias && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Kaggle-Derived Controlled Skills Master</h3>
              <p className="text-xs text-slate-400">
                Taxonomy, Aliases & Semantic Equivalence Clusters ({SKILLS_MASTER.length} core master entities)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skill (e.g. PyTorch, React, AWS, Kubernetes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-950 text-slate-200 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({SKILLS_MASTER.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filteredSkills.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No skills match your search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{skill.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium">
                        {skill.category}
                      </span>
                    </div>
                    {skill.difficultyTier && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {skill.difficultyTier}
                      </span>
                    )}
                  </div>

                  {skill.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {skill.description}
                    </p>
                  )}

                  {/* Aliases */}
                  {skill.aliases && skill.aliases.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-[11px]">
                      <span className="text-slate-500">Aliases:</span>
                      {skill.aliases.slice(0, 5).map((alias, aIdx) => (
                        <span key={aIdx} className="bg-slate-800/80 text-slate-300 px-1.5 py-0.2 rounded font-mono text-[10px]">
                          {alias}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Equivalents */}
                  {skill.equivalents && skill.equivalents.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" /> Semantic Equivalents:
                      </span>
                      <div className="space-y-0.5">
                        {skill.equivalents.map((eq, eIdx) => (
                          <p key={eIdx} className="text-[11px] text-slate-300">
                            <strong className="text-cyan-300">{eq.skillId}</strong> ({Math.round(eq.similarity * 100)}% match) — <span className="text-slate-400">{eq.rationale}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0 text-xs text-slate-400">
          <span>Kaggle Taxonomy normalized for ATS/HR enterprise evaluation.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
