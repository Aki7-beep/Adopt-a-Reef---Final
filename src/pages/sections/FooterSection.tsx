import { assetUrl } from "@/lib/utils";

const socialLinks = [{ alt: "Social links", src: assetUrl("/figmaAssets/social-links.svg") }];

export const FooterSection = (): JSX.Element => (
  <footer
    id="contacts"
    className="bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] shadow-[0px_-4px_10px_#00000040] scroll-mt-24"
  >
    <div className="mx-auto w-full max-w-[1440px] border-t border-[#00000026] px-[30px] py-16 sm:px-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="[font-family:'Inter',Helvetica] text-2xl font-normal leading-[28.8px] tracking-[-0.48px] text-white">
          Let&apos;s work together
        </p>
        <nav aria-label="Social media">
          {socialLinks.map((link) => (
            <img key={link.src} className="h-6 w-[120px]" alt={link.alt} src={link.src} />
          ))}
        </nav>
      </div>
    </div>
  </footer>
);
