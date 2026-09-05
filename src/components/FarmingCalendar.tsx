import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  Clock,
  AlertCircle,
  Filter,
  Sparkles,
  Droplets,
  Sprout,
  X,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export const FarmingCalendar: React.FC = () => {
  const { tasks, toggleTaskCompletion, addTask, fields } = useFarm();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [fieldId, setFieldId] = useState(fields[0]?.id || '');
  const [category, setCategory] = useState<'Irrigation' | 'Fertilizer' | 'Pest Control' | 'Weeding' | 'Harvesting' | 'General'>('Fertilizer');
  const [dueDate, setDueDate] = useState('Tomorrow');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [description, setDescription] = useState('');

  const categories = ['All', 'Fertilizer', 'Irrigation', 'Pest Control', 'Harvesting', 'Weeding'];

  const filteredTasks = tasks.filter(task => {
    if (activeCategory === 'All') return true;
    return task.category === activeCategory;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenField = fields.find(f => f.id === fieldId) || fields[0];

    addTask({
      fieldId: chosenField?.id || 'field-1',
      fieldName: chosenField?.name || 'General Field',
      crop: chosenField?.currentCrop || 'Wheat',
      title: title.trim(),
      category,
      dueDate,
      daysAfterSowing: 60,
      priority,
      description: description.trim() || 'Custom agronomy task',
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Crop Lifecycle & Agronomic Task Reminders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Smart Crop Calendar
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Stage-wise intercultural tasks, fertigation cycles, and harvest countdown.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Season Guide Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Active Indian Crop Season: Rabi 2026-27
            </span>
          </div>
          <span className="text-xs text-emerald-200 font-medium">Optimal sowing to harvest: Oct - Apr</span>
        </div>
        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
          Major crops in ground: Wheat (GW-322), Late Kharif Red Onion (Bhima Super), and BT Cotton final pickings. Ensure foliar nutrition during grain filling and protect onion bulbs from fungal purple blotch.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-stone-500 flex items-center gap-1 pl-1 pr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List Grid */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start gap-3.5 bg-white ${
              task.completed
                ? 'border-stone-200/60 bg-stone-50/50 opacity-60'
                : 'border-stone-200 hover:border-emerald-300 shadow-xs'
            }`}
          >
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer shrink-0 ${
                task.completed
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-stone-300 hover:border-emerald-600 text-transparent'
              }`}
              aria-label="Toggle task"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                    {task.crop}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <span className="text-stone-500 font-medium">Due: {task.dueDate}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                {task.description}
              </p>

              <div className="mt-2.5 flex items-center gap-3 text-[11px] text-stone-500">
                <span className="font-semibold text-stone-700">{task.fieldName}</span>
                <span>• Category: {task.category}</span>
                <span>• Sown +{task.daysAfterSowing} Days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-stone-900">Schedule Farm Task</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Spray 13:00:45 Potassium Nitrate"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Select Plot
                  </label>
                  <select
                    value={fieldId}
                    onChange={e => setFieldId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {fields.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.currentCrop})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Fertilizer">Fertilizer Dose</option>
                    <option value="Irrigation">Irrigation Cycle</option>
                    <option value="Pest Control">Pest Control / Spray</option>
                    <option value="Weeding">Weeding / Intercultural</option>
                    <option value="Harvesting">Harvesting & Threshing</option>
                    <option value="General">General Farm Work</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Due Date / Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tomorrow, 10 Sep"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Task Instructions / Dosage
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Mix 5g per liter with silicone sticker. Apply before noon."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
