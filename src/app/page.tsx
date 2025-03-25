import { voyage } from "~/fonts/voyage";
import { cn } from "~/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className={cn("text-6xl font-bold", voyage.className)}>Polychromos</h1>
      </main>
    </div>
  );
}
