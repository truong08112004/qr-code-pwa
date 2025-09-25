# QR Code PWA

A modern Progressive Web App for generating and scanning QR codes, built with Next.js and React.

## Features

- **QR Code Generator**: Create QR codes from text, URLs, or any string input
- **QR Code Scanner**: Scan QR codes using your device's camera
- **Progressive Web App**: Install on your device for offline access
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern dark interface with green accent colors
- **Offline Support**: Service worker enables offline functionality

## Live Demo

**[https://qr-code-pwa.vercel.app/](https://qr-code-pwa.vercel.app/)**

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **QRCode.js** - QR code generation
- **jsQR** - QR code scanning
- **PWA** - Service worker and manifest for app-like experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/truong08112004/v0-qr-code-pwa.git
cd v0-qr-code-pwa
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Usage

### Generating QR Codes
1. Navigate to the "Generate" tab
2. Enter your text, URL, or any string
3. Customize the size and error correction level
4. Download the generated QR code image

### Scanning QR Codes
1. Navigate to the "Scan" tab
2. Allow camera permissions when prompted
3. Point your camera at a QR code
4. The decoded content will be displayed automatically

## PWA Installation

The app can be installed on your device:

1. **Desktop**: Look for the install icon in your browser's address bar
2. **Mobile**: Use "Add to Home Screen" from your browser menu
3. **Automatic**: The app will prompt you to install when criteria are met

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with PWA metadata
│   ├── page.tsx           # Main app page with tabs
│   └── globals.css        # Global styles and theme
├── components/            # React components
│   ├── qr-generator.tsx   # QR code generation component
│   ├── qr-scanner.tsx     # QR code scanning component
│   ├── pwa-install.tsx    # PWA installation prompt
│   └── ui/               # Reusable UI components
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service worker
│   └── icons/           # App icons
└── package.json         # Dependencies and scripts
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/truong08112004/v0-qr-code-pwa/issues) on GitHub.
