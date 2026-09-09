import { useEffect, useMemo, useState } from 'react';
import { api } from './lib/api';
import { demoHabitations, demoPriorities, demoSites, demoZones } from './lib/demoData';
import { MapView } from './components/MapView';
import type { Habitation, Priority, Site, Zone } from './types';
import './styles.css';

function App() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [habitations, setHabitations] = useState<Habitation[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [live, setLive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.zones(), api.habitations(), api.sites(), api.priorities()])
      .then(([z, h, s, p]) => { setZones(z); setHabitations(h); setSites(s); setPriorities(p); setLive(true); })
      .catch(() => { setZones(demoZones); setHabitations(demoHabitations); setSites(demoSites); setPriorities(demoPriorities); setLive(false); })
      .finally(() => setLoading(false));
  }, []);

  const filteredPriorities = useMemo(() => filter === 'all' ? priorities : priorities.filter(p => p.risk_level === filter), [filter, priorities]);
  const selected = habitations.find(h => h.habitation_id === selectedId);
  const selectedPriority = priorities.find(p => p.habitation_id === selectedId);
  const totalPopulation = habitations.reduce((a, h) => a + h.population, 0);
  const highRisk = habitations.filter(h => priorities.find(p => p.habitation_id === h.habitation_id)?.risk_level === 'high').length;
  const avgCapacity = sites.length ? sites.reduce((a, s) => a + s.capacity_score, 0) / sites.length : 0;

  const selectFirst = () => { if (priorities[0]) setSelectedId(priorities[0].habitation_id); };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">S</div><div><strong>SafeShift</strong><span>Chamoli Relocation Intelligence</span></div></div>
      <div className="top-actions"><span className="region-pill">● Chamoli, Uttarakhand</span><span className={`status ${live ? 'online' : 'demo'}`}><i />{live ? 'Live API' : 'Demo data'}</span></div>
    </header>

    <main className="content">
      <section className="hero">
        <div><p className="eyebrow">PRE-DISASTER DECISION SUPPORT</p><h1>Know where to move <em>before</em> the risk moves.</h1><p className="hero-copy">A GIS-led planning workspace for identifying multi-hazard exposure, evaluating safer relocation sites, and prioritising vulnerable habitations across Chamoli.</p></div>
        <button className="primary" onClick={selectFirst}>View top priority <span>→</span></button>
      </section>

      <section className="stats-grid">
        <Stat label="High-risk habitations" value={highRisk} meta="priority exposure" tone="red" />
        <Stat label="People represented" value={totalPopulation.toLocaleString()} meta="across mapped habitations" tone="blue" />
        <Stat label="Relocation candidates" value={sites.length} meta="sites scored" tone="teal" />
        <Stat label="Avg. site capacity" value={`${(avgCapacity * 100).toFixed(0)}%`} meta="weighted suitability" tone="amber" />
      </section>

      <section className="workspace">
        <div className="map-card">
          <div className="card-head"><div><p className="eyebrow">SPATIAL OVERVIEW</p><h2>Chamoli risk & relocation map</h2></div><div className="legend"><span><i className="dot red"/> High</span><span><i className="dot amber"/> Medium</span><span><i className="dot teal"/> Safe site</span></div></div>
          {loading ? <div className="loading">Loading spatial layers…</div> : <MapView zones={zones} habitations={habitations} sites={sites} selectedId={selectedId} onSelect={setSelectedId} />}
        </div>

        <aside className="side-panel">
          <div className="panel-head"><div><p className="eyebrow">DECISION QUEUE</p><h2>Relocation priorities</h2></div><span className="count">{filteredPriorities.length}</span></div>
          <div className="filters">{(['all','high','medium','low'] as const).map(x => <button className={filter === x ? 'active' : ''} key={x} onClick={() => setFilter(x)}>{x === 'all' ? 'All' : x}</button>)}</div>
          <div className="priority-list">{filteredPriorities.map((p, i) => <button className={`priority-item ${selectedId === p.habitation_id ? 'selected' : ''}`} key={p.habitation_id} onClick={() => setSelectedId(p.habitation_id)}><span className="rank">{String(i + 1).padStart(2, '0')}</span><span className="priority-main"><strong>{p.name}</strong><small>{p.population.toLocaleString()} people · {p.risk_level} risk</small></span><span className={`urgency ${p.urgency}`}>{p.urgency.replace('-', ' ')}</span></button>)}</div>
        </aside>
      </section>

      {selected && <section className="detail-card">
        <div className="detail-title"><p className="eyebrow">SELECTED HABITATION</p><h2>{selected.name}</h2><span>{selected.habitation_id}</span></div>
        <div className="detail-score"><small>Priority score</small><strong>{selectedPriority ? (selectedPriority.priority_score * 100).toFixed(0) : '—'}</strong><span>/ 100</span></div>
        <div className="detail-metrics"><Metric label="Population" value={selected.population.toLocaleString()} /><Metric label="Risk" value={selectedPriority?.risk_level ?? 'Unknown'} /><Metric label="Urgency" value={selectedPriority?.urgency?.replace('-', ' ') ?? 'Unclassified'} /><Metric label="Current zone" value={selected.current_zone_id ?? 'Not mapped'} /></div>
        <div className="explanation">{selectedPriority?.explanation?.note ? <p>{selectedPriority.explanation.note}</p> : <><strong>Why this priority?</strong><p>Risk contributes <b>{((selectedPriority?.explanation?.risk_contribution ?? 0) * 100).toFixed(0)}%</b> and population exposure contributes <b>{((selectedPriority?.explanation?.population_contribution ?? 0) * 100).toFixed(0)}%</b> to the prototype priority score.</p></>}</div>
      </section>}
    </main>
    <footer>SafeShift · SIH 26191 · Decision support for proactive relocation planning</footer>
  </div>;
}

function Stat({ label, value, meta, tone }: { label: string; value: string | number; meta: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`} /> <div><span>{label}</span><strong>{value}</strong><small>{meta}</small></div></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

export default App;
