import { useState } from 'react';
import { Link2, FileText, Trash2, Plus, ExternalLink } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';

export default function SmartSpace({ dayId }) {
    const { savedResources, addResource, removeResource } = useRoadmapStore();
    const resources = savedResources[dayId] || [];

    const [inputValue, setInputValue] = useState('');
    const [resourceType, setResourceType] = useState('link');

    const handleAdd = () => {
        if (!inputValue.trim()) return;
        let finalValue = inputValue.trim();
        if (resourceType === 'link' && !/^https?:\/\//i.test(finalValue)) {
            finalValue = `https://${finalValue}`;
        }

        addResource(dayId, {
            type: resourceType,
            value: finalValue
        });

        setInputValue('');
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Smart Space & Notes
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                    {resources.length} saved
                </span>
            </div>

            {/* Render List of Saved Links/Notes */}
            {resources.length > 0 && (
                <div className="space-y-2 mb-3">
                    {resources.map((res) => (
                        <div
                            key={res.id}
                            className="group flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700/60 transition-colors"
                        >
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                                {res.type === 'link' ? (
                                    <Link2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                ) : (
                                    <FileText className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                )}

                                {res.type === 'link' ? (
                                    <a
                                        href={res.value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline truncate flex items-center gap-1"
                                    >
                                        <span className="truncate">{res.value}</span>
                                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70" />
                                    </a>
                                ) : (
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                                        {res.value}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => removeResource(dayId, res.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded opacity-80 group-hover:opacity-100"
                                title="Delete item"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Controls */}
            <div className="flex items-center gap-2">
                <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="link">Link</option>
                    <option value="note">Note</option>
                </select>

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder={resourceType === 'link' ? 'Paste reference link...' : 'Type a quick note...'}
                    className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
                />

                <button
                    onClick={handleAdd}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex-shrink-0 active:scale-95"
                    title="Add to Smart Space"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}