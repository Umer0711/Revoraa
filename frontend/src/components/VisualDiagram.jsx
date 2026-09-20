import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import './VisualDiagram.css';

/**
 * VisualDiagram Component
 * Native, responsive, algorithmically authentic visualizations for DSA patterns.
 * Supports: SHORTEST_PATH, GRAPH, TREE, BST, HEAP, DP_TABLE, DECISION_TREE,
 * TERNARY_SEARCH, BINARY_SEARCH, POINTERS, SLIDING_WINDOW, LINKED_LIST,
 * STACK, QUEUE, MATRIX, INTERVALS, BIT_MANIPULATION, COORDINATE_COMPRESSION,
 * DIFFERENCE_ARRAY, UNION_FIND, KMP, TRIE, ARRAY.
 */
export function VisualDiagram({ data, lang = 'en' }) {
  if (!data) return null;

  const { type, category, title, input, steps = [], description, description_hi, result } = data;
  const [activeStep, setActiveStep] = useState(0);

  const hasSteps = steps && steps.length > 0;
  const currentStep = hasSteps ? steps[activeStep] : null;

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Step explanation based on language
  const stepText = lang === 'hi' 
    ? (currentStep?.explanation_hi || currentStep?.explanation || description_hi || description)
    : (currentStep?.explanation || description);

  // Badge category title
  const badgeLabel = category || type.replace(/_/g, ' ');

  // Renderer router based on diagram type
  const renderVisualContent = () => {
    const currentState = currentStep || data;

    switch (type) {
      case 'SHORTEST_PATH':
        return renderShortestPath(input, currentState, lang);
      case 'GRAPH':
        return renderGraph(input, currentState, lang);
      case 'TREE':
      case 'BST':
        return renderTree(input, currentState, lang);
      case 'HEAP':
        return renderHeap(input, currentState, lang);
      case 'DECISION_TREE':
      case 'BACKTRACKING':
        return renderDecisionTree(input, currentState, lang);
      case 'DP_TABLE':
        return renderDPTable(input, currentState, lang);
      case 'TERNARY_SEARCH':
        return renderTernarySearch(input, currentState);
      case 'COORDINATE_COMPRESSION':
        return renderCoordinateCompression(input, currentState);
      case 'DIFFERENCE_ARRAY':
        return renderDifferenceArray(input, currentState);
      case 'UNION_FIND':
        return renderUnionFind(input, currentState);
      case 'KMP':
        return renderKMP(input, currentState);
      case 'TRIE':
        return renderTrie(input, currentState);
      case 'POINTERS':
        return renderPointers(input, currentState);
      case 'SLIDING_WINDOW':
        return renderSlidingWindow(input, currentState);
      case 'LINKED_LIST':
        return renderLinkedList(input, currentState);
      case 'STACK':
        return renderStack(input, currentState);
      case 'QUEUE':
        return renderQueue(input, currentState);
      case 'MATRIX':
        return renderMatrix(input, currentState);
      case 'BINARY_SEARCH':
        return renderBinarySearch(input, currentState);
      case 'INTERVALS':
        return renderIntervals(input, currentState);
      case 'BIT_MANIPULATION':
        return renderBits(input, currentState);
      case 'ARRAY':
      default:
        return renderArray(input, currentState);
    }
  };

  return (
    <div className="visual-diagram-container bento-card">
      <div className="visual-diagram-header">
        <span className="visual-badge">{badgeLabel}</span>
        <span className="visual-title">{title || 'Pattern Visualization'}</span>
      </div>

      <div className="visual-viewport">
        {renderVisualContent()}
      </div>

      {(description || stepText) && (
        <div className="visual-step-desc">
          <strong>Step {hasSteps ? activeStep + 1 : 1}: </strong>
          {stepText}
        </div>
      )}

      {result !== undefined && (
        <div className="visual-result-tag">
          <span>Result:</span> <code>{typeof result === 'object' ? JSON.stringify(result) : String(result)}</code>
        </div>
      )}

      {hasSteps && steps.length > 1 && (
        <div className="visual-controls">
          <button 
            className="visual-btn" 
            onClick={handlePrev} 
            disabled={activeStep === 0}
            title="Previous Step"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          
          <span className="visual-step-indicator">
            {activeStep + 1} / {steps.length}
          </span>

          <button 
            className="visual-btn" 
            onClick={handleNext} 
            disabled={activeStep === steps.length - 1}
            title="Next Step"
          >
            Next <ChevronRight size={16} />
          </button>

          <button 
            className="visual-btn visual-btn-reset" 
            onClick={handleReset} 
            title="Reset Diagram"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SUB-RENDERERS
// -------------------------------------------------------------

/**
 * 1. Shortest Path (Dijkstra / Weighted Graph)
 */
function renderShortestPath(input, state, lang) {
  const nodes = state?.nodes || [
    { id: 'A', x: 60, y: 50, label: 'A' },
    { id: 'B', x: 280, y: 50, label: 'B' },
    { id: 'C', x: 60, y: 170, label: 'C' },
    { id: 'D', x: 280, y: 170, label: 'D' }
  ];

  const edges = state?.edges || [
    { u: 'A', v: 'B', w: 4, lx: 170, ly: 38 },
    { u: 'A', v: 'C', w: 2, lx: 45, ly: 110 },
    { u: 'B', v: 'D', w: 3, lx: 295, ly: 110 },
    { u: 'C', v: 'D', w: 1, lx: 170, ly: 185 }
  ];

  const activeNode = state?.activeNode || 'A';
  const visitedNodes = state?.visited || ['A'];
  const pathEdges = state?.pathEdges || []; // e.g. [['A','C'], ['C','D']]
  const distances = state?.distances || { A: 0, B: 4, C: 2, D: 3 };
  const shortestPathStr = state?.shortestPath || 'A → C → D';
  const totalCost = state?.totalCost ?? 3;

  const isEdgeInPath = (u, v) => {
    return pathEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));
  };

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  return (
    <div className="diagram-shortest-path-wrapper">
      <svg className="graph-svg-canvas" viewBox="0 0 340 215">
        <defs>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.7" />
          </filter>
          <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((e, idx) => {
          const uNode = nodeMap[e.u];
          const vNode = nodeMap[e.v];
          if (!uNode || !vNode) return null;
          const inPath = isEdgeInPath(e.u, e.v);

          return (
            <g key={idx} className="graph-edge-group">
              <line
                x1={uNode.x}
                y1={uNode.y}
                x2={vNode.x}
                y2={vNode.y}
                className={`graph-edge-line ${inPath ? 'path-active' : ''}`}
                filter={inPath ? 'url(#glow-green)' : undefined}
              />
              <circle cx={e.lx} cy={e.ly} r={10} className="edge-weight-bg" />
              <text x={e.lx} y={e.ly + 3.5} className={`edge-weight-txt ${inPath ? 'path-active' : ''}`}>
                {e.w}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const isActive = n.id === activeNode;
          const isVisited = visitedNodes.includes(n.id);
          const isSource = n.id === (state?.source || 'A');
          const isTarget = n.id === (state?.target || 'D');

          return (
            <g key={n.id} className="graph-node-group">
              <circle
                cx={n.x}
                cy={n.y}
                r={18}
                className={`graph-node-circle ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''} ${isTarget ? 'target' : ''}`}
                filter={isActive ? 'url(#glow-gold)' : isVisited ? 'url(#glow-green)' : undefined}
              />
              <text x={n.x} y={n.y + 4.5} className="graph-node-text">
                {n.label}
              </text>
              {isSource && (
                <text x={n.x} y={n.y - 23} className="graph-role-badge source-lbl">
                  SRC
                </text>
              )}
              {isTarget && (
                <text x={n.x} y={n.y - 23} className="graph-role-badge target-lbl">
                  DST
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Distance Status Table */}
      <div className="sp-dist-table">
        <span className="sp-dist-title">{lang === 'hi' ? 'Distance Table:' : 'Distance Table:'}</span>
        <div className="sp-dist-chips">
          {Object.entries(distances).map(([nodeId, d]) => (
            <div key={nodeId} className={`sp-dist-chip ${visitedNodes.includes(nodeId) ? 'visited' : ''}`}>
              <span className="chip-node">{nodeId}</span>
              <span className="chip-val">{d === Infinity ? '∞' : d}</span>
            </div>
          ))}
        </div>
      </div>

      {shortestPathStr && (
        <div className="sp-final-banner">
          <span className="sp-banner-lbl">{lang === 'hi' ? 'Shortest Path:' : 'Shortest Path:'}</span>
          <span className="sp-banner-path">{shortestPathStr}</span>
          <span className="sp-banner-cost">Cost: {totalCost}</span>
        </div>
      )}
    </div>
  );
}

/**
 * 2. General Graph (BFS, DFS, Topological Sort, Bipartite)
 */
function renderGraph(input, state, lang) {
  const nodes = state?.nodes || input?.nodes || ['A', 'B', 'C', 'D', 'E'];
  const edges = state?.edges || input?.edges || [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E']];
  const activeNode = state?.activeNode;
  const visited = state?.visited || [];
  const queue = state?.queue;
  const stack = state?.stack;
  const order = state?.order;

  // Compute symmetrical circular positions
  const n = nodes.length;
  const cx = 170, cy = 95, r = 68;
  const coords = {};
  nodes.forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    coords[node] = {
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle))
    };
  });

  return (
    <div className="diagram-graph-wrapper">
      <svg className="graph-svg-canvas" viewBox="0 0 340 190">
        {/* Edges */}
        {edges.map(([u, v], idx) => {
          const p1 = coords[u];
          const p2 = coords[v];
          if (!p1 || !p2) return null;
          const isTraversed = visited.includes(u) && visited.includes(v);

          return (
            <line
              key={idx}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              className={`graph-edge-line ${isTraversed ? 'path-active' : ''}`}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const pos = coords[node];
          if (!pos) return null;
          const isActive = activeNode === node;
          const isVisited = visited.includes(node);

          return (
            <g key={node} className="graph-node-group">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={16}
                className={`graph-node-circle ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
              />
              <text x={pos.x} y={pos.y + 4} className="graph-node-text">
                {node}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Auxiliary structure representations */}
      {queue && (
        <div className="graph-meta-row">
          <span className="meta-lbl">{lang === 'hi' ? 'BFS Queue (Front → Rear):' : 'BFS Queue (Front → Rear):'}</span>
          <div className="meta-items">
            {queue.length === 0 ? <span className="meta-empty">Empty</span> : queue.map((q, i) => (
              <span key={i} className="meta-pill">{q}</span>
            ))}
          </div>
        </div>
      )}

      {stack && (
        <div className="graph-meta-row">
          <span className="meta-lbl">{lang === 'hi' ? 'DFS Call Stack:' : 'DFS Call Stack:'}</span>
          <div className="meta-items">
            {stack.map((s, i) => (
              <span key={i} className="meta-pill stack-pill">{s}</span>
            ))}
          </div>
        </div>
      )}

      {order && (
        <div className="graph-meta-row">
          <span className="meta-lbl">{lang === 'hi' ? 'Traversal Order:' : 'Traversal Order:'}</span>
          <span className="meta-seq">{order.join(' → ')}</span>
        </div>
      )}
    </div>
  );
}

/**
 * 3. Tree & BST (Hierarchical Vector Tree)
 */
function renderTree(input, state, lang) {
  const treeNodes = state?.nodes || [
    { id: 1, val: 10, x: 170, y: 32, p: null },
    { id: 2, val: 5, x: 95, y: 88, p: 1 },
    { id: 3, val: 15, x: 245, y: 88, p: 1 },
    { id: 4, val: 2, x: 55, y: 148, p: 2 },
    { id: 5, val: 7, x: 135, y: 148, p: 2 },
    { id: 6, val: 12, x: 210, y: 148, p: 3 },
    { id: 7, val: 20, x: 285, y: 148, p: 3 }
  ];

  const nodeMap = {};
  treeNodes.forEach(n => { nodeMap[n.id] = n; });

  const activeNodeVal = state?.activeNode;
  const visited = state?.visited || [];
  const traversalOrder = state?.order;

  return (
    <div className="diagram-tree-vector-wrapper">
      <svg className="tree-svg-canvas" viewBox="0 0 340 185">
        {/* Branch Lines */}
        {treeNodes.map(n => {
          if (!n.p) return null;
          const parent = nodeMap[n.p];
          if (!parent) return null;
          return (
            <line
              key={`edge-${n.id}`}
              x1={parent.x}
              y1={parent.y}
              x2={n.x}
              y2={n.y}
              className="tree-branch-line"
            />
          );
        })}

        {/* Tree Nodes */}
        {treeNodes.map(n => {
          const isActive = activeNodeVal === n.val;
          const isVisited = visited.includes(n.val);

          return (
            <g key={n.id} className="tree-node-group">
              <circle
                cx={n.x}
                cy={n.y}
                r={15}
                className={`tree-node-circle ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
              />
              <text x={n.x} y={n.y + 4} className="tree-node-text">
                {n.val}
              </text>
            </g>
          );
        })}
      </svg>

      {traversalOrder && (
        <div className="tree-traversal-banner">
          <span className="tree-traversal-lbl">{lang === 'hi' ? 'Visited Sequence:' : 'Visited Sequence:'}</span>
          <span className="tree-traversal-seq">{traversalOrder.join(' → ')}</span>
        </div>
      )}
    </div>
  );
}

/**
 * 4. Heap / Priority Queue (Binary Heap Tree + Array)
 */
function renderHeap(input, state, lang) {
  const heapArray = state?.heapArray || [1, 3, 6, 5, 9, 8];
  const activeIdx = state?.activeIdx ?? 0;
  const heapType = state?.heapType || 'Min-Heap (Root is Min)';

  // Tree nodes for heap array (indices 0..5)
  const heapTreeNodes = [
    { idx: 0, x: 170, y: 30, p: null },
    { idx: 1, x: 100, y: 82, p: 0 },
    { idx: 2, x: 240, y: 82, p: 0 },
    { idx: 3, x: 65, y: 135, p: 1 },
    { idx: 4, x: 135, y: 135, p: 1 },
    { idx: 5, x: 215, y: 135, p: 2 }
  ];

  const nodeMap = {};
  heapTreeNodes.forEach(n => { nodeMap[n.idx] = n; });

  return (
    <div className="diagram-heap-wrapper">
      <div className="heap-type-badge">{heapType}</div>

      <svg className="tree-svg-canvas" viewBox="0 0 340 165">
        {/* Branches */}
        {heapTreeNodes.map(n => {
          if (n.idx >= heapArray.length || n.p === null) return null;
          const parent = nodeMap[n.p];
          if (!parent || parent.idx >= heapArray.length) return null;
          return (
            <line
              key={`hedge-${n.idx}`}
              x1={parent.x}
              y1={parent.y}
              x2={n.x}
              y2={n.y}
              className="tree-branch-line"
            />
          );
        })}

        {/* Heap Tree Nodes */}
        {heapTreeNodes.map(n => {
          if (n.idx >= heapArray.length) return null;
          const isActive = activeIdx === n.idx;
          return (
            <g key={n.idx} className="tree-node-group">
              <circle
                cx={n.x}
                cy={n.y}
                r={15}
                className={`tree-node-circle ${isActive ? 'active' : 'heap-node'}`}
              />
              <text x={n.x} y={n.y + 4} className="tree-node-text">
                {heapArray[n.idx]}
              </text>
              <text x={n.x} y={n.y - 18} className="heap-idx-tag">
                i={n.idx}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Heap Array Representation */}
      <div className="heap-array-section">
        <span className="heap-array-lbl">{lang === 'hi' ? 'Array Representation:' : 'Array Representation:'}</span>
        <div className="diagram-array-row">
          {heapArray.map((val, idx) => (
            <div key={idx} className={`array-cell ${idx === activeIdx ? 'active' : ''}`}>
              <span className="cell-index">{idx}</span>
              <span className="cell-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 5. Dynamic Programming (1D and 2D DP Tables)
 */
function renderDPTable(input, state, lang) {
  const is2D = state?.is2D || Array.isArray(state?.grid) || Array.isArray(input?.grid);

  if (is2D) {
    const grid = state?.grid || input?.grid || [
      [0, 0, 0, 0],
      [0, 1, 1, 1],
      [0, 1, 2, 2],
      [0, 1, 2, 3]
    ];
    const rowLabels = state?.rowLabels || ['0', 'Item 1', 'Item 2', 'Item 3'];
    const colLabels = state?.colLabels || ['W=0', 'W=1', 'W=2', 'W=3'];
    const activeCell = state?.activeCell; // [r, c]

    return (
      <div className="diagram-dp2d-wrapper">
        <div className="dp2d-table-container">
          <table className="dp2d-table">
            <thead>
              <tr>
                <th className="dp2d-corner-hdr">i \ j</th>
                {colLabels.map((lbl, c) => (
                  <th key={c} className="dp2d-col-hdr">{lbl}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, r) => (
                <tr key={r}>
                  <th className="dp2d-row-hdr">{rowLabels[r] || r}</th>
                  {row.map((val, c) => {
                    const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;
                    return (
                      <td key={c} className={`dp2d-cell ${isActive ? 'active' : ''}`}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {activeCell && (
          <div className="dp-formula-pill">
            Computing <code>dp[{activeCell[0]}][{activeCell[1]}] = {grid[activeCell[0]]?.[activeCell[1]]}</code>
          </div>
        )}
      </div>
    );
  }

  // 1D DP Table
  const dp = state?.dp || input || [0, 1, 1, 2, 3, 5, 8];
  const activeIdx = state?.activeIdx;

  return (
    <div className="diagram-dp-row">
      {dp.map((val, idx) => {
        const isActive = activeIdx === idx;
        return (
          <div key={idx} className={`dp-cell ${isActive ? 'active' : ''}`}>
            <span className="dp-idx">dp[{idx}]</span>
            <span className="dp-val">{val}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 6. Decision Tree & Backtracking
 */
function renderDecisionTree(input, state, lang) {
  const choices = state?.choices || [
    { path: '[]', valid: true, depth: 0, x: 170, y: 30 },
    { path: '[1]', valid: true, depth: 1, x: 90, y: 85, from: '[]' },
    { path: '[2]', valid: true, depth: 1, x: 250, y: 85, from: '[]' },
    { path: '[1, 2] ✓', valid: true, depth: 2, x: 60, y: 145, from: '[1]' },
    { path: '[1, 1] ✗', valid: false, depth: 2, x: 120, y: 145, from: '[1]' },
    { path: '[2, 1] ✓', valid: true, depth: 2, x: 220, y: 145, from: '[2]' },
    { path: '[2, 2] ✗', valid: false, depth: 2, x: 280, y: 145, from: '[2]' }
  ];

  return (
    <div className="diagram-decision-tree-wrapper">
      <svg className="tree-svg-canvas" viewBox="0 0 340 180">
        {/* Branches */}
        {choices.filter(c => c.from).map((c, i) => {
          const parent = choices.find(p => p.path === c.from);
          if (!parent) return null;
          return (
            <line
              key={i}
              x1={parent.x}
              y1={parent.y}
              x2={c.x}
              y2={c.y}
              className={`tree-branch-line ${c.valid ? '' : 'pruned-branch'}`}
            />
          );
        })}

        {/* Choice Pills */}
        {choices.map((c, i) => (
          <g key={i} className="decision-node">
            <rect
              x={c.x - 28}
              y={c.y - 12}
              width={56}
              height={24}
              rx={6}
              className={`decision-box ${c.valid ? 'valid-choice' : 'pruned-choice'}`}
            />
            <text x={c.x} y={c.y + 4} className="decision-text">
              {c.path}
            </text>
          </g>
        ))}
      </svg>
      <div className="decision-legend">
        <span className="legend-item"><span className="dot dot-green" /> {lang === 'hi' ? 'Valid Branch' : 'Valid Branch'}</span>
        <span className="legend-item"><span className="dot dot-red" /> {lang === 'hi' ? 'Pruned (Backtrack)' : 'Pruned (Backtrack)'}</span>
      </div>
    </div>
  );
}

/**
 * 7. Ternary Search
 */
function renderTernarySearch(input, state) {
  const elements = state?.elements || [1, 3, 5, 7, 9, 11, 13, 15, 17];
  const left = state?.left ?? 0;
  const right = state?.right ?? elements.length - 1;
  const m1 = state?.m1 ?? 2;
  const m2 = state?.m2 ?? 5;
  const target = state?.target ?? 13;
  const discarded = state?.discarded || [];

  return (
    <div className="diagram-ternary-wrapper">
      <div className="target-indicator">Target: {target}</div>
      <div className="diagram-array-row">
        {elements.map((val, idx) => {
          const isL = idx === left;
          const isR = idx === right;
          const isM1 = idx === m1;
          const isM2 = idx === m2;
          const isDiscarded = discarded.includes(idx);

          return (
            <div
              key={idx}
              className={`array-cell ${isDiscarded ? 'ts-discarded' : ''} ${isM1 ? 'ts-m1' : ''} ${isM2 ? 'ts-m2' : ''}`}
            >
              <span className="cell-index">{idx}</span>
              <span className="cell-value">{val}</span>
              <div className="pointer-labels">
                {isL && <span className="lbl-l">L</span>}
                {isM1 && <span className="lbl-m1">M1</span>}
                {isM2 && <span className="lbl-m2">M2</span>}
                {isR && <span className="lbl-r">R</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="ts-division-info">
        <span>Part 1: [L..M1]</span>
        <span>Part 2: [M1+1..M2-1]</span>
        <span>Part 3: [M2..R]</span>
      </div>
    </div>
  );
}

/**
 * 8. Coordinate Compression
 */
function renderCoordinateCompression(input, state) {
  const original = state?.original || [100, 500, 1000, 5000];
  const mapping = state?.mapping || { 100: 0, 500: 1, 1000: 2, 5000: 3 };
  const compressed = state?.compressed || [0, 1, 2, 3];

  return (
    <div className="diagram-coord-wrapper">
      <div className="coord-section">
        <span className="coord-label">Original Values:</span>
        <div className="diagram-array-row">
          {original.map((val, idx) => (
            <div key={idx} className="array-cell">
              <span className="cell-index">idx {idx}</span>
              <span className="cell-value large-val">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="coord-arrow">↓ Sorted Unique Ranks ↓</div>

      <div className="coord-section">
        <span className="coord-label">Compressed Indices:</span>
        <div className="diagram-array-row">
          {compressed.map((val, idx) => (
            <div key={idx} className="array-cell active">
              <span className="cell-index">rank</span>
              <span className="cell-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 9. Difference Array
 */
function renderDifferenceArray(input, state) {
  const diff = state?.diff || [0, 3, 0, 0, -3];
  const reconstructed = state?.reconstructed || [0, 3, 3, 3, 0];

  return (
    <div className="diagram-diff-wrapper">
      <div className="diff-section">
        <span className="coord-label">Difference Array (diff):</span>
        <div className="diagram-array-row">
          {diff.map((val, idx) => (
            <div key={idx} className={`array-cell ${val !== 0 ? 'highlight' : ''}`}>
              <span className="cell-index">{idx}</span>
              <span className="cell-value">{val > 0 ? `+${val}` : val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="coord-arrow">↓ Prefix Sum Reconstruction ↓</div>

      <div className="diff-section">
        <div className="diagram-array-row">
          {reconstructed.map((val, idx) => (
            <div key={idx} className="array-cell active">
              <span className="cell-index">{idx}</span>
              <span className="cell-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 10. Union Find / Disjoint Set
 */
function renderUnionFind(input, state) {
  const parent = state?.parent || [0, 0, 2, 2, 2];
  return (
    <div className="diagram-uf-wrapper">
      <span className="uf-label">Disjoint Set Parent Array:</span>
      <div className="diagram-array-row">
        {parent.map((p, idx) => (
          <div key={idx} className={`array-cell ${p === idx ? 'uf-root' : 'uf-child'}`}>
            <span className="cell-index">node {idx}</span>
            <span className="cell-value">root {p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 11. KMP String Matching
 */
function renderKMP(input, state) {
  const text = state?.text || 'ABABDABACDABAE';
  const pattern = state?.pattern || 'ABABC';
  const lps = state?.lps || [0, 0, 1, 2, 0];

  return (
    <div className="diagram-kmp-wrapper">
      <div className="kmp-row">
        <span className="kmp-lbl">Text:</span>
        <span className="kmp-str">{text}</span>
      </div>
      <div className="kmp-row">
        <span className="kmp-lbl">Pattern:</span>
        <span className="kmp-str pat">{pattern}</span>
      </div>
      <div className="kmp-row">
        <span className="kmp-lbl">LPS Table:</span>
        <div className="diagram-array-row">
          {lps.map((val, idx) => (
            <div key={idx} className="array-cell highlight">
              <span className="cell-index">{pattern[idx]}</span>
              <span className="cell-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 12. Trie Prefix Tree
 */
function renderTrie(input, state) {
  return (
    <div className="diagram-trie-wrapper">
      <span className="trie-title">Trie Prefix Tree:</span>
      <div className="trie-tree">
        <div className="trie-root">ROOT</div>
        <div className="trie-branches">
          <div className="trie-branch">
            <span className="trie-node">c</span>
            <span className="trie-arrow">→</span>
            <span className="trie-node">a</span>
            <span className="trie-arrow">→</span>
            <div className="trie-leaves">
              <span className="trie-leaf">t ✓</span>
              <span className="trie-leaf">r ✓</span>
            </div>
          </div>
          <div className="trie-branch">
            <span className="trie-node">d</span>
            <span className="trie-arrow">→</span>
            <span className="trie-node">o</span>
            <span className="trie-arrow">→</span>
            <span className="trie-leaf">g ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 13. Two Pointers
 */
function renderPointers(input, state) {
  const elements = state?.elements || input || [1, 2, 4, 7, 9];
  const left = state?.left ?? 0;
  const right = state?.right ?? elements.length - 1;
  const target = state?.target;

  return (
    <div className="diagram-pointers-wrapper">
      {target !== undefined && <div className="target-indicator">Target Sum: {target}</div>}
      <div className="diagram-array-row">
        {elements.map((val, idx) => {
          const isLeft = idx === left;
          const isRight = idx === right;
          return (
            <div key={idx} className={`array-cell ${isLeft ? 'pointer-left' : ''} ${isRight ? 'pointer-right' : ''}`}>
              <span className="cell-index">{idx}</span>
              <span className="cell-value">{val}</span>
              <div className="pointer-labels">
                {isLeft && <span className="lbl-l">L</span>}
                {isRight && <span className="lbl-r">R</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 14. Sliding Window
 */
function renderSlidingWindow(input, state) {
  const elements = state?.elements || input || [2, 1, 5, 1, 3, 2];
  const winStart = state?.winStart ?? 0;
  const winEnd = state?.winEnd ?? 2;
  const sum = state?.windowSum;

  return (
    <div className="diagram-window-wrapper">
      {sum !== undefined && <div className="target-indicator">Window Sum: {sum}</div>}
      <div className="diagram-array-row">
        {elements.map((val, idx) => {
          const inWindow = idx >= winStart && idx <= winEnd;
          const isStart = idx === winStart;
          const isEnd = idx === winEnd;
          return (
            <div key={idx} className={`array-cell ${inWindow ? 'in-window' : ''} ${isStart ? 'win-start' : ''} ${isEnd ? 'win-end' : ''}`}>
              <span className="cell-index">{idx}</span>
              <span className="cell-value">{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 15. Linked List
 */
function renderLinkedList(input, state) {
  const nodes = state?.nodes || input || [10, 20, 30, 40];
  const activeNode = state?.activeNode;
  const slowNode = state?.slowNode;
  const fastNode = state?.fastNode;
  const hasCycle = state?.hasCycle;
  const nullEnd = state?.nullEnd !== false && !hasCycle;

  return (
    <div className="diagram-ll-wrapper">
      <div className="diagram-ll-row">
        {nodes.map((val, idx) => {
          const isActive = activeNode === idx;
          const isSlow = slowNode === idx;
          const isFast = fastNode === idx;

          return (
            <React.Fragment key={idx}>
              <div className="ll-node-container">
                {(isSlow || isFast) && (
                  <div className="ll-pointer-tags">
                    {isSlow && <span className="ll-tag slow-tag">Slow</span>}
                    {isFast && <span className="ll-tag fast-tag">Fast</span>}
                  </div>
                )}
                <div className={`ll-node ${isActive ? 'active' : ''}`}>
                  <span className="ll-val">{val}</span>
                </div>
              </div>
              {idx < nodes.length - 1 && <span className="ll-arrow">→</span>}
            </React.Fragment>
          );
        })}
        {nullEnd && (
          <>
            <span className="ll-arrow">→</span>
            <div className="ll-null">null</div>
          </>
        )}
      </div>

      {hasCycle && (
        <div className="ll-cycle-note">
          <span>↺ Cycle Detected: Node {nodes[nodes.length - 1]} points back to Node {nodes[1]}</span>
        </div>
      )}
    </div>
  );
}

/**
 * 16. Stack
 */
function renderStack(input, state) {
  const stackItems = state?.items || input || [10, 20, 30];
  return (
    <div className="diagram-stack-col">
      <div className="stack-label">TOP</div>
      <div className="stack-container">
        {stackItems.slice().reverse().map((item, idx) => (
          <div key={idx} className={`stack-item ${idx === 0 ? 'top-item' : ''}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 17. Queue
 */
function renderQueue(input, state) {
  const queueItems = state?.items || input || [10, 20, 30, 40];
  return (
    <div className="diagram-queue-wrapper">
      <span className="queue-badge">FRONT</span>
      <div className="diagram-array-row queue-row">
        {queueItems.map((val, idx) => (
          <div key={idx} className={`array-cell ${idx === 0 ? 'front-item' : ''}`}>
            <span className="cell-value">{val}</span>
          </div>
        ))}
      </div>
      <span className="queue-badge">REAR</span>
    </div>
  );
}

/**
 * 18. Matrix (2D Grid)
 */
function renderMatrix(input, state) {
  const grid = state?.grid || input || [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const activeCell = state?.activeCell;

  return (
    <div className="diagram-matrix-grid">
      {grid.map((row, r) => (
        <div key={r} className="matrix-row">
          {row.map((val, c) => {
            const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;
            return (
              <div key={c} className={`matrix-cell ${isActive ? 'active' : ''}`}>
                {val}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * 19. Binary Search
 */
function renderBinarySearch(input, state) {
  const elements = state?.elements || input || [1, 3, 5, 7, 9, 11, 13];
  const mid = state?.mid ?? 3;
  const low = state?.low ?? 0;
  const high = state?.high ?? elements.length - 1;

  return (
    <div className="diagram-bs-wrapper">
      <div className="diagram-array-row">
        {elements.map((val, idx) => {
          const isMid = idx === mid;
          const isRange = idx >= low && idx <= high;
          return (
            <div key={idx} className={`array-cell ${isMid ? 'bs-mid' : ''} ${isRange ? 'in-range' : 'out-range'}`}>
              <span className="cell-index">{idx}</span>
              <span className="cell-value">{val}</span>
              {isMid && <div className="bs-label">MID</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 20. Intervals
 */
function renderIntervals(input, state) {
  const intervals = state?.intervals || input || [[1, 3], [2, 6], [8, 10]];
  const merged = state?.merged;

  return (
    <div className="diagram-intervals-wrapper">
      <div className="intervals-list">
        {intervals.map(([start, end], idx) => (
          <div key={idx} className="interval-bar">
            <span className="int-val">[{start}, {end}]</span>
          </div>
        ))}
      </div>
      {merged && (
        <div className="merged-result">
          <span>Merged: </span>
          <code>{JSON.stringify(merged)}</code>
        </div>
      )}
    </div>
  );
}

/**
 * 21. Bit Manipulation
 */
function renderBits(input, state) {
  const bits = state?.bits || input || '0101';
  const op = state?.op;
  const res = state?.res;

  return (
    <div className="diagram-bits-wrapper">
      <div className="bit-row">
        <span className="bit-label">Bits:</span>
        <code className="bit-code">{bits}</code>
      </div>
      {op && <div className="bit-op">Operation: {op}</div>}
      {res && (
        <div className="bit-row">
          <span className="bit-label">Result:</span>
          <code className="bit-code res">{res}</code>
        </div>
      )}
    </div>
  );
}

/**
 * 22. Linear Array (Only used for authentic linear array patterns)
 */
function renderArray(input, state) {
  const elements = state?.elements || input || [2, 5, 8, 11];
  const highlighted = state?.highlighted || [];
  const activeIdx = state?.activeIdx;

  return (
    <div className="diagram-array-row">
      {elements.map((val, idx) => {
        const isHL = highlighted.includes(idx);
        const isActive = activeIdx === idx;
        return (
          <div key={idx} className={`array-cell ${isHL ? 'highlight' : ''} ${isActive ? 'active' : ''}`}>
            <span className="cell-index">{idx}</span>
            <span className="cell-value">{val}</span>
          </div>
        );
      })}
    </div>
  );
}
