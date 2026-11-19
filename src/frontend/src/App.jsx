
import { useState, useEffect } from 'react'
import { Shield, FileText, Upload, BarChart3, Activity, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Input } from './components/ui/input'
import { Badge } from './components/ui/badge'
import MetricsDashboard from './components/MetricsDashboard'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [inputType, setInputType] = useState('text')
  const [textInput, setTextInput] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/metrics`)
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
    }
  }

  const handleAnalyze = async () => {
    setError('')
    setResult(null)
    setAnalyzing(true)

    try {
      let response

      if (inputType === 'text') {
        const payload = {
          type: 'text',
          data: textInput
        }

        response = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      } else {
        // PDF file upload
        const formData = new FormData()
        formData.append('file', pdfFile)

        response = await fetch(`${API_BASE_URL}/api/analyze-pdf`, {
          method: 'POST',
          body: formData
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Prompt Injection Defense
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Multi-layer security system for LLM protection
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-2">
              <Activity className="w-4 h-4" />
              System Active
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Input Analysis
                </CardTitle>
                <CardDescription>
                  Submit text or PDF for prompt injection detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Input Type Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    onClick={() => setInputType('text')}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Text Input
                  </Button>
                  <Button
                    variant={inputType === 'pdf' ? 'default' : 'outline'}
                    onClick={() => setInputType('pdf')}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    PDF Input
                  </Button>
                </div>

                {/* Input Fields */}
                {inputType === 'text' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enter your prompt</label>
                    <Textarea
                      placeholder="Type or paste your prompt here..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload PDF file</label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      className="cursor-pointer"
                    />
                    {pdfFile && (
                      <p className="text-xs text-muted-foreground">
                        Selected: {pdfFile.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || (inputType === 'text' ? !textInput.trim() : !pdfFile)}
                  className="w-full"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Analyze Input
                    </>
                  )}
                </Button>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Final Decision */}
                  <div className={`p-6 rounded-lg border-2 ${
                    result.final_decision === 'ALLOW' 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      {result.final_decision === 'ALLOW' ? (
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                      )}
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {result.final_decision}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {result.final_decision === 'ALLOW' 
                            ? 'Input is safe to proceed to LLM' 
                            : 'Input blocked - potential prompt injection detected'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Model 1 Risk Score</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {result.model1_risk_score?.toFixed(2) || 'N/A'}%
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Model 1 Prediction</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {result.model1_prediction || 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Policy Score</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {result.policy_score?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Model 2 Triggered</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {result.model2_triggered ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  {/* Model 2 Results (if triggered) */}
                  {result.model2_triggered && result.model2_prediction && (
                    <div className="p-5 bg-blue-100 dark:bg-blue-900/50 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3">
                        Model 2 (RoBERTa) Secondary Verification
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">Prediction</p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {result.model2_prediction}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">Malicious Probability</p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {result.model2_malicious_prob?.toFixed(4) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing Time */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Gateway Processing Time</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {result.gateway_time_ms?.toFixed(2) || 'N/A'} ms
                    </p>
                  </div>

                  {/* LLM Response */}
                  {result.final_decision === 'ALLOW' && result.llm_response && (
                    <div className="p-5 bg-purple-50 dark:bg-purple-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                      <p className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Llama 3.2 Response
                      </p>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-800">
                        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                          {result.llm_response}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Metrics Sidebar */}
          <div className="space-y-6">
            <MetricsDashboard metrics={metrics} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
