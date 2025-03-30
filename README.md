# GitHub Profile Visualizer

A powerful and customizable tool to visualize GitHub contribution data in beautiful, interactive formats. Transform your GitHub activity into stunning visualizations that can be embedded in your portfolio, shared on social media, or used in presentations.

![GitHub Profile Visualizer](https://github.com/profile/visualizer.png)

## Features

### Multiple Visualization Types
- **Skyline View**: 3D cityscape visualization of your GitHub contributions
- **Calendar View**: Traditional GitHub-style contribution calendar
- **Bar Chart**: Visualize contributions as customizable bar charts
- **Line Chart**: Track contribution trends over time
- **Heatmap**: Density-based visualization of contribution activity

### Customization Options
- **Color Themes**: Choose from multiple color palettes (cyberpunk, gradient, holographic, sunset, ocean)
- **Environment Styles**: Customize your skyline with different environments (city, nature, mountains, desert, night)
- **Building Styles**: Select from various building styles (modern, retro, futuristic, pixel art, abstract, skyscraper)
- **Visual Effects**: Toggle reflections, particles, and adjust rotation speed
- **Layout Options**: Control legend visibility, animation settings, and more

### Export & Sharing
- **Responsive Embed**: Generate embed code that maintains aspect ratio on any device
- **Multiple Aspect Ratios**: Export in 16:9, 1:1, 9:16 and other formats
- **Size Options**: Choose from various export sizes optimized for different platforms
- **Social Media Presets**: Ready-to-share formats for Twitter, Instagram, LinkedIn
- **Interactive Preview**: See how exports will look before generating

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/github-profile-visualizer.git
cd github-profile-visualizer
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a GitHub username in the search field
2. Select a visualization type from the available options
3. Customize the visualization using the settings panel
4. Use the export options to save or share your visualization

### Embedding in Your Website

The "Copy Embed" button generates responsive iframe code that you can paste into your website or portfolio:

```html
<iframe src="https://github-profile-visualizer.vercel.app/embed?username=yourusername&visualType=skyline&colorPalette=cyberpunk" width="100%" height="500" style="border:0; max-width:100%;" allow="fullscreen"></iframe>
```

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **React Three Fiber**: React renderer for Three.js
- **Three.js**: 3D library for creating and displaying 3D computer graphics
- **shadcn/ui**: UI component library built with Radix UI and Tailwind CSS
- **TypeScript**: Type-safe JavaScript
- **GitHub API**: For fetching user contribution data

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
  - `/visualizations`: Different visualization components
  - `/ui`: UI components built with shadcn/ui
- `/contexts`: React context providers
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and helpers
- `/public`: Static assets
- `/styles`: Global CSS styles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GitHub for providing the contribution data API
- Three.js community for 3D visualization resources
- shadcn/ui for the beautiful UI components
