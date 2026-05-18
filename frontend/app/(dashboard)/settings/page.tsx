'use client';

import { useState } from 'react';
import { 
  Settings, 
  Instagram, 
  Sparkles, 
  Key, 
  CreditCard, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Facebook,
  ChevronDown
} from 'lucide-react';

export default function SettingsPage() {
  // IG Integration States
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [igAccount] = useState({
    name: 'Rahul Sharma Vlogs',
    username: 'rahul.vlogs.official',
    followers: '12.4K',
  });

  // AI Configuration States
  const [apiKey, setApiKey] = useState<string>('sk-proj-••••••••••••••••••••3aB8');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [aiTone, setAiTone] = useState<string>('friendly');
  const [customPrompt, setCustomPrompt] = useState<string>(
    'Aap ek helpful Indian content creator assistant hain. Tone polite, helpful aur encouraging honi chahiye. Products ke prices aur courses details share karein jab user puche.'
  );

  // Modal Flow for Connecting Account
  const [isConnectingModal, setIsConnectingModal] = useState<boolean>(false);
  const [connectionStep, setConnectionStep] = useState<number>(1);

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleConnectSimulate = () => {
    setIsConnectingModal(true);
    setConnectionStep(1);
  };

  const handleCompleteConnection = () => {
    setConnectionStep(3);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnectingModal(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden font-sans">
      {/* Header bar */}
      <div className="bg-[#0F0F0F] border-b border-[rgba(255,255,255,0.08)] px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2 font-sans">
            <Settings className="text-white" size={18} />
            System Control Settings
          </h1>
          <p className="text-[11px] text-[#A0A0A0] mt-1 font-light">Manage social tokens, configure OpenAI API keys, and tweak AI personalities.</p>
        </div>
      </div>

      {/* Main Form workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
        
        {/* SECTION 1: Instagram Channel connection */}
        <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <Instagram className="text-white" size={18} />
                Instagram & Meta Channel Integration
              </h2>
              <p className="text-[11px] text-[#A0A0A0] mt-1 font-light">Apne Instagram Business account ko AutoFlow platform se connect karein.</p>
            </div>
            {isConnected && (
              <span className="text-[9px] uppercase tracking-wider bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 select-none">
                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" /> Connected
              </span>
            )}
          </div>

          {isConnected ? (
            <div className="bg-black border border-[rgba(255,255,255,0.08)] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 select-none">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-white text-base">
                    R
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white leading-none mb-1.5">{igAccount.name}</h3>
                  <p className="text-[10px] text-[#606060]">@{igAccount.username} • {igAccount.followers} Followers</p>
                  <span className="inline-block mt-2.5 text-[9px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white px-2 py-0.5 rounded font-bold select-none uppercase tracking-wide">
                    Comment & DM Sync Active
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDisconnect}
                  className="flex-1 sm:flex-none bg-black hover:bg-red-500/5 border border-[rgba(255,255,255,0.08)] hover:border-red-500/10 text-red-400 text-xs px-4 py-2.5 rounded-full font-bold transition-all duration-150 active:scale-95"
                >
                  Disconnect Channel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-black border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl p-8 text-center">
              <Instagram size={32} className="text-[#404040] mx-auto mb-3" />
              <h3 className="text-white font-semibold text-xs mb-1.5 select-none">Instagram Account Connected Nahi Hai</h3>
              <p className="text-[#606060] text-[11px] max-w-sm mx-auto mb-6 leading-relaxed font-light">
                Apne page aur comments ka automatic responses enable karne ke liye Instagram Business and Meta connection setup shuru karein.
              </p>
              <button
                onClick={handleConnectSimulate}
                className="bg-white hover:opacity-88 active:scale-95 text-black font-semibold text-xs px-5 py-3 rounded-full inline-flex items-center gap-1.5 transition-all shadow-sm select-none"
              >
                <Instagram size={13} /> Connect Instagram Account
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: AI Prompt Setup & Personality tuning */}
        <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1 font-sans">
            <Sparkles className="text-white" size={18} />
            AI Personality & Prompt Customization
          </h2>
          <p className="text-[11px] text-[#A0A0A0] mb-6 font-light">Apne AI Agent ke behavioral characteristics aur instruction directives control karein.</p>

          <div className="space-y-5">
            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2 select-none">
                1. AI Agent Tone (Baat karne ka tarika)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 select-none">
                {[
                  { value: 'friendly', label: 'Friendly / Supportive', emoji: '😊' },
                  { value: 'professional', label: 'Professional / Direct', emoji: '💼' },
                  { value: 'humorous', label: 'Casual / Humorous', emoji: '🤪' },
                  { value: 'persuasive', label: 'Sales / Persuasive', emoji: '🔥' }
                ].map(tone => (
                  <div
                    key={tone.value}
                    onClick={() => setAiTone(tone.value)}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-150 ${
                      aiTone === tone.value 
                        ? 'bg-[#141414] border-white text-white font-bold' 
                        : 'bg-black border-[rgba(255,255,255,0.08)] text-[#606060] hover:border-[rgba(255,255,255,0.14)]'
                    }`}
                  >
                    <div className="text-base mb-1">{tone.emoji}</div>
                    <div className="text-xs">{tone.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Instruction Prompt */}
            <div>
              <div className="flex justify-between items-center mb-2 select-none">
                <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  2. AI System Prompt Instructions
                </label>
                <span className="text-[9px] text-[#606060] font-medium tracking-wide uppercase">Supports Hindi / Hinglish</span>
              </div>
              <textarea
                rows={4}
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="AI behavior directives yahan write karein..."
                className="w-full bg-black border border-[rgba(255,255,255,0.08)] focus:border-white rounded-xl p-4 text-xs focus:outline-none transition-colors resize-none leading-relaxed text-white placeholder-[#606060]"
              />
              <p className="text-[10px] text-[#606060] mt-1.5 leading-relaxed font-light select-none">
                Yahi prompt background prompts ke saath combine ho kar chat me response send karega.
              </p>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2 select-none">
                3. Custom OpenAI API Key (Optional)
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] focus:border-white rounded-xl pl-10 pr-12 py-3 text-xs focus:outline-none transition-colors text-white placeholder-[#606060]"
                />
                <Key className="absolute left-3.5 top-3.5 text-[#606060]" size={14} />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3.5 top-3 text-[#606060] hover:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-[#606060] mt-1.5 leading-relaxed font-light select-none">
                Aap apna proprietary API key configure kar sakte hain standard usage credit limits upgrade karne ke liye.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Account billing status & limits */}
        <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1 font-sans">
            <CreditCard className="text-white" size={18} />
            Subscription & Active Usage
          </h2>
          <p className="text-[11px] text-[#A0A0A0] mb-6 font-light">Aapke active membership package plan aur consumption metrics.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-black border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
              <div className="text-[9px] uppercase font-bold text-[#606060] mb-1 select-none">Active Plan</div>
              <div className="text-sm font-bold text-white font-sans uppercase tracking-wide mt-1.5">Creator Free Tier</div>
              <p className="text-[9px] text-[#606060] mt-1 font-light select-none">Renews automatically next month</p>
            </div>

            <div className="bg-black border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
              <div className="text-[9px] uppercase font-bold text-[#606060] mb-1 select-none">DM Usage Meter</div>
              <div className="text-sm font-bold text-white font-sans mt-1.5">245 / 500 DMs</div>
              <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden mt-2 select-none">
                <div className="bg-white h-full rounded-full" style={{ width: '49%' }} />
              </div>
            </div>

            <div className="bg-black border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
              <div className="text-[9px] uppercase font-bold text-[#606060] mb-1 select-none">Active Workflows</div>
              <div className="text-sm font-bold text-white font-sans mt-1.5">2 / 3 Active</div>
              <p className="text-[9px] text-[#606060] mt-1 font-light select-none">1 remaining node campaign</p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button className="bg-white hover:opacity-88 active:scale-95 text-black font-semibold text-xs px-5 py-3 rounded-full transition-all shadow-sm select-none">
              Upgrade to Premium Pro Plan
            </button>
          </div>
        </div>

      </div>

      {/* Simulated Facebook/Meta Integration Modal Flow */}
      {isConnectingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl p-6 overflow-hidden">
            
            {connectionStep === 1 && (
              <div className="text-center py-4">
                <Facebook size={36} className="text-blue-500 mx-auto mb-4" />
                <h3 className="text-white font-bold text-base mb-2">Connect via Meta OAuth</h3>
                <p className="text-[#606060] text-xs leading-relaxed max-w-sm mx-auto mb-6 font-light">
                  AutoFlow ko aapke comments read karne aur DMs send karne ke liye page level permission access chahiye.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setConnectionStep(2)}
                    className="bg-white text-black text-xs font-semibold py-3 rounded-full hover:opacity-88 transition-opacity w-full"
                  >
                    Continue as Rahul Sharma
                  </button>
                  <button
                    onClick={() => setIsConnectingModal(false)}
                    className="bg-black hover:bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[#A0A0A0] text-xs font-semibold py-3 rounded-full transition-colors w-full"
                  >
                    Cancel Connection
                  </button>
                </div>
              </div>
            )}

            {connectionStep === 2 && (
              <div>
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2 select-none">
                  <Instagram size={16} className="text-white" />
                  Select Business Profile
                </h3>
                <p className="text-[#A0A0A0] text-xs mb-5 leading-relaxed font-light select-none">
                  Apne connect karne laayak Instagram Page ko tick kijiye:
                </p>

                <div className="space-y-2.5 mb-6">
                  {[
                    { id: 'p1', name: 'Rahul Sharma Vlogs', handle: '@rahul.vlogs.official', followers: '12.4K' },
                    { id: 'p2', name: 'Rahul Creations Studio', handle: '@creations_rahul', followers: '2.1K' }
                  ].map(p => (
                    <div
                      key={p.id}
                      onClick={handleCompleteConnection}
                      className="bg-black hover:bg-[#141414] border border-[rgba(255,255,255,0.08)] hover:border-white rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-full flex items-center justify-center font-bold text-white text-xs select-none">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white leading-none mb-1">{p.name}</div>
                          <div className="text-[10px] text-[#606060]">{p.handle} • {p.followers} followers</div>
                        </div>
                      </div>
                      <ChevronDown size={14} className="text-[#606060] -rotate-90" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {connectionStep === 3 && (
              <div className="text-center py-6">
                <RefreshCw size={32} className="text-white animate-spin mx-auto mb-4" />
                <h3 className="text-white font-bold text-xs mb-2 uppercase tracking-wide select-none">Syncing Page Assets...</h3>
                <p className="text-[#606060] text-xs max-w-xs mx-auto font-light">
                  Meta webhooks set kiye ja rahe hain. 2 seconds wait kijiye.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
