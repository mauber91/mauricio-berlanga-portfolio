type SectionHeaderProps = {
  eyebrow: string
  title: string
  copy?: string
}

export function SectionHeader({ eyebrow, title, copy }: SectionHeaderProps) {
  return (
    <div className="section-header reveal">
      <p className="eyebrow">{eyebrow}</p>
      <div>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </div>
  )
}
