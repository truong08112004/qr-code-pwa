"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, CameraOff, Copy, ExternalLink, ScanLine, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsQR from "jsqr"

interface QRScannerProps {
  className?: string
}

export function QRScanner({ className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState("")
  const [error, setError] = useState("")
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number>()
  const { toast } = useToast()

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsScanning(false)
  }, [])

  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanQRCode)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      setScannedData(code.data)
      stopCamera()
      toast({
        title: "QR Code detected",
        description: "Successfully scanned QR code",
      })
    } else {
      animationRef.current = requestAnimationFrame(scanQRCode)
    }
  }, [isScanning, stopCamera, toast])

  const startCamera = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream
      setHasPermission(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)

        // Start scanning after video is ready
        videoRef.current.onloadedmetadata = () => {
          scanQRCode()
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setHasPermission(false)
      setError("Camera access denied or not available")
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async () => {
    if (!scannedData) return

    try {
      await navigator.clipboard.writeText(scannedData)
      toast({
        title: "Copied",
        description: "Scanned text copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const openLink = () => {
    if (!scannedData) return

    try {
      // Check if it's a valid URL
      const url = scannedData.startsWith("http") ? scannedData : `https://${scannedData}`
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "The scanned text is not a valid URL",
        variant: "destructive",
      })
    }
  }

  const isUrl = (text: string) => {
    try {
      new URL(text.startsWith("http") ? text : `https://${text}`)
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className={className}>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ScanLine className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Scan QR Code</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Use your camera to scan QR codes instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isScanning && !scannedData && (
            <div className="text-center space-y-4">
              {hasPermission === false && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                onClick={startCamera}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Camera className="h-5 w-5 mr-2" />
                Start Camera
              </Button>

              <p className="text-xs text-muted-foreground">Camera permission is required to scan QR codes</p>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative aspect-square max-w-sm mx-auto">
                <div className="camera-container">
                  <video ref={videoRef} className="w-full h-full object-cover rounded-lg" playsInline muted />
                  <div className="camera-overlay">
                    <div className="scan-area">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Position QR code within the frame</p>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  size="sm"
                  className="bg-secondary/50 hover:bg-secondary/70"
                >
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Camera
                </Button>
              </div>
            </div>
          )}

          {scannedData && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                <h3 className="font-medium text-sm mb-2 text-foreground">Scanned Result:</h3>
                <p className="text-sm break-all text-muted-foreground bg-background/50 p-3 rounded border">
                  {scannedData}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>

                {isUrl(scannedData) && (
                  <Button
                    onClick={openLink}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Link
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setScannedData("")
                    startCamera()
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70"
                >
                  <Camera className="h-4 w-4" />
                  Scan Again
                </Button>
              </div>
            </div>
          )}

          {/* Hidden canvas for QR code processing */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CardContent>
      </Card>
    </div>
  )
}
