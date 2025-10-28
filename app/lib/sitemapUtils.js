export async function fetchAllPages(baseUrl, api) {
  let page = 1;
  let allDocs = [];
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const res = await fetch(`${baseUrl}${api}&page=${page}`, {
        cache: "no-store",
      });
      if (!res.ok) break;

      const data = await res.json();

      if (data?.docs?.length) {
        allDocs = [...allDocs, ...data.docs];
        totalPages = data.totalPages || 1;
        page++;
      } else {
        break;
      }
    }
  } catch (err) {
    console.error(`❌ Error fetching ${api}:`, err.message);
  }

  return allDocs;
}
