import { BarChart3, Shield, Activity, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Badge } from './ui/badge'

function MetricsDashboard({ metrics }) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading metrics...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Metrics
          </CardTitle>
          <CardDescription>
            Gateway performance on {metrics.test_samples} test samples
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
              <p className="text-xl font-bold text-primary">{metrics.accuracy}%</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">F1 Score</p>
              <p className="text-xl font-bold text-primary">{metrics.f1_score}%</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Precision</p>
              <p className="text-xl font-bold text-primary">{metrics.precision}%</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Recall</p>
              <p className="text-xl font-bold text-primary">{metrics.recall}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confusion Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-4 h-4" />
            Confusion Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/40 rounded border border-green-200 dark:border-green-700">
              <span className="text-sm font-medium text-green-800 dark:text-green-200">True Negatives</span>
              <Badge variant="success">{metrics.confusion_matrix.true_negatives}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded border border-yellow-200 dark:border-yellow-700">
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">False Positives</span>
              <Badge variant="warning">{metrics.confusion_matrix.false_positives}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded border border-yellow-200 dark:border-yellow-700">
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">False Negatives</span>
              <Badge variant="warning">{metrics.confusion_matrix.false_negatives}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/40 rounded border border-green-200 dark:border-green-700">
              <span className="text-sm font-medium text-green-800 dark:text-green-200">True Positives</span>
              <Badge variant="success">{metrics.confusion_matrix.true_positives}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routing Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-4 h-4" />
            Routing Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ALLOW Decisions</span>
            <Badge variant="secondary">{metrics.routing.allow_decisions}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">BLOCK Decisions</span>
            <Badge variant="destructive">{metrics.routing.block_decisions}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Model 2 Triggered</span>
            <Badge variant="outline">{metrics.routing.model2_triggered}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Model 2 Trigger Rate</span>
            <Badge variant="outline">{metrics.routing.model2_trigger_rate}%</Badge>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Avg Gateway Time
              </span>
              <span className="text-sm font-semibold">{metrics.routing.avg_gateway_time_ms} ms</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MetricsDashboard
