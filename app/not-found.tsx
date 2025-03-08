import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))]">
      <span className="text-lg">Page not found. <Link href="/" className="underline decoration-[1px] decoration-dashed underline-offset-4 decoration-neutral-400 hover:opacity-75">Back home.</Link></span>
    </div>
  );
}
