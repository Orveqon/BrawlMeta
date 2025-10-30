import { Lightbulb, Swords, Shield, Ban } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RankedInsightsType } from "@/types/brawl-stars"

interface RankedInsightsProps {
  insights: RankedInsightsType
}

export function RankedInsights({ insights }: RankedInsightsProps) {
  return (
    <Card className="border-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Ranked Strategy Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Best Brawlers */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Your Best Brawlers
          </h4>
          <div className="flex flex-wrap gap-2">
            {insights.bestBrawlers.map((brawler) => (
              <Badge key={brawler} variant="secondary" className="text-sm">
                {brawler}
              </Badge>
            ))}
          </div>
        </div>

        {/* Suggested Modes */}
        <div>
          <h4 className="font-semibold mb-2">Recommended Modes</h4>
          <div className="flex flex-wrap gap-2">
            {insights.suggestedModes.map((mode) => (
              <Badge key={mode} className="text-sm">
                {mode}
              </Badge>
            ))}
          </div>
        </div>

        {/* Strategy Tips */}
        <div>
          <h4 className="font-semibold mb-2">Strategy Tips</h4>
          <ul className="space-y-2">
            {insights.strategyTips.map((tip, index) => (
              <li key={index} className="flex gap-2 text-sm">
                <span className="text-primary">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Matchup Advice */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
              <Swords className="h-4 w-4" />
              Strong Against
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {insights.matchupAdvice.strongAgainst.map((matchup) => (
                <li key={matchup}>• {matchup}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
              <Shield className="h-4 w-4" />
              Weak Against
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {insights.matchupAdvice.weakAgainst.map((matchup) => (
                <li key={matchup}>• {matchup}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ban Suggestions */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Recommended Bans
          </h4>
          <div className="flex flex-wrap gap-2">
            {insights.matchupAdvice.banSuggestions.map((ban) => (
              <Badge key={ban} variant="destructive" className="text-sm">
                {ban}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
