'use client';

import { useState, type FormEvent } from 'react';
import { 
  Zap, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Sparkles, 
  CheckCircle,
  Sliders,
  ChevronDown,
  X
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  description: string;
  configLabel: string;
  configValue: string;
}

interface Workflow {
  id: string;
  name: string;
  triggerType: 'comment' | 'dm' | 'follow';
  triggerValue: string;
  actionMessage: string;
  isActive: boolean;
  sentCount: number;
  conversionCount: number;
  nodes: WorkflowNode[];
}

const initialWorkflows: Workflow[] = [
  // No initial workflows for a fresh account
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  // Form states for creating a new workflow
  const [newWfName, setNewWfName] = useState<string>('');
  const [newTriggerType, setNewTriggerType] = useState<'comment' | 'dm' | 'follow'>('comment');
  const [newTriggerValue, setNewTriggerValue] = useState<string>('');
  const [newActionMessage, setNewActionMessage] = useState<string>('');

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId) || null;

  const toggleWorkflowActive = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, isActive: !w.isActive };
      }
      return w;
    }));
  };

  const handleDeleteWorkflow = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (selectedWorkflowId === id) {
      setSelectedWorkflowId(null);
    }
  };

  const handleCreateWorkflow = (e: FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) return;

    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      name: newWfName,
      triggerType: newTriggerType,
      triggerValue: newTriggerValue || (newTriggerType === 'follow' ? 'New Follower' : 'All incoming messages'),
      actionMessage: newActionMessage,
      isActive: true,
      sentCount: 0,
      conversionCount: 0,
      nodes: [
        { 
          id: `n-${Date.now()}-1`, 
          type: 'trigger', 
          title: newTriggerType === 'comment' ? 'Comment Received' : newTriggerType === 'dm' ? 'DM Received' : 'New Follower', 
          description: newTriggerType === 'comment' ? 'User comments on post' : newTriggerType === 'dm' ? 'User DMs page' : 'User starts following',
          configLabel: (() => {
            if (newTriggerType === 'comment') return 'Keyword contains';
            if (newTriggerType === 'dm') return newTriggerValue ? 'Keyword contains' : 'Trigger condition';
            if (newTriggerType === 'follow') return 'Condition';
            return ''; // Should not happen
          })(),
          configValue: (() => {
            if (newTriggerType === 'comment') return newTriggerValue || 'Any';
            if (newTriggerType === 'dm') return newTriggerValue || 'All incoming messages';
            if (newTriggerType === 'follow') return 'Immediately';
            return ''; // Should not happen
          })()
        },
        { 
          id: `n-${Date.now()}-2`, 
          type: 'action', 
          title: 'Direct Message Responder', 
          description: 'Send automated reply', 
          configLabel: 'Response content', 
          configValue: newActionMessage 
        }
      ]
    };

    setWorkflows(prev => [newWf, ...prev]);
    setSelectedWorkflowId(newWf.id);
    setIsDrawerOpen(false);

    // Reset Form
    setNewWfName('');
    setNewTriggerType('comment');
    setNewTriggerValue('');
    setNewActionMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden font-sans">
      {/* Header bar */}
      <div className="bg-[#0F0F0F] border-b border-[rgba(255,255,255,0.08)] px-4 py-3 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2 font-sans">
            <Zap className="text-white" size={18} />
            Visual Automation Builder
          </h1>
          <p className="text-[11px] text-[#A0A0A0] mt-1 font-light">Define comment triggers, AI-powered responders, and qualification channels.</p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-white hover:opacity-88 active:scale-95 text-black font-semibold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-sm select-none"
        >
          <Plus size={14} /> New Workflow
        </button>
      </div>

      {/* Main visual panel splits */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Workflows list */}
        <div className="w-full md:w-96 bg-[#0F0F0F] md:border-r border-[rgba(255,255,255,0.08)] flex flex-col overflow-y-auto shrink-0 p-4 md:p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider mb-2 flex items-center gap-1.5 shrink-0 select-none">
            <Sliders size={13} className="text-white" /> Active Campaigns ({workflows.length})
          </h3>

          {workflows.map(wf => {
            const isSelected = wf.id === selectedWorkflowId;
            const convRate = wf.sentCount > 0 ? ((wf.conversionCount / wf.sentCount) * 100).toFixed(1) : '0';
            
            return (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflowId(wf.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#141414] border-white shadow-sm' 
                    : 'bg-[#141414]/30 border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]'
                }`}
              >
                <div className="flex justify-between items-start gap-3 mb-2.5">
                  <div className="flex items-center gap-2 select-none">
                    <div className="w-8 h-8 rounded-lg bg-black border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-white">
                      {wf.triggerType === 'comment' ? (
                        <MessageSquare size={14} />
                      ) : wf.triggerType === 'dm' ? (
                        <Sparkles size={14} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#606060] tracking-wider leading-none">
                        {wf.triggerType === 'comment' ? 'Post Comment' : wf.triggerType === 'dm' ? 'Direct DM' : 'Follower Trigger'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Switch */}
                    <button
                      onClick={(e: any) => {
                        e.stopPropagation();
                        toggleWorkflowActive(wf.id);
                      }}
                      className={`w-7 h-3.5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none ${
                        wf.isActive ? 'bg-white' : 'bg-black border border-[rgba(255,255,255,0.12)]'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full shadow-md transform transition-transform duration-150 ${
                        wf.isActive ? 'translate-x-3.5 bg-black' : 'translate-x-0 bg-[#606060]'
                      }`} />
                    </button>

                    <button
                      onClick={(e) => handleDeleteWorkflow(wf.id, e)}
                      className="text-[#606060] hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-white leading-relaxed line-clamp-2 mb-3">
                  {wf.name}
                </h4>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 bg-black/60 border border-[rgba(255,255,255,0.06)] rounded-xl p-2.5 text-center select-none">
                  <div>
                    <div className="text-[11px] font-bold text-white leading-none mb-1">{wf.sentCount}</div>
                    <div className="text-[9px] text-[#606060] font-light">DMs Sent</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white leading-none mb-1">{wf.conversionCount}</div>
                    <div className="text-[9px] text-[#606060] font-light">Leads</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white leading-none mb-1">{convRate}%</div>
                    <div className="text-[9px] text-[#606060] font-light">Conv Rate</div>
                  </div>
                </div>
              </div>
            );
          })}

          {workflows.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl text-[#606060] text-xs font-light">
              No active workflows yet. Click &lsquo;New Workflow&rsquo; to get started.
            </div>
          )}
        </div>

        {/* Right Side: Interactive Nodes Visual Canvas */}
        <div className="flex-1 bg-black relative overflow-hidden flex flex-col p-4 md:p-6">
          {selectedWorkflow ? (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Node canvas header info */}
              <div className="flex justify-between items-center bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-3 md:p-4 mb-4 md:mb-6 shrink-0 select-none">
                <div>
                  <span className="text-[9px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    Visual Workspace
                  </span>
                  <h2 className="text-xs font-bold text-white mt-2 leading-none">{selectedWorkflow.name}</h2>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-full text-[10px] font-bold flex items-center gap-1.5 text-white">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedWorkflow.isActive ? 'bg-[#22C55E]' : 'bg-[#EAB308]'}`} />
                    {selectedWorkflow.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Graphical Nodes Flow */}
              <div className="flex-1 overflow-y-auto overflow-x-auto flex flex-col items-center justify-start py-8 space-y-6 min-w-0">
                
                {selectedWorkflow.nodes.map((node, index) => {
                  const isTrigger = node.type === 'trigger';
                  const isCondition = node.type === 'condition';
                  
                  return (
                    <div key={node.id} className="flex flex-col items-center w-full shrink-0">
                      
                      {/* Connection arrow */}
                      {index > 0 && (
                        <div className="flex flex-col items-center mb-6 select-none">
                          <div className="w-0.5 h-8 bg-white" />
                          <ChevronDown size={14} className="text-white -mt-1.5" />
                        </div>
                      )}

                      {/* Node Card */}
                      <div className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 hover:border-white transition-all shadow-md">
                        <div className="flex items-center justify-between mb-3 border-b border-[rgba(255,255,255,0.06)] pb-2.5 select-none">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.06)] flex items-center justify-center font-bold text-xs text-white">
                              {isTrigger ? 'T' : isCondition ? 'C' : 'A'}
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-white">{node.title}</h4>
                              <p className="text-[10px] text-[#606060]">{node.description}</p>
                            </div>
                          </div>
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-[#141414] text-[#A0A0A0] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)]">
                            {node.type}
                          </span>
                        </div>

                        {/* Node settings summary */}
                        <div className="bg-black/60 rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[9px] uppercase font-bold text-[#606060] mb-1 select-none">{node.configLabel}</div>
                          <div className="text-xs text-white font-medium leading-relaxed italic">
                            "{node.configValue}"
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              <Zap size={40} className="text-[#404040] mb-4" />
              <h3 className="text-white font-semibold text-xs mb-1">No Workflow Selected</h3>
              <p className="text-[#606060] text-[11px] max-w-xs leading-relaxed font-light">
                Click any workflow campaign from the left side, or create a brand new automated trigger.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Slide-out Drawer: Create workflow form */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full sm:max-w-lg h-full bg-[#0F0F0F] border-l border-[rgba(255,255,255,0.08)] flex flex-col shadow-2xl p-4 md:p-6 overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 border-b border-[rgba(255,255,255,0.06)] pb-4 shrink-0">
              <div className="flex items-center gap-2 select-none">
                <Sparkles className="text-white" size={18} />
                <h2 className="text-base font-bold text-white">New Campaign Setup</h2>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#606060] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="flex-1 flex flex-col space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2 select-none">
                  Automation Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Comment-to-DM for Coupon code"
                  value={newWfName}
                  onChange={e => setNewWfName(e.target.value)}
                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2 select-none">
                  1. Trigger Type
                </label>
                <div className="grid grid-cols-3 gap-2.5 select-none">
                  {[
                    { type: 'comment', label: 'Comment', icon: MessageSquare, desc: 'Post comment' },
                    { type: 'dm', label: 'Direct DM', icon: Sparkles, desc: 'Inbox DM' },
                    { type: 'follow', label: 'Follow', icon: CheckCircle, desc: 'New Follower' }
                  ].map(opt => (
                    <div
                      key={opt.type}
                      onClick={() => {
                        setNewTriggerType(opt.type as any);
                        setNewTriggerValue('');
                      }}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        newTriggerType === opt.type 
                          ? 'bg-[#141414] border-white text-white' 
                          : 'bg-black border-[rgba(255,255,255,0.08)] text-[#606060] hover:border-[rgba(255,255,255,0.14)]'
                      }`}
                    >
                      <opt.icon size={16} className="mx-auto mb-1.5 text-white" />
                      <div className="text-xs font-bold text-white mb-0.5">{opt.label}</div>
                      <div className="text-[9px] text-[#606060] leading-none">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {newTriggerType !== 'follow' && (
                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2 select-none">
                    {newTriggerType === 'comment' ? 'Keyword Filter' : 'Incoming keyword filter (Optional)'}
                  </label>
                  <input
                    type="text"
                    required={newTriggerType === 'comment'}
                    placeholder={newTriggerType === 'comment' ? "e.g. price, coupon, info" : "e.g. hello, support (leave empty for all)"}
                    value={newTriggerValue}
                    onChange={e => setNewTriggerValue(e.target.value)}
                    className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                  />
                  <p className="text-[10px] text-[#606060] mt-2 leading-relaxed font-light select-none">
                    The automation triggers when a user uses this keyword in a comment or message.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2 select-none">
                  2. Response Action
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the DM response text..."
                  value={newActionMessage}
                  onChange={e => setNewActionMessage(e.target.value)}
                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] flex gap-3 mt-auto shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 bg-black border border-[rgba(255,255,255,0.08)] text-[#A0A0A0] hover:text-white font-semibold py-3 rounded-full text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white hover:opacity-88 active:scale-95 text-black font-semibold py-3 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle size={13} /> Save & Activate
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
