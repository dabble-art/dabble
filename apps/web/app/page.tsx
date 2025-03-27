"use client";

import { Button } from "@workspace/ui/components/button";
import { ArtworkGrid } from "./components/artwork-grid";
import { NavigationMenu } from "./components/navigation-menu";
import { Sidebar } from "./components/sidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                  Featured Artworks
                </h1>
                <p className="text-muted-foreground mt-2">
                  Discover and get inspired by today's top digital artists
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Most Recent</Button>
                <Button variant="outline">Most Popular</Button>
                <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
                  Share Artwork
                </Button>
              </div>
            </div>
            <ArtworkGrid />
          </main>
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
