import Image from "next/image";
import Link from "next/link";

const FooterSection = () => {
  return (
    <footer
      className="site-container-wide relative flex flex-col items-center justify-center border-t border-border pb-8 pt-16 lg:pt-32"
    >
      {/* Footer Content */}
      <div className="flex w-full flex-col items-start justify-between transition-all md:flex-row md:items-center">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-start justify-start md:max-w-[200px]">
          <div className="flex items-start">
            <Image
              src="/logo.svg"
              alt="logo"
              height={30}
              width={30}
              className=""
            />
          </div>

          <p className="mt-4 max-w-xs text-start text-sm text-foreground/70">
            Discover, showcase, and support innovative products on
            ProductPilot.
          </p>

          <div className="mt-4 text-sm text-foreground/70">
            Built with passion by{" "}
            <br></br>
            <Link
              href="https://github.com/rahulkhadeeng"
              className="transition-all duration-300 hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              Rahul Khade
            </Link>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="mt-20 flex w-full transition-all md:mt-0 md:w-1/2 lg:w-1/3">
          {Links.map((section) => (
            <div key={section.title} className="flex w-full justify-between">
              <div className="mt-10 flex flex-col md:mt-0">
                <h3 className="text-base font-medium">{section.title}</h3>

                <ul className="mt-4 text-sm text-muted-foreground">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="mt-2">
                      <Link
                        href={link.href}
                        className="transition-all duration-300 hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-8 w-full border-t border-border/40 pt-4 md:flex md:items-center md:justify-between md:pt-8">
        <p className="mt-8 text-sm text-muted-foreground md:mt-0">
          &copy; 2026 ProductPilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;

const Links = [
  {
    title: "Product",
    links: [
      { name: "Products", href: "/products" },
      { name: "Categories", href: "/categories" },
      { name: "Pricing", href: "/pricing" },
    ],
  },

  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
  },
];
