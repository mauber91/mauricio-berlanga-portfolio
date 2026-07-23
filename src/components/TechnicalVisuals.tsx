type ProjectVisualProps = {
  type: 'retrieval' | 'forecast' | 'routing' | 'orchestration'
}

export function HeroSystemMap() {
  return (
    <div className="system-map" aria-label="Abstract intelligent systems diagram" role="img">
      <span className="map-label label-input">input</span>
      <span className="map-label label-reason">reason</span>
      <span className="map-label label-retrieve">retrieve</span>
      <span className="map-label label-evaluate">evaluate</span>
      <i className="map-line line-a" /><i className="map-line line-b" /><i className="map-line line-c" />
      <i className="map-line line-d" /><i className="map-line line-e" />
      <span className="map-node node-a" /><span className="map-node node-b" />
      <span className="map-node node-c active" /><span className="map-node node-d" />
      <span className="map-node node-e" /><span className="map-node node-f" />
      <div className="map-center"><b>system</b><small>measure · iterate</small></div>
      <div className="map-readout"><span>PIPELINE</span><b>ONLINE</b></div>
    </div>
  )
}

export function ProjectVisual({ type }: ProjectVisualProps) {
  if (type === 'forecast') {
    return (
      <div className="project-visual forecast-visual" aria-hidden="true">
        <div className="baseline" /><div className="series series-a" /><div className="series series-b" />
        <span>baseline</span><span>model</span>
      </div>
    )
  }

  if (type === 'orchestration') {
    return (
      <div className="project-visual orchestration-visual" aria-hidden="true">
        <div className="cloud-node">cloud<small>orchestrator</small></div>
        <i /><i /><i />
        <div className="local-node local-one">local_01</div>
        <div className="local-node local-two">local_02</div>
        <div className="local-node local-three">local_03</div>
      </div>
    )
  }

  if (type === 'routing') {
    return (
      <div className="project-visual router-visual" aria-hidden="true">
        <div className="router-flow">
          <div className="route-box"><small>01</small><b>local</b><span>generate</span></div>
          <i>→</i>
          <div className="route-box verifier-box"><small>02</small><b>tests</b><span>verify</span></div>
          <i>→</i>
          <div className="route-box"><small>03</small><b>route</b><span>decide</span></div>
        </div>
        <div className="route-outcomes"><span>PASS · KEEP</span><span>FAIL · API ↑</span></div>
      </div>
    )
  }

  return (
    <div className="project-visual retrieval-visual" aria-hidden="true">
      {['query', 'embed', 'retrieve', 'rerank'].map((step, index) => (
        <div key={step}><b>0{index + 1}</b><span>{step}</span>{index < 3 && <i />}</div>
      ))}
    </div>
  )
}
