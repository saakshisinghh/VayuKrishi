import Link from "next/link";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="text-6xl">🌾</div>
        <h1 className="text-4xl font-bold text-[#1B6B2F]">VayuKrishi</h1>
        <p className="text-[#00796B] text-lg font-medium tracking-widest uppercase">
          Predict. Protect. Prosper.
        </p>
        <p className="text-gray-500 text-base">
          AI-powered crop intelligence for Indian farmers in your language.
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-block bg-[#1B6B2F] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#155a26] transition-colors"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
