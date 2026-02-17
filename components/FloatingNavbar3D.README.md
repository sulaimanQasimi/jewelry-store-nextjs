# 3D Floating Navbar Component

A modern, responsive navigation bar with glassmorphism effects and 3D transforms built with React and Tailwind CSS.

## Features

- ✨ **Glassmorphism Effect**: Beautiful backdrop blur with semi-transparent background
- 🎯 **3D Transform**: Perspective tilt with `preserve-3d` for depth
- 🎨 **Interactive Hover Effects**: Links pop forward in 3D space on hover
- 🌊 **Dynamic Shadows**: Shadows shift based on mouse position and 3D tilt
- 📱 **Fully Responsive**: Mobile-friendly menu that collapses on smaller screens
- ⚡ **Performance Optimized**: Uses `requestAnimationFrame` for smooth animations
- 🎭 **Dark Mode Support**: Works seamlessly with dark mode

## Usage

### Basic Example

```tsx
import FloatingNavbar3D from '@/components/FloatingNavbar3D'

export default function Layout() {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return <FloatingNavbar3D links={links} />
}
```

### With Logo and Icons

```tsx
import FloatingNavbar3D from '@/components/FloatingNavbar3D'
import { Home, User, Settings } from 'lucide-react'

export default function Layout() {
  const links = [
    { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
  ]

  const logo = (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
  )

  return <FloatingNavbar3D links={links} logo={logo} />
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `links` | `NavLink[]` | Default links | Array of navigation links |
| `logo` | `React.ReactNode` | `undefined` | Optional logo component |
| `className` | `string` | `''` | Additional CSS classes |

### NavLink Interface

```typescript
interface NavLink {
  label: string      // Link text
  href: string      // Link URL
  icon?: React.ReactNode  // Optional icon component
}
```

## Technical Details

### 3D Effects

- Uses CSS `transform-style: preserve-3d` for 3D context
- Applies `rotateX(8deg)` for perspective tilt
- Links use `translateZ()` for depth on hover
- Dynamic shadow positioning based on mouse movement

### Performance

- Uses `requestAnimationFrame` for smooth mouse tracking
- CSS transitions with `cubic-bezier` easing
- Hardware-accelerated transforms
- Minimal re-renders with React state management

### Responsive Breakpoints

- **Desktop (md+)**: Full horizontal navigation with all links visible
- **Mobile (< md)**: Hamburger menu that expands to show links vertically

## Styling

The component uses Tailwind CSS with arbitrary values for 3D transforms:

- `translateZ()` for depth
- `rotateX()` and `rotateY()` for perspective
- `backdrop-blur-xl` for glassmorphism
- Custom shadow calculations for dynamic depth

## Browser Support

- Modern browsers with CSS 3D transforms support
- Backdrop filter support for glassmorphism (gracefully degrades)
- Works best in Chrome, Firefox, Safari, and Edge

## Demo

Visit `/demo-navbar` to see a live demo of the component in action.
