import { createFileRoute } from "@tanstack/react-router";

import Detail, { type DetailLoaderData } from "@/pages/detail";

export const Route = createFileRoute("/detail/$id")({
  loader: async ({ params, location }) => {
    const searchParams = new URLSearchParams(location.searchStr);
    const sharePassword = searchParams.get("share_password");
    const editPassword = searchParams.get("edit_password");
    const query = new URLSearchParams({ id: params.id });
    if (sharePassword) {
      query.set("share_password", sharePassword);
    }
    const origin = location.url.origin;
    const apiUrl = `${origin}/api/get?${query.toString()}`;
    let paste: any;
    let error: string | undefined;
    let code: number | undefined;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      paste = data;
      if (data?.error) {
        error = data.error;
        code = data.code ?? res.status;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load paste";
      code = 500;
    }

    return {
      paste,
      error,
      code,
      sharePassword,
      editPassword,
      origin,
    } as DetailLoaderData;
  },
  head: ({ params }) => ({
    meta: [
      { title: "Shared content — PasteShare" },
      {
        name: "description",
        content:
          "View a shared temporary text or file on PasteShare. Links may expire or require a password.",
      },
      { property: "og:title", content: "Shared content — PasteShare" },
      {
        property: "og:description",
        content:
          "View a shared temporary text or file on PasteShare. Links may expire or require a password.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://as.al/detail/${params.id}` },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Shared content — PasteShare",
      },
      {
        name: "twitter:description",
        content:
          "View a shared temporary text or file on PasteShare. Links may expire or require a password.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "canonical", href: `https://as.al/detail/${params.id}` },
    ],
  }),
  component: DetailRoute,
});

function DetailRoute() {
  const loaderData = Route.useLoaderData();
  return <Detail loaderData={loaderData} />;
}
