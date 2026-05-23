'use client';

import { Suspense, useState, useEffect, useRef, useMemo, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkflows } from '@/lib/hooks/useWorkflows';
import { WorkflowTemplatePicker } from '@/components/workflows/WorkflowTemplatePicker';
import { WORKFLOW_TEMPLATES } from '@/lib/workflow-templates';
import { 
  Zap, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Sparkles, 
  CheckCircle,
  Sliders,
  X,
  Play,
  RotateCcw,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  Settings,
  ShieldAlert,
  ArrowRight,
  Database,
  Loader2,
  HelpCircle,
  Activity
} from 'lucide-react';

interface NodePosition {
  x: number;
  y: number;
}

interface CanvasNode {
  id: string;
  type: 'trigger' | 'ai' | 'delay' | 'condition' | 'action' | 'crm';
  title: string;
  description: string;
  position: NodePosition;
  config: any;
}

interface CanvasEdge {
  id: string;
  from: string;
  to: string;
}

function WorkflowsPageContent() {
  const searchParams = useSearchParams();
  const { workflows, loading, error, create, updateWorkflow, toggle, remove } = useWorkflows();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  
  // Navigation & Drawer states
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState<boolean>(false);
  const [newWfName, setNewWfName] = useState<string>('');
  const [newTriggerType, setNewTriggerType] = useState<'comment' | 'dm' | 'follow'>('comment');
  const [newTriggerValue, setNewTriggerValue] = useState<string>('');
  const [newActionMessage, setNewActionMessage] = useState<string>('');

  // Canvas Viewport Panning & Zoom states
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 50, y: 80 });
  const [zoom, setZoom] = useState<number>(0.9);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panOffsetStart, setPanOffsetStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom visual builder nodes state
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [edges, setEdges] = useState<CanvasEdge[]>([]);

  // Dragging node state
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragStartMouse, setDragStartMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStartNodePos, setDragStartNodePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drag-to-connect edges state
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [tempEdgeLine, setTempEdgeLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Cinematic Simulation mode states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationActiveNodeId, setSimulationActiveNodeId] = useState<string | null>(null);
  const [simulatedCompletedNodeIds, setSimulatedCompletedNodeIds] = useState<string[]>([]);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(-1);
  const [simulationFlowEdgeId, setSimulationFlowEdgeId] = useState<string | null>(null);
  
  // Autosave UI status indicator
  const [autosaving, setAutosaving] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const simTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const templateHandled = useRef(false);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (!templateId || templateHandled.current || loading) return;
    const t = WORKFLOW_TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    templateHandled.current = true;
    create({
      name: t.name,
      triggerType: t.triggerType,
      triggerValue: t.triggerValue,
      actionMessage: t.actionMessage,
    }).then((wf) => {
      if (wf?.id) setSelectedWorkflowId(wf.id);
    });
  }, [searchParams, loading, create]);

  const applyTemplate = async (t: (typeof WORKFLOW_TEMPLATES)[number]) => {
    const wf = await create({
      name: t.name,
      triggerType: t.triggerType,
      triggerValue: t.triggerValue,
      actionMessage: t.actionMessage,
    });
    if (wf?.id) setSelectedWorkflowId(wf.id);
  };

  // Extract currently selected workflow campaign
  const selectedWorkflow = useMemo(() => {
    return workflows.find(w => w.id === selectedWorkflowId) || null;
  }, [workflows, selectedWorkflowId]);

  // Load selected workflow's custom nodes & edges from DB config
  useEffect(() => {
    if (selectedWorkflow) {
      const config = selectedWorkflow.config || {};
      const dbNodes = config.nodes || [];
      const dbEdges = config.edges || [];
      
      // Fallback if no nodes are saved (initialize defaults)
      if (dbNodes.length === 0) {
        const defaultNodes: CanvasNode[] = [
          {
            id: 'node-trigger',
            type: 'trigger',
            title: selectedWorkflow.triggerType === 'comment' ? 'Comment Trigger' : 'DM Keyword Trigger',
            description: 'Starts when trigger criteria are met',
            position: { x: 120, y: 150 },
            config: {
              triggerType: selectedWorkflow.triggerType,
              keywords: selectedWorkflow.triggerValue ? selectedWorkflow.triggerValue.split(',').map(s => s.trim()) : ['*'],
            }
          },
          {
            id: 'node-action',
            type: 'action',
            title: 'Send Outbound DM',
            description: 'Responds via direct message',
            position: { x: 480, y: 150 },
            config: {
              dmMessage: selectedWorkflow.actionMessage || 'Hello! Thanks for reaching out!',
            }
          }
        ];
        const defaultEdges: CanvasEdge[] = [
          { id: 'edge-1', from: 'node-trigger', to: 'node-action' }
        ];
        setNodes(defaultNodes);
        setEdges(defaultEdges);
      } else {
        setNodes(dbNodes);
        setEdges(dbEdges);
      }
    } else {
      setNodes([]);
      setEdges([]);
    }
    // Stop any active simulations on campaign swap
    stopSimulation();
  }, [selectedWorkflowId, selectedWorkflow]);

  // Select first campaign automatically
  useEffect(() => {
    if (workflows.length && !selectedWorkflowId) {
      setSelectedWorkflowId(workflows[0].id);
    }
  }, [workflows, selectedWorkflowId]);

  // DB Autosave handler
  const saveWorkflowCanvas = async (updatedNodes: CanvasNode[], updatedEdges: CanvasEdge[]) => {
    if (!selectedWorkflowId || !selectedWorkflow) return;
    setAutosaving(true);
    
    // Aggregate main fields to keep list-view in sync
    const triggerNode = updatedNodes.find(n => n.type === 'trigger');
    const actionNode = updatedNodes.find(n => n.type === 'action');
    
    const triggerType = triggerNode?.config?.triggerType || 'comment';
    const keywordsList = triggerNode?.config?.keywords || [];
    const triggerValue = keywordsList.join(', ');
    const actionMessage = actionNode?.config?.dmMessage || '';

    try {
      await updateWorkflow(selectedWorkflowId, {
        config: {
          ...selectedWorkflow.config,
          nodes: updatedNodes,
          edges: updatedEdges,
          keywords: keywordsList,
          dmMessage: actionMessage,
        }
      });
    } catch (err) {
      console.error('Autosave error:', err);
    } finally {
      setTimeout(() => setAutosaving(false), 600);
    }
  };

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.target === canvasRef.current || e.target === canvasRef.current?.firstElementChild) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setPanOffsetStart({ x: pan.x, y: pan.y });
      e.preventDefault();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan({
        x: panOffsetStart.x + dx,
        y: panOffsetStart.y + dy
      });
    } else if (dragNodeId) {
      const dx = (e.clientX - dragStartMouse.x) / zoom;
      const dy = (e.clientY - dragStartMouse.y) / zoom;
      setNodes(prev => prev.map(n => 
        n.id === dragNodeId 
          ? { ...n, position: { x: Math.round(dragStartNodePos.x + dx), y: Math.round(dragStartNodePos.y + dy) } } 
          : n
      ));
    } else if (connectingFromId && tempEdgeLine) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        // Convert screen mouse pos back to zoomed/panned canvas coordinate space
        const mx = (e.clientX - rect.left - pan.x) / zoom;
        const my = (e.clientY - rect.top - pan.y) / zoom;
        setTempEdgeLine(prev => prev ? { ...prev, x2: mx, y2: my } : null);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    } else if (dragNodeId) {
      setDragNodeId(null);
      saveWorkflowCanvas(nodes, edges);
    } else if (connectingFromId) {
      setConnectingFromId(null);
      setTempEdgeLine(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.05;
    const nextZoom = e.deltaY < 0 ? zoom + zoomFactor : zoom - zoomFactor;
    setZoom(Math.max(0.6, Math.min(1.4, nextZoom)));
  };

  // Zoom control panel
  const zoomIn = () => setZoom(prev => Math.min(1.4, prev + 0.1));
  const zoomOut = () => setZoom(prev => Math.max(0.6, prev - 0.1));
  const zoomReset = () => {
    setZoom(0.9);
    setPan({ x: 50, y: 80 });
  };

  // Port Connections Drag Logic
  const startConnectionDrag = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fromNode = nodes.find(n => n.id === nodeId);
    if (!fromNode) return;

    // Source socket is roughly at the right center edge of the node card
    const x1 = fromNode.position.x + 280;
    const y1 = fromNode.position.y + 60;
    
    setConnectingFromId(nodeId);
    setTempEdgeLine({ x1, y1, x2: x1, y2: y1 });
  };

  const completeConnectionDrag = (targetNodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!connectingFromId || connectingFromId === targetNodeId) return;

    // Establish connection if unique
    const edgeExists = edges.some(edge => edge.from === connectingFromId && edge.to === targetNodeId);
    if (!edgeExists) {
      const newEdge: CanvasEdge = {
        id: `edge-${Date.now()}`,
        from: connectingFromId,
        to: targetNodeId
      };
      const updatedEdges = [...edges, newEdge];
      setEdges(updatedEdges);
      saveWorkflowCanvas(nodes, updatedEdges);
    }
    
    setConnectingFromId(null);
    setTempEdgeLine(null);
  };

  // Drag Node logic
  const startNodeDrag = (nodeId: string, e: React.MouseEvent) => {
    if (isSimulating) return; // Prevent canvas dragging during simulation overlays
    e.stopPropagation();
    const targetNode = nodes.find(n => n.id === nodeId);
    if (!targetNode) return;

    setDragNodeId(nodeId);
    setDragStartMouse({ x: e.clientX, y: e.clientY });
    setDragStartNodePos({ x: targetNode.position.x, y: targetNode.position.y });
  };

  // Inject new Node from Palette
  const addNodeFromPalette = (type: CanvasNode['type']) => {
    if (!selectedWorkflowId) return;

    // Node template mappings
    const nodeTemplates: Record<CanvasNode['type'], Partial<CanvasNode>> = {
      trigger: {
        title: 'Keyword Trigger',
        description: 'Initiate when matching text is comments/DMs',
        config: { triggerType: 'comment', keywords: ['info'] }
      },
      ai: {
        title: 'Smart AI Response',
        description: 'Auto-evaluate LLM drafting replies',
        config: { customPrompt: 'Explain pricing and offer a discount', customTone: 'Casual' }
      },
      delay: {
        title: 'Delay Seconds',
        description: 'Wait seconds before pushing responders',
        config: { delaySeconds: 5 }
      },
      condition: {
        title: 'Lead Filter Condition',
        description: 'Check score thresholds before routing',
        config: { leadScoreThreshold: 50 }
      },
      action: {
        title: 'DM Text Action',
        description: 'Deliver response to Instagram inbox',
        config: { dmMessage: 'Hey! Click this link to get access.' }
      },
      crm: {
        title: 'CRM Lead scoring',
        description: 'Modify contact tags & lead scores',
        config: { appendTags: ['hot-lead'], incrementScore: 10 }
      }
    };

    const template = nodeTemplates[type];
    if (!template) return;

    // Place node at center relative offset of canvas
    const x = Math.round((-pan.x + 220) / zoom);
    const y = Math.round((-pan.y + 180) / zoom);

    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      type,
      title: template.title!,
      description: template.description!,
      position: { x, y },
      config: template.config
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    saveWorkflowCanvas(updatedNodes, edges);
  };

  // Edit individual Node properties inside inputs
  const updateNodeConfig = (nodeId: string, updatedConfig: any) => {
    const updatedNodes = nodes.map(node => 
      node.id === nodeId 
        ? { ...node, config: { ...node.config, ...updatedConfig } } 
        : node
    );
    setNodes(updatedNodes);
  };

  // Remove individual nodes + cut associated edges
  const deleteNode = (nodeId: string) => {
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedEdges = edges.filter(e => e.from !== nodeId && e.to !== nodeId);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    saveWorkflowCanvas(updatedNodes, updatedEdges);
  };

  // Clear connection paths
  const deleteEdge = (edgeId: string) => {
    const updatedEdges = edges.filter(e => e.id !== edgeId);
    setEdges(updatedEdges);
    saveWorkflowCanvas(nodes, updatedEdges);
  };

  // Setup Campaign slide drawer creator
  const handleCreateWorkflow = async (e: FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) return;

    try {
      const created = await create({
        name: newWfName,
        triggerType: newTriggerType,
        triggerValue: newTriggerValue,
        actionMessage: newActionMessage,
      });
      setSelectedWorkflowId(created.id);
      setIsNewDrawerOpen(false);
      setNewWfName('');
      setNewTriggerType('comment');
      setNewTriggerValue('');
      setNewActionMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  // Cinematic Execution Tracing Simulation
  const startSimulation = () => {
    if (nodes.length === 0) return;
    
    stopSimulation();
    setIsSimulating(true);
    setSimulatedCompletedNodeIds([]);
    
    // Find the starting Trigger Node
    const startNode = nodes.find(n => n.type === 'trigger') || nodes[0];
    setSimulationActiveNodeId(startNode.id);
    setSimulationStepIndex(0);

    // Queue chronological visualization jumps
    runSimulationStep(startNode.id, 0);
  };

  const runSimulationStep = (currentNodeId: string, currentStep: number) => {
    // 1. Set current node active
    setSimulationActiveNodeId(currentNodeId);

    // 2. Find next node connected
    const outgoingEdge = edges.find(edge => edge.from === currentNodeId);
    
    const timeouts = simTimeoutRef.current;
    
    // Dynamic simulated timeouts per Node type for premium realism
    const nodeObj = nodes.find(n => n.id === currentNodeId);
    let stepDuration = 2000;
    if (nodeObj?.type === 'delay') stepDuration = 2500;
    else if (nodeObj?.type === 'ai') stepDuration = 3200;

    // Once node evaluation finishes, trigger edge particle animation
    const completeTimer = setTimeout(() => {
      setSimulatedCompletedNodeIds(prev => [...prev, currentNodeId]);
      
      if (outgoingEdge) {
        setSimulationFlowEdgeId(outgoingEdge.id);
        
        // Edge particle completes traversing path in 1.8 seconds
        const edgeTimer = setTimeout(() => {
          setSimulationFlowEdgeId(null);
          runSimulationStep(outgoingEdge.to, currentStep + 1);
        }, 1800);
        
        timeouts.push(edgeTimer);
      } else {
        // End of automation path reached! Show complete, highlight all paths
        const finalTimer = setTimeout(() => {
          setIsSimulating(false);
          setSimulationActiveNodeId(null);
          setSimulatedCompletedNodeIds([]);
        }, 2200);
        timeouts.push(finalTimer);
      }
    }, stepDuration);

    timeouts.push(completeTimer);
  };

  const stopSimulation = () => {
    // Clear all queued simulation timers
    simTimeoutRef.current.forEach(clearTimeout);
    simTimeoutRef.current = [];
    
    setIsSimulating(false);
    setSimulationActiveNodeId(null);
    setSimulatedCompletedNodeIds([]);
    setSimulationFlowEdgeId(null);
  };

  // Generate smooth SVG Bezier paths between sockets
  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  // Pre-calculate path nodes positions
  const getPortCoordinates = (nodeId: string, portType: 'in' | 'out') => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    if (portType === 'out') {
      return { x: node.position.x + 280, y: node.position.y + 60 };
    } else {
      return { x: node.position.x, y: node.position.y + 60 };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0F] text-white overflow-hidden font-sans">
      
      {/* Header Visual Bar */}
      <div className="bg-[#0F0F0F] border-b border-[rgba(255,255,255,0.08)] px-5 py-4 flex items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="text-orange-500 fill-orange-500/25" size={16} />
            Visual Automation Infinite Canvas
          </h1>
          <p className="text-[10px] text-[#A0A0A0] mt-0.5 font-light">
            Build triggers, delays, and action chains. Simulates DMs, comments, and AI evaluation visually.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {autosaving && (
            <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full animate-pulse select-none">
              <Loader2 size={10} className="animate-spin text-orange-500" /> Auto-saving canvas...
            </span>
          )}
          <button
            onClick={() => setIsNewDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-xs font-bold shadow-md transform hover:-translate-y-0.5 transition-all"
          >
            <Plus size={13} />
            New Campaign
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side Navigation Panel */}
        <div className="hidden md:flex w-72 bg-[#0F0F0F] border-r border-[rgba(255,255,255,0.08)] flex-col overflow-hidden shrink-0 select-none">
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)] shrink-0">
            <h3 className="text-[10px] font-bold text-[#606060] uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={12} className="text-gray-400" /> Instagram Campaigns ({workflows.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {error && <p className="text-red-400 text-[10px] px-2">{error}</p>}
            {loading && <p className="text-[#606060] text-[10px] px-2">Loading active rule graphs...</p>}

            {!loading && workflows.length === 0 && (
              <div className="px-1 pb-3">
                <WorkflowTemplatePicker compact onSelect={applyTemplate} />
              </div>
            )}

            {workflows.map(wf => {
              const isSelected = wf.id === selectedWorkflowId;
              const convRate = wf.sentCount > 0 ? ((wf.conversionCount / wf.sentCount) * 100).toFixed(1) : '0';
              
              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWorkflowId(wf.id)}
                  className={`p-3.5 rounded-[18px] border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#141414] border-white shadow-md' 
                      : 'bg-black/20 border-[rgba(255,255,255,0.06)] hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#606060]">
                      {wf.triggerType === 'comment' ? 'Comment Auto' : wf.triggerType === 'dm' ? 'Direct DM' : 'Follow Hook'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {/* Active Status toggler */}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await toggle(wf.id);
                        }}
                        className={`w-6 h-3 rounded-full p-0.5 transition-colors duration-200 ${
                          wf.isActive ? 'bg-orange-500' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full bg-white transform transition-transform duration-200 ${
                          wf.isActive ? 'translate-x-3' : 'translate-x-0'
                        }`} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(wf.id);
                          if (selectedWorkflowId === wf.id) setSelectedWorkflowId(null);
                        }}
                        className="text-[#505050] hover:text-red-400 p-0.5 rounded transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1 truncate pr-2">{wf.name}</h4>
                  
                  {/* Local Metrics summary */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.04)] text-center text-[9px] text-[#A0A0A0] font-light">
                    <div>
                      <div className="font-bold text-white mb-0.5">{wf.sentCount}</div>
                      <div>Replies</div>
                    </div>
                    <div>
                      <div className="font-bold text-white mb-0.5">{wf.conversionCount}</div>
                      <div>Leads</div>
                    </div>
                    <div>
                      <div className="font-bold text-white mb-0.5">{convRate}%</div>
                      <div>Conv</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 flex flex-col bg-black overflow-hidden relative">
          {selectedWorkflow ? (
            <div className="flex-1 flex flex-col relative select-none">
              
              {/* Canvas Controls Overlay (Simulate, zoom) */}
              <div className="absolute top-4 left-4 right-4 flex justify-between gap-3 items-center z-30 pointer-events-none">
                
                {/* Save status badge */}
                <div className="bg-[#0F0F0F]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 text-xs font-semibold text-white pointer-events-auto flex items-center gap-1.5 shadow-xl select-none">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedWorkflow.isActive ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                  <span className="truncate max-w-[120px] font-bold text-[10px]">{selectedWorkflow.name}</span>
                </div>

                {/* Simulation & View Options */}
                <div className="flex items-center gap-2 pointer-events-auto">
                  
                  {isSimulating ? (
                    <button
                      onClick={stopSimulation}
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow-lg shadow-red-500/20 transform hover:-translate-y-0.5 active:scale-95 transition-all"
                    >
                      <Square size={10} className="fill-white" /> Stop Simulation
                    </button>
                  ) : (
                    <button
                      onClick={startSimulation}
                      disabled={nodes.length === 0}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
                    >
                      <Play size={10} className="fill-black" /> Run simulation
                    </button>
                  )}

                  {/* Zoom utilities toolbar */}
                  <div className="bg-[#0F0F0F]/90 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-xl flex items-center p-1 shadow-2xl">
                    <button
                      onClick={zoomOut}
                      className="text-[#808080] hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut size={12} />
                    </button>
                    <span className="text-[9px] text-[#A0A0A0] px-2 font-mono font-bold select-none leading-none">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={zoomIn}
                      className="text-[#808080] hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn size={12} />
                    </button>
                    <button
                      onClick={zoomReset}
                      className="text-[#808080] hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="Zoom Reset & Recenter"
                    >
                      <Maximize2 size={12} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Floating Left Drawer Node Palette */}
              <div className="absolute left-4 top-20 bottom-4 w-44 bg-[#0F0F0F]/85 backdrop-blur border border-[rgba(255,255,255,0.08)] rounded-[20px] shadow-2xl flex flex-col p-3.5 z-20 shrink-0 select-none">
                <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-[#505050] mb-3 flex items-center gap-1 select-none">
                  <Sliders size={10} /> Node Palette
                </h4>
                
                <p className="text-[8px] text-gray-500 font-light mb-4 select-none leading-relaxed">
                  Click a card in the palette to inject it into the active canvas grid.
                </p>

                <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5 no-scrollbar">
                  {[
                    { type: 'trigger', label: 'Trigger', color: 'border-orange-500/30 hover:border-orange-400 bg-orange-950/10 text-orange-200' },
                    { type: 'delay', label: 'Delay Time', color: 'border-blue-500/30 hover:border-blue-400 bg-blue-950/10 text-blue-200' },
                    { type: 'ai', label: 'AI Evaluation', color: 'border-purple-500/30 hover:border-purple-400 bg-purple-950/10 text-purple-200' },
                    { type: 'condition', label: 'Score Match', color: 'border-amber-500/30 hover:border-amber-400 bg-amber-950/10 text-amber-200' },
                    { type: 'action', label: 'Send Response', color: 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10 text-emerald-200' },
                    { type: 'crm', label: 'CRM Update', color: 'border-pink-500/30 hover:border-pink-400 bg-pink-950/10 text-pink-200' }
                  ].map(opt => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => addNodeFromPalette(opt.type as any)}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold text-left tracking-wide transition-all duration-150 transform hover:-translate-y-0.5 active:scale-95 ${opt.color}`}
                    >
                      + {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Actual Visual Viewport Canvas Grid Container */}
              <div
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onWheel={handleWheel}
                className={`flex-1 relative outline-none premium-dot-grid overflow-hidden ${
                  isPanning ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  backgroundPosition: `${pan.x}px ${pan.y}px`,
                  backgroundSize: `${36 * zoom}px ${36 * zoom}px`
                }}
              >
                {/* SVG connection lines overlay behind node cards */}
                <svg
                  className="absolute inset-0 pointer-events-none w-full h-full z-10"
                  style={{ transformOrigin: '0 0' }}
                >
                  <defs>
                    {/* Glowing gradient indicators */}
                    <linearGradient id="edge-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="edge-glow-sim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>

                  {/* Draw connection paths */}
                  {edges.map(edge => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    // Compute zoomed coordinates
                    const x1 = (fromNode.position.x + 280) * zoom + pan.x;
                    const y1 = (fromNode.position.y + 60) * zoom + pan.y;
                    const x2 = toNode.position.x * zoom + pan.x;
                    const y2 = (toNode.position.y + 60) * zoom + pan.y;

                    const path = getBezierPath(x1, y1, x2, y2);
                    const isFlowActive = simulationFlowEdgeId === edge.id;

                    return (
                      <g key={edge.id}>
                        {/* Interactive path trigger overlays for deletion */}
                        <path
                          d={path}
                          fill="none"
                          stroke={isFlowActive ? 'url(#edge-glow-sim)' : 'url(#edge-glow)'}
                          strokeWidth={isFlowActive ? 3.5 : 2}
                          className={`transition-all duration-300 ${isFlowActive ? 'filter drop-shadow-[0_0_8px_#a855f7]' : 'opacity-70'}`}
                        />
                        {/* Subtle edge deletor socket close button */}
                        <circle
                          cx={(x1 + x2) / 2}
                          cy={(y1 + y2) / 2}
                          r={6}
                          fill="#0F0F0F"
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth={1}
                          className="cursor-pointer pointer-events-auto hover:fill-red-950/20 hover:stroke-red-500/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEdge(edge.id);
                          }}
                        />

                        {/* Animated Motion Trace Particles (Signature Experience simulation) */}
                        {isFlowActive && (
                          <circle r={5} fill="#a855f7" className="filter drop-shadow-[0_0_12px_#a855f7]">
                            <animateMotion dur="1.8s" repeatCount="indefinite" path={path} />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  {/* Temporary connection path on port dragging */}
                  {connectingFromId && tempEdgeLine && (
                    <path
                      d={getBezierPath(
                        tempEdgeLine.x1 * zoom + pan.x,
                        tempEdgeLine.y1 * zoom + pan.y,
                        tempEdgeLine.x2 * zoom + pan.x,
                        tempEdgeLine.y2 * zoom + pan.y
                      )}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      className="opacity-70"
                    />
                  )}
                </svg>

                {/* Absolutely positioned canvas nodes wrapper */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ transformOrigin: '0 0' }}
                >
                  {nodes.map(node => {
                    const isSimActive = simulationActiveNodeId === node.id;
                    const isSimComplete = simulatedCompletedNodeIds.includes(node.id);

                    return (
                      <div
                        key={node.id}
                        onMouseUp={handleCanvasMouseUp}
                        className={`absolute w-[280px] bg-[#0F0F0F]/85 backdrop-blur-xl border rounded-[22px] p-4 pointer-events-auto select-none transition-all duration-300 z-10 ${
                          isSimActive
                            ? 'border-purple-500 shadow-[0_0_24px_rgba(139,92,246,0.3)] scale-[1.03] z-20 animate-ai-glow'
                            : isSimComplete
                              ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                              : 'border-[rgba(255,255,255,0.08)] hover:border-white/30 hover:shadow-lg'
                        }`}
                        style={{
                          left: node.position.x * zoom + pan.x,
                          top: node.position.y * zoom + pan.y,
                          transform: `scale(${zoom})`,
                          transformOrigin: 'top left',
                        }}
                      >
                        {/* Input Connection Socket Port Circle */}
                        {node.type !== 'trigger' && (
                          <div
                            onMouseUp={(e) => completeConnectionDrag(node.id, e)}
                            className="absolute left-[-6px] top-[54px] w-3 h-3 rounded-full bg-[#0F0F0F] border-2 border-[#8b5cf6] hover:bg-[#8b5cf6] hover:scale-125 transition-all cursor-crosshair z-30"
                            title="Connect link to this node input"
                          />
                        )}

                        {/* Output Connection Socket Port Circle */}
                        <div
                          onMouseDown={(e) => startConnectionDrag(node.id, e)}
                          className="absolute right-[-6px] top-[54px] w-3 h-3 rounded-full bg-[#0F0F0F] border-2 border-orange-500 hover:bg-orange-500 hover:scale-125 transition-all cursor-crosshair z-30"
                          title="Drag connection line from output"
                        />

                        {/* Node Card Drag Header */}
                        <div
                          onMouseDown={(e) => startNodeDrag(node.id, e)}
                          className="flex items-center justify-between mb-3 border-b border-[rgba(255,255,255,0.06)] pb-2.5 cursor-grab active:cursor-grabbing select-none"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-black border border-[rgba(255,255,255,0.08)] flex items-center justify-center font-bold text-xs select-none">
                              {node.type === 'trigger' ? (
                                <Zap size={12} className="text-orange-400" />
                              ) : node.type === 'ai' ? (
                                <Sparkles size={12} className="text-purple-400" />
                              ) : node.type === 'delay' ? (
                                <Clock size={12} className="text-blue-400" />
                              ) : node.type === 'crm' ? (
                                <Database size={12} className="text-pink-400" />
                              ) : (
                                <MessageSquare size={12} className="text-emerald-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-[11px] font-bold text-white">{node.title}</h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Visual success/eval feedback badge during cinematic runs */}
                            {isSimActive && (
                              <span className="text-[7px] font-bold tracking-wider text-purple-400 bg-purple-950/40 border border-purple-500/30 px-1.5 py-0.5 rounded uppercase animate-pulse select-none">
                                Running
                              </span>
                            )}
                            {isSimComplete && (
                              <span className="text-[7px] font-bold tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase select-none">
                                Success
                              </span>
                            )}
                            
                            <button
                              type="button"
                              onClick={() => deleteNode(node.id)}
                              className="text-gray-500 hover:text-white p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Interactive fields editor */}
                        <div className="space-y-3">
                          
                          {/* Trigger details form */}
                          {node.type === 'trigger' && (
                            <div className="space-y-2">
                              <div>
                                <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                  Evaluation Target
                                </label>
                                <select
                                  value={node.config?.triggerType || 'comment'}
                                  onChange={(e) => {
                                    updateNodeConfig(node.id, { triggerType: e.target.value });
                                    saveWorkflowCanvas(nodes, edges);
                                  }}
                                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-1.5 text-[10px] text-white focus:outline-none"
                                >
                                  <option value="comment">Instagram Comment Keyword</option>
                                  <option value="dm">Instagram Direct Message</option>
                                  <option value="follow">Instagram Follower</option>
                                </select>
                              </div>
                              {node.config?.triggerType !== 'follow' && (
                                <div>
                                  <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                    Keyword Filters
                                  </label>
                                  <input
                                    type="text"
                                    value={(node.config?.keywords || []).join(', ')}
                                    onChange={(e) => {
                                      const keywords = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                      updateNodeConfig(node.id, { keywords });
                                    }}
                                    onBlur={() => saveWorkflowCanvas(nodes, edges)}
                                    placeholder="e.g. coupon, price, access"
                                    className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-1.5 text-[10px] text-white placeholder-[#505050] focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* AI Evaluations prompt */}
                          {node.type === 'ai' && (
                            <div className="space-y-2">
                              <div>
                                <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                  System instructions prompt
                                </label>
                                <textarea
                                  rows={2}
                                  value={node.config?.customPrompt || ''}
                                  onChange={(e) => updateNodeConfig(node.id, { customPrompt: e.target.value })}
                                  onBlur={() => saveWorkflowCanvas(nodes, edges)}
                                  placeholder="Guide the AI reply logic..."
                                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-2 text-[10px] text-white focus:outline-none resize-none"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div>
                                  <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                    Tone type
                                  </label>
                                  <select
                                    value={node.config?.customTone || 'Friendly'}
                                    onChange={(e) => {
                                      updateNodeConfig(node.id, { customTone: e.target.value });
                                      saveWorkflowCanvas(nodes, edges);
                                    }}
                                    className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-1 text-[9px] text-white focus:outline-none"
                                  >
                                    <option value="Friendly">Friendly</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Urgent">Urgent / Sales</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Delay details */}
                          {node.type === 'delay' && (
                            <div>
                              <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                Delay Interval Duration (seconds)
                              </label>
                              <input
                                type="number"
                                value={node.config?.delaySeconds || 5}
                                onChange={(e) => updateNodeConfig(node.id, { delaySeconds: Number(e.target.value) })}
                                onBlur={() => saveWorkflowCanvas(nodes, edges)}
                                className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-1.5 text-[10px] text-white focus:outline-none"
                              />
                            </div>
                          )}

                          {/* Condition Branch details */}
                          {node.type === 'condition' && (
                            <div>
                              <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                Minimum Lead Score Threshold
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={node.config?.leadScoreThreshold || 50}
                                  onChange={(e) => updateNodeConfig(node.id, { leadScoreThreshold: Number(e.target.value) })}
                                  onMouseUp={() => saveWorkflowCanvas(nodes, edges)}
                                  className="flex-1 h-1 bg-black rounded-full accent-orange-500"
                                />
                                <span className="text-[9px] font-bold text-gray-300 font-mono">
                                  {node.config?.leadScoreThreshold || 50}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Action DM Message content */}
                          {node.type === 'action' && (
                            <div>
                              <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                Responder message (Direct Message)
                              </label>
                              <textarea
                                rows={2}
                                value={node.config?.dmMessage || ''}
                                onChange={(e) => updateNodeConfig(node.id, { dmMessage: e.target.value })}
                                onBlur={() => saveWorkflowCanvas(nodes, edges)}
                                placeholder="DM content payload..."
                                className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-2 text-[10px] text-white focus:outline-none resize-none leading-relaxed"
                              />
                            </div>
                          )}

                          {/* CRM Actions details */}
                          {node.type === 'crm' && (
                            <div className="space-y-2">
                              <div>
                                <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                  Append Contact Tags
                                </label>
                                <input
                                  type="text"
                                  value={(node.config?.appendTags || []).join(', ')}
                                  onChange={(e) => {
                                    const tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                    updateNodeConfig(node.id, { appendTags: tags });
                                  }}
                                  onBlur={() => saveWorkflowCanvas(nodes, edges)}
                                  placeholder="e.g. vip, hot-lead"
                                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-1.5 text-[10px] text-white placeholder-[#555] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                                  Adjust Lead Score
                                </label>
                                <input
                                  type="number"
                                  value={node.config?.incrementScore || 10}
                                  onChange={(e) => updateNodeConfig(node.id, { incrementScore: Number(e.target.value) })}
                                  onBlur={() => saveWorkflowCanvas(nodes, edges)}
                                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-1.5 text-[10px] text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none max-w-md mx-auto">
              <Zap size={36} className="text-[#303030] mb-4" />
              <h3 className="text-white font-semibold text-xs mb-1">No Active Campaigns</h3>
              <p className="text-[#606060] text-[11px] max-w-xs leading-relaxed font-light mb-6">
                Pick a template from the sidebar or create a new campaign to unlock the visual canvas.
              </p>
              <WorkflowTemplatePicker compact onSelect={applyTemplate} />
            </div>
          )}
        </div>

      </div>

      {/* Campaign creator Slide drawer */}
      {isNewDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-end">
          <div className="w-full sm:max-w-md h-full bg-[#0F0F0F] border-l border-[rgba(255,255,255,0.08)] flex flex-col shadow-2xl p-6 overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 border-b border-[rgba(255,255,255,0.06)] pb-4 shrink-0 select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="text-orange-500 animate-pulse" size={16} />
                <h2 className="text-sm font-bold text-white uppercase tracking-tight">Configure New Campaign</h2>
              </div>
              <button 
                onClick={() => setIsNewDrawerOpen(false)}
                className="text-[#606060] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="flex-1 flex flex-col space-y-5">
              
              <div>
                <label className="block text-[10px] font-extrabold text-[#606060] uppercase tracking-wider mb-2 select-none">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram Story Coupon Code flow"
                  value={newWfName}
                  onChange={e => setNewWfName(e.target.value)}
                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#606060] uppercase tracking-wider mb-2 select-none">
                  Trigger Event Type
                </label>
                <div className="grid grid-cols-3 gap-2 select-none">
                  {[
                    { type: 'comment', label: 'Comment', icon: MessageSquare, desc: 'Keyword post' },
                    { type: 'dm', label: 'DM', icon: Sparkles, desc: 'Keyword DM' },
                    { type: 'follow', label: 'Follow', icon: CheckCircle, desc: 'New follower' }
                  ].map(opt => (
                    <div
                      key={opt.type}
                      onClick={() => {
                        setNewTriggerType(opt.type as any);
                        setNewTriggerValue('');
                      }}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        newTriggerType === opt.type 
                          ? 'bg-[#141414] border-white text-white shadow-md' 
                          : 'bg-black border-[rgba(255,255,255,0.06)] text-[#606060] hover:border-[rgba(255,255,255,0.12)]'
                      }`}
                    >
                      <opt.icon size={14} className="mx-auto mb-1.5 text-white" />
                      <div className="text-[10px] font-bold text-white mb-0.5">{opt.label}</div>
                      <div className="text-[8px] text-[#606060] leading-none">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {newTriggerType !== 'follow' && (
                <div>
                  <label className="block text-[10px] font-extrabold text-[#606060] uppercase tracking-wider mb-2 select-none">
                    Trigger Keywords
                  </label>
                  <input
                    type="text"
                    required={newTriggerType === 'comment'}
                    placeholder={newTriggerType === 'comment' ? "e.g. price, promo, code" : "e.g. hello, help (leave blank for all)"}
                    value={newTriggerValue}
                    onChange={e => setNewTriggerValue(e.target.value)}
                    className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                  />
                  <p className="text-[9px] text-[#606060] mt-1.5 leading-relaxed font-light select-none">
                    Seperate words with commas. The workflow triggers when matching keyword comment/DM is received.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-extrabold text-[#606060] uppercase tracking-wider mb-2 select-none">
                  Response message (Direct message responder)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter content to respond in user's direct messages..."
                  value={newActionMessage}
                  onChange={e => setNewActionMessage(e.target.value)}
                  className="w-full bg-black border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] flex gap-3 mt-auto shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setIsNewDrawerOpen(false)}
                  className="flex-1 bg-black border border-[rgba(255,255,255,0.08)] text-[#A0A0A0] hover:text-white font-bold py-3 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white hover:bg-gray-100 active:scale-95 text-black font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-md"
                >
                  <CheckCircle size={13} /> Save Campaign
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-[#606060] text-xs">
          Loading workflows...
        </div>
      }
    >
      <WorkflowsPageContent />
    </Suspense>
  );
}
