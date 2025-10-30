import { MapPin, Gamepad2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BrawlerRecommendation } from "@/types/brawl-stars"

interface EventCardProps {
  recommendation: BrawlerRecommendation
}

export function EventCard({ recommendation }: EventCardProps) {
  const { event, topPicks } = recommendation

  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              {event.mode}
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {event.map}
            </div>
          </div>
          <Badge variant="secondary">{topPicks.length} Picks</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPicks.map((pick, index) => (
            <div key={pick.name} className="p-4 rounded-lg border bg-card/50 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-lg">{pick.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Power {pick.powerLevel}/11 • {pick.trophies} 🏆 • Rank {pick.rank}
                  </p>
                </div>
              </div>

              <p className="text-sm">{pick.reasoning}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">Strengths:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {pick.strengths.map((strength) => (
                      <li key={strength}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-600 dark:text-red-400">Weaknesses:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {pick.weaknesses.map((weakness) => (
                      <li key={weakness}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
