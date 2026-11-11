export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-end gap-4 px-5 pt-[calc(env(safe-area-inset-top)+24px)] pb-[calc(env(safe-area-inset-bottom)+40px)]">
      <p className="text-[15px] font-semibold text-ink-2">ROOMRESET</p>
      <h1
        className="font-display text-[clamp(44px,13vw,72px)] leading-[1.02] font-bold tracking-[-0.02em]"
        style={{ fontVariationSettings: '"wdth" 88, "opsz" 72' }}
      >
        Tout retrouve sa place.
      </h1>
      <p className="max-w-[34ch] text-[17px] leading-6 text-ink-2">
        Le socle de l’application est prêt. Les écrans arrivent avec le système de design.
      </p>
    </main>
  );
}
