export default function Loading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-14 w-full rounded-xl bg-surface-2" />
      <div className="h-8 w-64 rounded-lg bg-surface-2" />
      <div className="h-24 w-full rounded-xl bg-surface-2" />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div className="h-56 w-full rounded-xl bg-surface-2" />
          <div className="h-48 w-full rounded-xl bg-surface-2" />
          <div className="h-64 w-full rounded-xl bg-surface-2" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-72 w-full rounded-xl bg-surface-2" />
          <div className="h-40 w-full rounded-xl bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
