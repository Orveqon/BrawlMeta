import { Trophy, Star, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalysisResult } from "@/types/brawl-stars"

interface PlayerStatsProps {
  analysis: AnalysisResult
}

export function PlayerStats({ analysis }: PlayerStatsProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Player Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">{analysis.playerName}</h3>
            <p className="text-sm text-muted-foreground">#{analysis.playerTag}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{analysis.trophies.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Trophies</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{analysis.rankedInsights.bestBrawlers.length}</p>
                <p className="text-xs text-muted-foreground">Top Brawlers</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
