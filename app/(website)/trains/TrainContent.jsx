import Link from "next/link";

/**
 * SEO text under the live journey. Rendered on the server, so search engines
 * get it in the first HTML. Uses the admin-written page for this train when
 * there is one, otherwise a short generic guide (no made-up timings).
 */
export default function TrainContent({ trainNo, trainName, page }) {
  const name = trainName || "your train";

  return (
    <article className="mx-auto mt-8 max-w-3xl">
      {page?.pageData ? (
        <section
          className="ck-content mb-8 text-base leading-relaxed text-gray-700 md:text-lg"
          dangerouslySetInnerHTML={{ __html: page.pageData }}
        />
      ) : (
        <section className="mb-8 space-y-3 text-[15px] leading-relaxed text-gray-700">
          <h2 className="!text-xl font-bold text-[#704D25]">
            Order Food in {name} ({trainNo})
          </h2>
          <p>
            <Link href="/" className="font-semibold text-blue-600 underline hover:text-blue-800">
              Order food in train
            </Link>{" "}
            <strong>{name}</strong> (<strong>{trainNo}</strong>) online and get fresh, hygienic meals delivered to
            your seat at the stations ahead on your journey.
          </p>
          <h3 className="!text-lg font-semibold text-gray-900">How to order in {name}</h3>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Pick the station where you want your food from the stops above.</li>
            <li>Choose a restaurant and add your favourite dishes.</li>
            <li>Enter your mobile number, coach and seat (PNR is optional).</li>
            <li>Pay online or choose cash on delivery.</li>
            <li>Your meal is delivered to your seat when the train reaches the station.</li>
          </ol>
          <p>
            All partner restaurants are FSSAI licensed. For group or bulk orders in train {trainNo}, call or
            WhatsApp us.
          </p>
        </section>
      )}

      <footer className="mt-8 py-6">
        <div className="text-center text-sm text-[#704d25]">
          <p>
            Need help? Call{" "}
            <a href="tel:+918696963496" className="font-bold text-blue-600 underline hover:text-blue-800">
              +91-8696963496
            </a>{" "}
            or mail{" "}
            <a href="mailto:info@trainscafe.in" className="font-bold text-blue-600 underline hover:text-blue-800">
              info@trainscafe.in
            </a>
          </p>
        </div>
      </footer>
    </article>
  );
}
