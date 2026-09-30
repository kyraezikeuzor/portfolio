import { Signature } from '@/components/ui/signature';
import { Postscript } from './portfolio';
import { getPortfolioData } from '@/lib/portfolio';
import { typography } from '@/lib/typography';

export default async function Footer() {
  const portfolio = await getPortfolioData();

  return (
    <footer className="flex justify-center py-8">
      <div className="flex w-full max-w-[700px] flex-col items-start gap-4 px-5">
        <Signature />
        <Postscript postscript={portfolio.postscript} />
        <span className={typography.itemDate}>© Made in Texas</span>
      </div>
    </footer>
  );
}
