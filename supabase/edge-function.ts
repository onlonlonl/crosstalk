import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/crosstalk-api", "");

  try {
    // GET /search?q=artist+song — search iTunes for cover art and link
    if (req.method === "GET" && path === "/search") {
      const q = url.searchParams.get("q") || "";
      if (!q)
        return new Response(JSON.stringify({ error: "Missing q param" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const itunesRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=3`
      );
      const itunesData = await itunesRes.json();
      const results = (itunesData.results || []).map((r: any) => ({
        title: r.trackName,
        artist: r.artistName,
        album: r.collectionName,
        cover: r.artworkUrl100?.replace("100x100", "600x600") || "",
        link: r.trackViewUrl || "",
        previewUrl: r.previewUrl || "",
      }));
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /pairs
    if (req.method === "GET" && path === "/pairs") {
      const { data, error } = await supabase
        .from("crosstalk_pairs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /comments
    if (req.method === "GET" && path === "/comments") {
      const { data, error } = await supabase
        .from("crosstalk_comments")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /settings
    if (req.method === "GET" && path === "/settings") {
      const { data, error } = await supabase
        .from("crosstalk_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /pairs
    if (req.method === "POST" && path === "/pairs") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("crosstalk_pairs")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PATCH /pairs/:id
    if (req.method === "PATCH" && path.startsWith("/pairs/")) {
      const id = path.split("/")[2];
      const body = await req.json();
      const { data, error } = await supabase
        .from("crosstalk_pairs")
        .update(body)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /comments
    if (req.method === "POST" && path === "/comments") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("crosstalk_comments")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PATCH /settings
    if (req.method === "PATCH" && path === "/settings") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("crosstalk_settings")
        .update(body)
        .eq("id", 1)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
