# Responsive Design Components

This directory contains components and utilities for implementing responsive design in your React Native Web app. These components help your app adapt to different screen sizes and provide a consistent user experience across devices.

## Components

### ResponsiveContainer

A container component that adapts to different screen sizes and provides consistent padding and width.

```jsx
import { ResponsiveContainer } from '../components/responsive';

const MyComponent = () => {
  return (
    <ResponsiveContainer>
      <Text>This content will be responsive</Text>
    </ResponsiveContainer>
  );
};
```

Props:
- `fluid`: Boolean - If true, the container will take up 100% of the available width
- `maxWidth`: Number - Maximum width of the container (default: 1200)
- `padding`: Number or Object - Padding around the container
- `center`: Boolean - If true, the container will be centered horizontally

### ResponsiveGrid

A grid component that adapts to different screen sizes and provides a responsive layout.

```jsx
import { ResponsiveGrid } from '../components/responsive';

const MyComponent = () => {
  return (
    <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
      <View>Item 1</View>
      <View>Item 2</View>
      <View>Item 3</View>
      <View>Item 4</View>
    </ResponsiveGrid>
  );
};
```

Props:
- `columns`: Number or Object - Number of columns for different screen sizes
- `gap`: Number - Gap between grid items (default: 16)
- `alignItems`: String - Alignment of items along the cross axis
- `justifyContent`: String - Justification of items along the main axis

### ResponsiveText

A text component that adapts to different screen sizes and provides responsive font sizes.

```jsx
import { ResponsiveText } from '../components/responsive';

const MyComponent = () => {
  return (
    <ResponsiveText size={16} scale={1.5}>
      This text will be responsive
    </ResponsiveText>
  );
};
```

Props:
- `size`: Number - Base font size
- `scale`: Number - Scale factor for the font size
- `responsive`: Boolean - If true, the font size will be responsive

### ResponsiveImage

An image component that adapts to different screen sizes and provides responsive dimensions.

```jsx
import { ResponsiveImage } from '../components/responsive';

const MyComponent = () => {
  return (
    <ResponsiveImage 
      source={{ uri: 'https://example.com/image.jpg' }}
      aspectRatio={16/9}
      maxWidth={800}
    />
  );
};
```

Props:
- `aspectRatio`: Number - Aspect ratio of the image
- `maxWidth`: Number - Maximum width of the image
- `maxHeight`: Number - Maximum height of the image
- `responsive`: Boolean - If true, the image dimensions will be responsive

### ResponsiveNavigation

A navigation component that adapts to different screen sizes and provides a responsive navigation menu.

```jsx
import { ResponsiveNavigation } from '../components/responsive';

const MyComponent = () => {
  const navigationItems = [
    { label: 'Home', icon: 'home', onPress: () => {} },
    { label: 'Profile', icon: 'person', onPress: () => {} },
    { label: 'Settings', icon: 'settings', onPress: () => {} },
  ];

  return (
    <ResponsiveNavigation items={navigationItems} />
  );
};
```

Props:
- `items`: Array - Array of navigation items
- `mobileBreakpoint`: Number - Breakpoint for mobile navigation (default: 768)
- `showLabels`: Boolean - If true, labels will be shown alongside icons

## Hooks

### useResponsive

A hook that provides responsive values and screen size information.

```jsx
import { useResponsive } from '../hooks/useResponsive';

const MyComponent = () => {
  const { width, height, isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <View>
      <Text>Screen width: {width}</Text>
      <Text>Screen height: {height}</Text>
      <Text>Is mobile: {isMobile ? 'Yes' : 'No'}</Text>
      <Text>Is tablet: {isTablet ? 'Yes' : 'No'}</Text>
      <Text>Is desktop: {isDesktop ? 'Yes' : 'No'}</Text>
    </View>
  );
};
```

## Utilities

### Breakpoints

The following breakpoints are available:

- `xs`: 0px - Extra small devices (phones)
- `sm`: 576px - Small devices (tablets)
- `md`: 768px - Medium devices (tablets)
- `lg`: 992px - Large devices (desktops)
- `xl`: 1200px - Extra large devices (large desktops)
- `xxl`: 1400px - Extra extra large devices

### Responsive Functions

The following functions are available:

- `responsiveWidth`: Calculate responsive width based on percentage
- `responsiveHeight`: Calculate responsive height based on percentage
- `responsiveFontSize`: Calculate responsive font size
- `responsiveSpacing`: Calculate responsive spacing
- `getColumnCount`: Get number of columns based on screen size
- `isScreenSize`: Check if the current screen size is within a specific breakpoint range
- `addResizeListener`: Add a window resize listener

## Best Practices

1. Use the `ResponsiveContainer` component to wrap your main content
2. Use the `ResponsiveGrid` component for grid layouts
3. Use the `ResponsiveText` component for text that needs to be responsive
4. Use the `ResponsiveImage` component for images that need to be responsive
5. Use the `ResponsiveNavigation` component for navigation that needs to be responsive
6. Use the `useResponsive` hook to get responsive values and screen size information
7. Use the responsive utility functions for custom responsive calculations 