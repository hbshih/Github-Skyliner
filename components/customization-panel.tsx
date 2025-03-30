"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Download,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Copy,
  Code,
  ImageIcon,
  FileImage,
  FileIcon as FilePdf,
  FileImageIcon as FileSvg,

  Grid3X3,
  Mountain,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { jsPDF } from "jspdf"

import {
  useVisualization,
  type ColorPalette,
  COLOR_PALETTES,
  type VisualizationType,
} from "@/contexts/visualization-context"

interface CustomizationPanelProps {
  username: string
}

export function CustomizationPanel({ username }: CustomizationPanelProps) {
  // Add CSS styles for fixed panel layout
  const panelStyles = {
    position: 'sticky' as const,
    top: 0,
    height: '100vh',
    overflowY: 'auto' as const,
    borderLeft: '1px solid var(--border)',
    backgroundColor: 'var(--background)',
    width: '320px',
    padding: '1rem',
    zIndex: 10,
  }
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const visualizationRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    colorPalette,
    setColorPalette,

    showLegend,
    setShowLegend,
    animateCharts,
    setAnimateCharts,
    skylineBuildingStyle,
    setSkylineBuildingStyle,
    skylineEnvironment,
    setSkylineEnvironment,
    skylineReflections,
    setSkylineReflections,
    skylineParticles,
    setSkylineParticles,
    skylineRotationSpeed,
    setSkylineRotationSpeed,
    visualizationType,
    setVisualizationType,
    setContributions,
  } = useVisualization()

  // Only render after component has mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)

    // Find the visualization element for export
    visualizationRef.current = document.getElementById("visualization-container") as HTMLDivElement
  }, [])

  const colorPalettes: { value: ColorPalette; label: string; description: string }[] = [
    { value: "default", label: "Red", description: "Classic red theme" },
    { value: "github", label: "GitHub", description: "Original GitHub style" },
    { value: "neon", label: "Neon", description: "Bright blue neon glow" },
    { value: "pastel", label: "Pastel", description: "Soft pastel colors" },
    { value: "monochrome", label: "Monochrome", description: "Grayscale elegance" },
    { value: "cyberpunk", label: "Cyberpunk", description: "Futuristic neon style" },
    { value: "gradient", label: "Gradient", description: "Smooth purple transitions" },
    { value: "holographic", label: "Holographic", description: "Shimmering effect" },
    { value: "sunset", label: "Sunset", description: "Warm sunset colors" },
    { value: "ocean", label: "Ocean", description: "Deep blue ocean tones" },
    { value: "synthwave", label: "Synthwave", description: "Retro-futuristic grid" },
    { value: "aurora", label: "Aurora", description: "Northern lights effect" },
    { value: "cosmic", label: "Cosmic", description: "Deep space gradient" },
    { value: "emerald", label: "Emerald", description: "Rich green gradient" },
    { value: "ruby", label: "Ruby", description: "Deep red gradient" },
    { value: "sapphire", label: "Sapphire", description: "Deep blue gradient" },
  ]



  const buildingStyleOptions = [
    { value: "modern", label: "Modern" },
    { value: "retro", label: "Retro" },
    { value: "futuristic", label: "Futuristic" },
    { value: "pixel", label: "Pixel Art" },
    { value: "abstract", label: "Abstract" },
    { value: "skyscraper", label: "NYC Skyscraper" },
  ]

  const environmentOptions = [
    { value: "city", label: "City" },
    { value: "nature", label: "Nature" },
    { value: "mountains", label: "Mountains" },
    { value: "desert", label: "Desert" },
    { value: "night", label: "Night Sky" },
  ]

  const exportSizes = [
    { value: "sm", label: "Small (800×450)", width: 800, height: 450 },
    { value: "md", label: "Medium (1200×675)", width: 1200, height: 675 },
    { value: "lg", label: "Large (1600×900)", width: 1600, height: 900 },
    { value: "xl", label: "Extra Large (2400×1350)", width: 2400, height: 1350 },
  ]

  const copyEmbedCode = () => {
    // Build the embed URL with all current settings
    let embedUrl = `${window.location.origin}/embed?username=${username}&visualType=${visualizationType}&colorPalette=${colorPalette}&showLegend=${showLegend}&animateCharts=${animateCharts}`
    
    // Add skyline-specific settings if the current visualization is skyline
    if (visualizationType === 'skyline') {
      embedUrl += `&skylineBuildingStyle=${skylineBuildingStyle}&skylineEnvironment=${skylineEnvironment}&skylineReflections=${skylineReflections}&skylineParticles=${skylineParticles}&skylineRotationSpeed=${skylineRotationSpeed}`
    }
    
    // Generate responsive embed code with all settings
    const embedCode = `<iframe src="${embedUrl}" width="100%" height="500" style="border:0; max-width:100%;" allow="fullscreen"></iframe>`
    
    navigator.clipboard.writeText(embedCode)
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard with all your current settings",
    })
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/profile?username=${username}&colorPalette=${colorPalette}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    })
  }

  const handleExport = async (format: string, size = "md") => {
    try {
      toast({
        title: "Exporting...",
        description: `Preparing ${format.toUpperCase()} file`,
      })

      const selectedSize = exportSizes.find((s) => s.value === size) || exportSizes[1]

      // For 3D content, we need to capture the canvas directly
      if (visualizationType === "skyline") {
        // Find the canvas element
        const canvas = document.getElementById("skyline-canvas")?.querySelector("canvas")

        if (!canvas) {
          throw new Error("Could not find the 3D canvas element")
        }

        // Note: We'll no longer try to modify the existing WebGL context as it causes errors
        // Instead, we'll directly capture the canvas content as-is

        // Create a temporary canvas with the desired dimensions
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = selectedSize.width
        tempCanvas.height = selectedSize.height
        const tempCtx = tempCanvas.getContext("2d")

        if (!tempCtx) {
          throw new Error("Could not create temporary canvas context")
        }

        // Set background color
        tempCtx.fillStyle = "#121212" // Dark background
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

        // Draw the WebGL canvas to our temporary canvas
        tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, selectedSize.width, selectedSize.height)

        // Add user information and branding to make it more shareable
        tempCtx.font = `bold ${Math.round(selectedSize.width * 0.04)}px sans-serif`
        tempCtx.fillStyle = "#ffffff"
        tempCtx.textAlign = "left"
        tempCtx.fillText(`@${username || "github"}`, 20, selectedSize.height - 60)
        
        // Add current year
        tempCtx.textAlign = "right"
        tempCtx.fillStyle = "#9333ea" // Purple accent color
        tempCtx.fillText(`${new Date().getFullYear()}`, selectedSize.width - 20, selectedSize.height - 60)
        
        // Add app branding
        tempCtx.font = `${Math.round(selectedSize.width * 0.025)}px sans-serif`
        tempCtx.textAlign = "center"
        tempCtx.fillStyle = "rgba(255, 255, 255, 0.7)"
        tempCtx.fillText("CommitCanvas - github profile visualizer", selectedSize.width / 2, selectedSize.height - 20)

        // Get the data URL from the temporary canvas
        let dataUrl: string
        let filename = `github-${username}-skyline-${new Date().getTime()}`

        switch (format) {
          case "png":
            dataUrl = tempCanvas.toDataURL("image/png")
            filename += ".png"
            break
          case "jpg":
            dataUrl = tempCanvas.toDataURL("image/jpeg", 0.9)
            filename += ".jpg"
            break
          case "svg":
            // SVG export not supported for canvas, fallback to PNG
            dataUrl = tempCanvas.toDataURL("image/png")
            filename += ".png"
            toast({
              title: "SVG export not supported for 3D content",
              description: "Exporting as PNG instead",
            })
            break
          case "pdf":
            dataUrl = tempCanvas.toDataURL("image/png")
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [selectedSize.width, selectedSize.height],
            })
            pdf.addImage(dataUrl, "PNG", 0, 0, selectedSize.width, selectedSize.height)
            pdf.save(`${filename}.pdf`)
            toast({
              title: "Export complete!",
              description: `PDF file has been downloaded`,
            })
            return
          default:
            dataUrl = tempCanvas.toDataURL("image/png")
            filename += ".png"
        }

        // Create download link
        const link = document.createElement("a")
        link.download = filename
        link.href = dataUrl
        link.click()

        toast({
          title: "Export complete!",
          description: `${format.toUpperCase()} file has been downloaded`,
        })
      } else {
        // For non-3D content, use html2canvas
        // We need to dynamically import html2canvas to avoid SSR issues
        const html2canvas = (await import("html2canvas")).default

        if (!visualizationRef.current) {
          visualizationRef.current = document.getElementById("visualization-container") as HTMLDivElement

          if (!visualizationRef.current) {
            throw new Error("Could not find visualization element")
          }
        }

        // Capture the visualization
        const canvas = await html2canvas(visualizationRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          width: visualizationRef.current.offsetWidth,
          height: visualizationRef.current.offsetHeight,
        })

        let dataUrl: string
        let filename = `github-${username}-contributions-${new Date().getTime()}`

        switch (format) {
          case "png":
            dataUrl = canvas.toDataURL("image/png")
            filename += ".png"
            break
          case "jpg":
            dataUrl = canvas.toDataURL("image/jpeg", 0.9)
            filename += ".jpg"
            break
          case "svg":
            // SVG export not supported for canvas, fallback to PNG
            dataUrl = canvas.toDataURL("image/png")
            filename += ".png"
            toast({
              title: "SVG export not supported",
              description: "Exporting as PNG instead",
            })
            break
          case "pdf":
            dataUrl = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [canvas.width, canvas.height],
            })
            pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height)
            pdf.save(`${filename}.pdf`)
            toast({
              title: "Export complete!",
              description: `PDF file has been downloaded`,
            })
            return
          default:
            dataUrl = canvas.toDataURL("image/png")
            filename += ".png"
        }

        // Create download link
        const link = document.createElement("a")
        link.download = filename
        link.href = dataUrl
        link.click()

        toast({
          title: "Export complete!",
          description: `${format.toUpperCase()} file has been downloaded`,
        })
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "An error occurred during export. Try a different format or size.",
        variant: "destructive",
      })
    }
  }

  const shareToSocialMedia = (platform: string) => {
    const shareUrl = `${window.location.origin}/profile?username=${username}&colorPalette=${colorPalette}`
    let shareLink = ""

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out ${username}'s GitHub contributions visualization!`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "github":
        shareLink = `https://github.com/${username}`
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank")
    }
  }

  // Handle text import
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string

        // Try to parse as JSON first
        try {
          const jsonData = JSON.parse(content)

          // Check if it's a valid contributions format
          if (Array.isArray(jsonData) && jsonData.length > 0 && "date" in jsonData[0] && "count" in jsonData[0]) {
            // Process the contributions data
            const processedData = jsonData.map((item: any) => ({
              date: item.date,
              count: Number.parseInt(item.count, 10) || 0,
              level: calculateLevel(Number.parseInt(item.count, 10) || 0),
            }))

            setContributions(processedData)

            toast({
              title: "Import successful",
              description: `Imported ${processedData.length} contribution records`,
            })
          } else {
            throw new Error("Invalid JSON format")
          }
        } catch (jsonError) {
          // If not valid JSON, try to parse as CSV
          const lines = content.split("\n").filter((line) => line.trim())

          if (lines.length > 0) {
            // Assume first line might be header
            const isHeader = lines[0].toLowerCase().includes("date") && lines[0].toLowerCase().includes("count")
            const startIndex = isHeader ? 1 : 0

            const processedData = []

            for (let i = startIndex; i < lines.length; i++) {
              const parts = lines[i].split(",")
              if (parts.length >= 2) {
                const date = parts[0].trim()
                const count = Number.parseInt(parts[1].trim(), 10) || 0

                processedData.push({
                  date,
                  count,
                  level: calculateLevel(count),
                })
              }
            }

            if (processedData.length > 0) {
              setContributions(processedData)

              toast({
                title: "Import successful",
                description: `Imported ${processedData.length} contribution records`,
              })
            } else {
              throw new Error("No valid data found in CSV")
            }
          } else {
            throw new Error("Invalid file format")
          }
        }
      } catch (error) {
        console.error("Import error:", error)
        toast({
          title: "Import failed",
          description: "Could not parse the file. Please ensure it's a valid JSON or CSV format.",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)
  }

  // Helper function to calculate contribution level (0-4)
  const calculateLevel = (count: number): number => {
    if (count === 0) return 0
    if (count <= 3) return 1
    if (count <= 6) return 2
    if (count <= 9) return 3
    return 4
  }

  // Don't render until client-side to avoid hydration issues
  if (!mounted) {
    return null
  }

  // Add the city style options to the customization panel
  const cityStyleOptions = [
    { value: "stylized", label: "Stylized" },
    { value: "realistic", label: "Realistic" },
  ]

  const visualizationTypes: { value: VisualizationType; label: string; icon: React.ReactNode }[] = [
    {
      value: "skyline",
      label: "Skyline",
      icon: <Mountain className="h-4 w-4" />,
    },
    {
      value: "calendar",
      label: "Calendar",
      icon: <Grid3X3 className="h-4 w-4" />,
    },
  ]

  return (
    <div style={panelStyles} className="border-l border-border/50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 p-3">
        <h3 className="font-medium">Customize Skyline</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>



          {/* Style Tab */}
          <TabsContent value="style" className="p-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Visualization Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {visualizationTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={visualizationType === type.value ? "default" : "outline"}
                    size="sm"
                    className="flex items-center justify-start gap-2"
                    onClick={() => setVisualizationType(type.value)}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                    {visualizationType === type.value && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {visualizationType === "skyline" && (
              <>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Building Style</h4>
                  <RadioGroup
                    value={skylineBuildingStyle}
                    onValueChange={(value) => setSkylineBuildingStyle(value)}
                    className="flex flex-col gap-2"
                  >
                    {buildingStyleOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`building-${option.value}`} />
                        <Label htmlFor={`building-${option.value}`} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Environment Style</h4>
                  <RadioGroup
                    value={skylineEnvironment}
                    onValueChange={(value) => setSkylineEnvironment(value)}
                    className="flex flex-col gap-2"
                  >
                    {environmentOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`environment-${option.value}`} />
                        <Label htmlFor={`environment-${option.value}`} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rotation-speed" className="text-sm">
                      Rotation Speed
                    </Label>
                    <span className="text-xs text-muted-foreground">{skylineRotationSpeed}x</span>
                  </div>
                  <Slider
                    id="rotation-speed"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[skylineRotationSpeed]}
                    onValueChange={(value) => setSkylineRotationSpeed(value[0])}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reflections" className="text-sm">
                      Reflections
                    </Label>
                    <Switch id="reflections" checked={skylineReflections} onCheckedChange={setSkylineReflections} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="particles" className="text-sm">
                      Particles
                    </Label>
                    <Switch id="particles" checked={skylineParticles} onCheckedChange={setSkylineParticles} />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Color Palette</h4>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {colorPalettes.map((palette) => (
                  <TooltipProvider key={palette.value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`justify-start hover:bg-primary/10 transition-all duration-300 ${
                            colorPalette === palette.value ? "ring-2 ring-primary scale-[1.02] shadow-md" : ""
                          }`}
                          onClick={() => setColorPalette(palette.value)}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div className="flex gap-1">
                              {(COLOR_PALETTES[palette.value] || []).slice(1, 4).map((color, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-sm ${
                                    palette.value === "holographic" ? "holographic-effect" : ""
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="text-xs">{palette.label}</span>
                            {colorPalette === palette.value && (
                              <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
                            )}
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="tooltip-content">
                        <p>{palette.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Appearance</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-legend" className="text-sm">
                    Show Legend
                  </Label>
                  <Switch id="show-legend" checked={showLegend} onCheckedChange={setShowLegend} />
                </div>


                <div className="flex items-center justify-between">
                  <Label htmlFor="animate" className="text-sm">
                    Animate
                  </Label>
                  <Switch id="animate" checked={animateCharts} onCheckedChange={setAnimateCharts} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share" className="p-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Import Data</h4>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,.csv,.txt"
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full gap-2 hover:bg-primary/10 transition-colors"
                onClick={handleImportClick}
              >
                <Upload className="h-4 w-4" />
                Import Contribution Data
              </Button>
              <p className="text-xs text-muted-foreground">Import JSON or CSV file with date and count columns</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Share on Social Media</h4>
              <div className="grid grid-cols-4 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col h-auto py-2 gap-1 hover:bg-primary/10 transition-colors"
                        onClick={() => shareToSocialMedia("twitter")}
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="text-xs">Twitter</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col h-auto py-2 gap-1 hover:bg-primary/10 transition-colors"
                        onClick={() => shareToSocialMedia("facebook")}
                      >
                        <Facebook className="h-4 w-4" />
                        <span className="text-xs">Facebook</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on Facebook</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col h-auto py-2 gap-1 hover:bg-primary/10 transition-colors"
                        onClick={() => shareToSocialMedia("linkedin")}
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="text-xs">LinkedIn</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col h-auto py-2 gap-1 hover:bg-primary/10 transition-colors"
                        onClick={() => shareToSocialMedia("github")}
                      >
                        <Github className="h-4 w-4" />
                        <span className="text-xs">GitHub</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on GitHub</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full gap-2 hover:bg-primary/10 transition-colors"
                      onClick={copyShareLink}
                    >
                      <Copy className="h-4 w-4" />
                      Copy Share Link
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy shareable URL to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Export</h4>
              <div className="space-y-2">
                <Label className="text-sm">Format</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["png", "jpg", "svg", "pdf"].map((format) => (
                    <TooltipProvider key={format}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex flex-col h-auto py-2 gap-1 hover:bg-primary/10 transition-colors"
                            onClick={() => handleExport(format)}
                          >
                            {format === "png" && <FileImage className="h-4 w-4" />}
                            {format === "jpg" && <ImageIcon className="h-4 w-4" />}
                            {format === "svg" && <FileSvg className="h-4 w-4" />}
                            {format === "pdf" && <FilePdf className="h-4 w-4" />}
                            <span className="text-xs">{format.toUpperCase()}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Export as {format.toUpperCase()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Size</Label>
                <Select defaultValue="md" onValueChange={(value) => handleExport("png", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {exportSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full gap-2 hover:bg-primary/90 transition-colors"
                      onClick={() => handleExport("png")}
                    >
                      <Download className="h-4 w-4" />
                      Download Image
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download visualization as image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Embed Code</h4>
              <Textarea
                readOnly
                value={`<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/embed?username=${username}&colorPalette=${colorPalette}" width="100%" height="500" frameborder="0"></iframe>`}
                className="font-mono text-xs h-24 bg-secondary border-border/50 focus-visible:ring-primary"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full gap-2 hover:bg-primary/10 transition-colors"
                      onClick={copyEmbedCode}
                    >
                      <Code className="h-4 w-4" />
                      Copy Embed Code
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy embed code to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

