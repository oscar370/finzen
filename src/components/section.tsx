export function Section({ children }: React.PropsWithChildren) {
  return <section>{children}</section>;
}

export function SectionTitle({ children }: React.PropsWithChildren) {
  return <h2 className="mb-1 ml-0.5 font-bold">{children}</h2>;
}
