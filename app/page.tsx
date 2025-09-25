"use client"

import { useState } from "react"
import { QRGenerator } from "@/components/qr-generator"
import { QRScanner } from "@/components/qr-scanner"
import { PWAInstall } from "@/components/pwa-install"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, ScanLine, Sparkles } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <QrCode className="h-8 w-8 text-primary" />
                <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">QR Tools</h1>
                <p className="text-sm text-muted-foreground">Generate & Scan QR Codes</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:block">PWA Ready</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 space-y-4">
            <h2 className="text-4xl font-bold text-balance bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              QR Code Tools
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-lg mx-auto">
              Create QR codes from any text or URL, and scan QR codes instantly with your camera
            </p>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger
                value="generate"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <QrCode className="h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="scan"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ScanLine className="h-4 w-4" />
                Scan
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="generate" className="mt-0">
              <QRGenerator />
            </TabsContent>

            <TabsContent value="scan" className="mt-0">
              <QRScanner />
            </TabsContent>
          </Tabs>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-card/30 border border-border/50 backdrop-blur-sm">
              <QrCode className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Generate QR Codes</h3>
              <p className="text-sm text-muted-foreground">
                Create QR codes from text, URLs, or any content with customizable size and error correction
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card/30 border border-border/50 backdrop-blur-sm">
              <ScanLine className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Scan QR Codes</h3>
              <p className="text-sm text-muted-foreground">
                Use your device camera to instantly scan and decode QR codes with automatic link detection
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with Next.js • PWA Ready • Works Offline</p>
          </div>
        </div>
      </footer>

      <PWAInstall />
      <Toaster />
    </div>
  )
}
