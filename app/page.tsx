"use client"

import { useState } from "react"
import { Download, Sparkles } from "lucide-react"
import { PlayerSearch } from "@/components/player-search"
import { PlayerStats } from "@/components/player-stats"
import { EventCard } from "@/components/event-card"
import { RankedInsights } from "@/components/ranked-insights"
import { Button } from "@/components/ui/button"
import { analyzePlayer } from "@/app/actions"
import type { AnalysisResult } from "@/types/brawl-stars"
import { toast } from "sonner"

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (playerTag: string) => {
    setIsLoading(true)
    setAnalysis(null)

    try {
      const result = await analyzePlayer(playerTag)

      if (result.success) {
        setAnalysis(result.data)
        toast.success("Analysis complete!")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Failed to analyze player. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportJSON = () => {
    if (!analysis) return

    const dataStr = JSON.stringify(analysis, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `brawlmeta-${analysis.playerTag}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("JSON exported successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">BrawlMeta</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Meta & Ranked Assistant</p>
              </div>
            </div>
            {analysis && (
              <Button onClick={handleExportJSON} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Search Section */}
          <section className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Dominate Ranked with AI Analysis</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get personalized brawler recommendations for every active event based on your profile and the current
                meta
              </p>
            </div>
            <PlayerSearch onSearch={handleSearch} isLoading={isLoading} />
          </section>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                Analyzing player data...
              </div>
            </div>
          )}

          {/* Results */}
          {analysis && (
            <div className="space-y-8">
              {/* Player Stats */}
              <PlayerStats analysis={analysis} />

              {/* Ranked Insights */}
              <RankedInsights insights={analysis.rankedInsights} />

              {/* Event Recommendations */}
              <section className="space-y-4">
                <h3 className="text-2xl font-bold">Active Events & Recommendations</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {analysis.recommendations.map((rec, index) => (
                    <EventCard key={index} recommendation={rec} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Empty State */}
          {!analysis && !isLoading && (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl">🎮</div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Enter a player tag above to get started with personalized recommendations
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>BrawlMeta is not affiliated with Supercell. Data provided by RoyaleAPI.</p>
        </div>
      </footer>
    </div>
  )
}
