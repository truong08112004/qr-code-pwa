"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Copy, Share2, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

interface QRGeneratorProps {
  className?: string
}

export function QRGenerator({ className }: QRGeneratorProps) {
  const [text, setText] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [size, setSize] = useState("256")
  const [errorLevel, setErrorLevel] = useState("M")
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const generateQR = async () => {
    if (!text.trim()) {
      toast({
        title: "Input required",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const options = {
        width: Number.parseInt(size),
        errorCorrectionLevel: errorLevel as "L" | "M" | "Q" | "H",
        color: {
          dark: "#00FF88", // Primary green color
          light: "#000000", // Black background
        },
        margin: 2,
      }

      const dataUrl = await QRCode.toDataURL(text, options)
      setQrDataUrl(dataUrl)

      // Also generate to canvas for download functionality
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, options)
      }

      toast({
        title: "QR Code generated",
        description: "Your QR code is ready to use",
      })
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQR = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "qrcode.png"
    link.href = canvasRef.current.toDataURL()
    link.click()

    toast({
      title: "Downloaded",
      description: "QR code saved to your device",
    })
  }

  const copyToClipboard = async () => {
    if (!qrDataUrl) return

    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])

      toast({
        title: "Copied",
        description: "QR code copied to clipboard",
      })
    } catch (error) {
      // Fallback: copy the text instead
      await navigator.clipboard.writeText(text)
      toast({
        title: "Text copied",
        description: "Original text copied to clipboard",
      })
    }
  }

  const shareQR = async () => {
    if (!qrDataUrl || !navigator.share) {
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support sharing",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      const file = new File([blob], "qrcode.png", { type: "image/png" })

      await navigator.share({
        title: "QR Code",
        text: `QR Code for: ${text}`,
        files: [file],
      })
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Share failed",
        description: "Failed to share QR code",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={className}>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <QrCode className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Generate QR Code</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Create QR codes from text, URLs, or any content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text-input" className="text-sm font-medium">
              Text or URL
            </Label>
            <Textarea
              id="text-input"
              placeholder="Enter text, URL, or any content..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px] resize-none bg-input/50 border-border/50"
              maxLength={2000}
            />
            <div className="text-xs text-muted-foreground text-right">{text.length}/2000 characters</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size-select" className="text-sm font-medium">
                Size
              </Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="bg-input/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128x128</SelectItem>
                  <SelectItem value="256">256x256</SelectItem>
                  <SelectItem value="512">512x512</SelectItem>
                  <SelectItem value="1024">1024x1024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="error-level" className="text-sm font-medium">
                Error Correction
              </Label>
              <Select value={errorLevel} onValueChange={setErrorLevel}>
                <SelectTrigger className="bg-input/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateQR}
            disabled={isGenerating || !text.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            size="lg"
          >
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </Button>

          {qrDataUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative p-4 bg-black rounded-lg border border-border/50">
                  <img
                    src={qrDataUrl || "/placeholder.svg"}
                    alt="Generated QR Code"
                    className="max-w-full h-auto"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                {navigator.share && (
                  <Button
                    onClick={shareQR}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Hidden canvas for download functionality */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CardContent>
      </Card>
    </div>
  )
}
