"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Layers,
  Copy,
  FileJson,
  GitBranch,
  ExternalLink,
  Terminal,
} from "lucide-react"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deployAndRunGitHubActions, validateGitHubCredentials } from "./github-actions-service"

// Dynamically import the Blockly component to avoid SSR issues
const BlocklyWorkspace = dynamic(
  () =>
    import("./blockly-workspace").catch((err) => {
      console.error("Failed to load BlocklyWorkspace:", err)
      return () => <BlocklyFallback />
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400 animate-spin mb-2" />
          <p className="text-slate-500 text-xs sm:text-sm">Loading visual editor...</p>
        </div>
      </div>
    ),
  },
)

// Fallback component for when Blockly can't be loaded
const BlocklyFallback = () => {
  const [code, setCode] = useState(`# Example Pipeline YAML
name: default_pipeline
concurrent: false

on:
  push:
    branches: [main]

jobs:
  build:
    description: "Build the application"
    continue-on-error: false
    steps:
      - name: npm_install
        with:
          args: "--production"
      
      - name: npm_build
  
  test:
    description: "Run tests"
    continue-on-error: true
    steps:
      - name: npm_test
  
  deploy:
    description: "Deploy to production"
    continue-on-error: false
    steps:
      - name: npm_deploy
    needs: [build, test]

env:
  NODE_ENV: "production"`)

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 sm:px-4 sm:py-3 rounded-md flex items-center shadow-sm mb-2 sm:mb-4 text-xs sm:text-sm">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 text-yellow-500" />
        <span>Visual editor could not be loaded. Using text editor instead.</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-full flex-grow min-h-[200px] p-2 sm:p-4 font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md resize-none"
        spellCheck="false"
      />
    </div>
  )
}

export default function VisualCICDEnvironment() {
  const [activeTab, setActiveTab] = useState("results")
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [generatedCode, setGeneratedCode] = useState<string>(`# Generated CI/CD Pipeline YAML
# This YAML is compatible with GitHub Actions

name: default_pipeline
concurrent: false

on:
  push:
    branches: [main]

jobs:
  build:
    description: "Build the application"
    continue-on-error: false
    steps:
      - name: npm_install
        with:
          args: "--production"
      
      - name: npm_build

env:
  NODE_ENV: "production"`)
  const [copySuccess, setCopySuccess] = useState(false)
  const [copyResultsSuccess, setCopyResultsSuccess] = useState(false)

  const [showConnectModal, setShowConnectModal] = useState(false)
  const [repository, setRepository] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [runUrl, setRunUrl] = useState<string | null>(null)

  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleBlocklyChange = (xml: string, code: string) => {
    setGeneratedCode(code)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  const handleCopyResults = () => {
    navigator.clipboard.writeText(result.join("\n")).then(() => {
      setCopyResultsSuccess(true)
      setTimeout(() => setCopyResultsSuccess(false), 2000)
    })
  }

  const handleConnect = async () => {
    // Reset validation state
    setValidationError(null)
    setIsValidating(true)

    // Validate credentials format
    const [isValid, errorMessage] = validateGitHubCredentials(apiKey, repository)

    if (!isValid) {
      setValidationError(errorMessage)
      setIsValidating(false)
      return
    }

    try {
      // Test the connection by making a simple API call
      const response = await fetch(`https://api.github.com/repos/${repository}`, {
        headers: {
          Authorization: `token ${apiKey}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || `Error ${response.status}: Could not access repository`)
      }

      // If we get here, the connection was successful
      setIsConnected(true)
      setShowConnectModal(false)
      setValidationError(null)
      console.log("Successfully connected to repository:", repository)
    } catch (error: any) {
      setValidationError(`Connection failed: ${error.message}`)
    } finally {
      setIsValidating(false)
    }
  }

  const handleRun = async () => {
    setIsRunning(true)
    setStatus("running")
    setMessageType("success") // Reset message type
    setActiveTab("results") // Switch to results tab
    setRunUrl(null) // Reset run URL

    // Clear previous results
    setResult(["Initializing pipeline..."])

    if (isConnected && repository && apiKey) {
      // Use the GitHub Actions integration
      try {
        // Update the UI with progress messages
        const updateResult = (message: string) => {
          setResult((prev) => [...prev, message])
        }

        // Run the GitHub Actions workflow
        const results = await deployAndRunGitHubActions(apiKey, repository, generatedCode, updateResult)

        // Extract GitHub run URL if present
        const runUrlLine = results.find((line) => line.includes("View complete run at:"))
        if (runUrlLine) {
          const url = runUrlLine.split("View complete run at: ")[1]
          setRunUrl(url)
        }

        // Set final status based on results
        if (results.some((line) => line.includes("❌"))) {
          setStatus("error")
          setMessageType("error")
        } else {
          setStatus("success")
        }
      } catch (error: any) {
        console.error("Error running GitHub Actions:", error)
        setResult((prev) => [...prev, `❌ Error: ${error.message}`])
        setStatus("error")
        setMessageType("error")
      } finally {
        setIsRunning(false)
      }
    } else {
      // Use the simulated pipeline execution
      const result: string[] = ["Initializing pipeline..."]

      // Parse the generated code to extract job names
      const jobMatches = [...generatedCode.matchAll(/jobs:\s*\n\s*([a-zA-Z0-9_-]+):/g)]
      const jobNames = jobMatches.map((match) => match[1])

      // If no jobs found, use default job names
      const jobs = jobNames.length > 0 ? jobNames : ["build", "test", "deploy"]

      // Function to update the result with a delay
      const updateResult = (message: string, delay: number) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            result.push(message)
            setResult([...result])
            resolve()
          }, delay)
        })
      }

      // Process each job sequentially
      const processJobs = async () => {
        try {
          await updateResult("Running in simulation mode (no repository connected)", 300)

          for (const job of jobs) {
            await updateResult(`[${job}] Started`, 300)

            // For test job, randomly decide if we should simulate an error
            if (job.toLowerCase().includes("test") && Math.random() > 0.7) {
              await updateResult(`[${job}] Running tests...`, 500)
              await updateResult(`[${job}] ❌ Test failed: Assertion error in integration tests`, 700)
              await updateResult(`❌ Pipeline execution failed.`, 300)
              setIsRunning(false)
              setStatus("error")
              setMessageType("error")
              return
            }

            // Process job steps
            await updateResult(`[${job}] Processing...`, 400)
            await updateResult(`[${job}] Running commands...`, 500)
            await updateResult(`[${job}] Completed successfully`, 600)
          }

          // All jobs completed successfully
          await updateResult(`✅ Pipeline execution completed successfully.`, 300)
          setIsRunning(false)
          setStatus("success")
        } catch (error) {
          console.error("Error in pipeline execution:", error)
          await updateResult(`❌ Pipeline execution failed with error: ${error}`, 300)
          setIsRunning(false)
          setStatus("error")
          setMessageType("error")
        }
      }

      processJobs()
    }
  }

  const [result, setResult] = useState<string[]>(["// Results will appear here after running"])

  const getStatusBadge = () => {
    switch (status) {
      case "idle":
        return (
          <Badge variant="outline" className="ml-2 bg-slate-100">
            <Clock className="h-3 w-3 mr-1" /> Ready
          </Badge>
        )
      case "running":
        return (
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Running
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Success
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-3 py-2 sm:px-4 sm:py-3 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Visual Environment for CI/CD</h1>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowConnectModal(true)}
              variant="outline"
              className="text-xs sm:text-sm border-slate-300 text-slate-700"
            >
              <GitBranch className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {isConnected ? "Repository Connected" : "Connect to Repo"}
            </Button>
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all text-xs sm:text-sm"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> Running
                </>
              ) : (
                <>
                  <Play className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Run Pipeline
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 py-2 sm:px-4">
        {messageType === "success" ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 sm:px-4 sm:py-3 rounded-md flex items-center shadow-sm text-xs sm:text-sm">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 text-blue-500" />
            <span>All systems operational. Pipeline configuration is valid.</span>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 sm:px-4 sm:py-3 rounded-md flex items-center shadow-sm text-xs sm:text-sm">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 text-red-500" />
            <span>Error detected in pipeline execution. Check the logs for details.</span>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-hidden container mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 sm:gap-4 h-full max-h-full">
          {/* Visual Language Editor - 2/3 width */}
          <Card className="xl:col-span-2 flex flex-col shadow-md border-slate-200 overflow-hidden h-[450px] sm:h-[550px] xl:h-full">
            <CardHeader className="bg-white py-2 px-3 sm:py-3 sm:px-4 border-b border-slate-200">
              <CardTitle className="text-slate-800 flex items-center text-sm sm:text-base font-medium">
                <Layers className="h-4 w-4 mr-2 text-slate-500" />
                Visual Pipeline Definition
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden bg-slate-50">
              <BlocklyWorkspace onChange={handleBlocklyChange} />
            </CardContent>
          </Card>

          {/* Results Panel - 1/3 width */}
          <Card className="flex flex-col shadow-md border-slate-200 overflow-hidden h-[350px] sm:h-[450px] xl:h-full">
            <CardHeader className="bg-white py-2 px-3 sm:py-3 sm:px-4 border-b border-slate-200 flex flex-row justify-between items-center">
              <CardTitle className="text-slate-800 text-sm sm:text-base font-medium">Results</CardTitle>
              {runUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => window.open(runUrl, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> View on GitHub
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 p-0 bg-slate-100 rounded-none border-b border-slate-200">
                  <TabsTrigger
                    value="results"
                    className="py-1 sm:py-2 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none text-xs sm:text-sm"
                  >
                    <Terminal className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Results
                  </TabsTrigger>
                  <TabsTrigger
                    value="viewCode"
                    className="py-1 sm:py-2 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none text-xs sm:text-sm"
                  >
                    <FileJson className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    YAML
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="results" className="flex-grow p-0 m-0 overflow-hidden">
                  <div className="h-full overflow-auto bg-slate-900 text-slate-100 p-2 sm:p-4 relative">
                    <Button
                      onClick={handleCopyResults}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                    >
                      {copyResultsSuccess ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" /> Copy
                        </>
                      )}
                    </Button>
                    <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap">{result.join("\n")}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="viewCode" className="flex-grow p-0 m-0 overflow-hidden">
                  <div className="h-full overflow-auto bg-slate-900 text-slate-100 p-2 sm:p-4 relative">
                    <Button
                      onClick={handleCopyCode}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" /> Copy
                        </>
                      )}
                    </Button>
                    <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap">{generatedCode}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect to Repository</DialogTitle>
            <DialogDescription>Enter your repository details and API key to connect your pipeline.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="repository" className="text-right">
                Repository
              </Label>
              <Input
                id="repository"
                value={repository}
                onChange={(e) => {
                  setRepository(e.target.value)
                  setValidationError(null) // Clear error when input changes
                }}
                placeholder="username/repo"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <div className="col-span-3 flex relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value)
                    setValidationError(null) // Clear error when input changes
                  }}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye-off"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" x2="22" y1="2" y2="22"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </Button>
              </div>
            </div>

            {validationError && (
              <div className="col-span-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md text-xs">
                <AlertCircle className="h-4 w-4 inline-block mr-1.5 text-red-500" />
                {validationError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleConnect} disabled={!repository || !apiKey || isValidating}>
              {isValidating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Validating...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

