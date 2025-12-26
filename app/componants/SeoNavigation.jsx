import Link from "next/link";

export default function SeoNavigation() {
  return (
    <nav
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {/* Main Pages */}
      <Link href="/">Home</Link>
      <Link href="/about-us">About Us</Link>
      <Link href="/contact-us">Contact Us</Link>
      <Link href="/blog">Blog</Link>

      {/* Business Pages */}
      <Link href="/stations">Stations</Link>
      <Link href="/trains">Trains</Link>
      <Link href="/vendor-registration">Vendor Registration</Link>

      {/* Legal */}
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/terms-and-conditions">Terms & Conditions</Link>
      <Link href="/cancellation-policy">Cancellation Policy</Link>
    </nav>
  );
}
