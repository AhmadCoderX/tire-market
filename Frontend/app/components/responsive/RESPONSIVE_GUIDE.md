# Implementing Responsive Design in Your React Native Web App

This guide will help you implement responsive design in your existing React Native Web app components. Follow these steps to make your app adapt to different screen sizes and provide a consistent user experience across devices.

## 1. Using the Responsive Hook

The `useResponsive` hook is the foundation of responsive design in your app. It provides information about the current screen size and device type, as well as utility functions for responsive calculations.

```jsx
import { useResponsive } from '../hooks/useResponsive';

const MyComponent = () => {
  const { 
    width, 
    height, 
    isMobile, 
    isTablet, 
    isDesktop,
    wp,
    hp,
    fs,
    spacing
  } = useResponsive();
  
  return (
    <View style={{
      padding: spacing(16),
      width: isMobile ? '100%' : wp(50),
    }}>
      <Text style={{ fontSize: fs(16) }}>
        This text will be responsive
      </Text>
    </View>
  );
};
```

## 2. Making Existing Components Responsive

### Step 1: Import the useResponsive hook

```jsx
import { useResponsive } from '../hooks/useResponsive';
```

### Step 2: Use the hook in your component

```jsx
const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, spacing } = useResponsive();
  
  // Use the responsive values in your component
  return (
    <View style={{
      flexDirection: isMobile ? 'column' : 'row',
      padding: spacing(16),
    }}>
      {/* Component content */}
    </View>
  );
};
```

### Step 3: Adjust styles based on screen size

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mobileContainer: {
    flexDirection: 'column',
  },
  desktopContainer: {
    flexDirection: 'row',
  },
});

const MyComponent = () => {
  const { isMobile } = useResponsive();
  
  return (
    <View style={[
      styles.container,
      isMobile ? styles.mobileContainer : styles.desktopContainer,
    ]}>
      {/* Component content */}
    </View>
  );
};
```

## 3. Implementing Responsive Layouts

### Using ResponsiveContainer

Wrap your main content with the `ResponsiveContainer` component to provide consistent padding and width.

```jsx
import { ResponsiveContainer } from '../components/responsive';

const MyPage = () => {
  return (
    <ResponsiveContainer>
      <View>
        {/* Page content */}
      </View>
    </ResponsiveContainer>
  );
};
```

### Using ResponsiveGrid

Use the `ResponsiveGrid` component to create responsive grid layouts.

```jsx
import { ResponsiveGrid } from '../components/responsive';

const MyGrid = () => {
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

## 4. Making Text Responsive

### Using ResponsiveText

Replace regular `Text` components with `ResponsiveText` components to make text responsive.

```jsx
import { ResponsiveText } from '../components/responsive';

const MyText = () => {
  return (
    <ResponsiveText size={16} scale={1.2}>
      This text will be responsive
    </ResponsiveText>
  );
};
```

### Using the fs function

Use the `fs` function from the `useResponsive` hook to calculate responsive font sizes.

```jsx
import { useResponsive } from '../hooks/useResponsive';

const MyText = () => {
  const { fs } = useResponsive();
  
  return (
    <Text style={{ fontSize: fs(16) }}>
      This text will be responsive
    </Text>
  );
};
```

## 5. Making Images Responsive

### Using ResponsiveImage

Replace regular `Image` components with `ResponsiveImage` components to make images responsive.

```jsx
import { ResponsiveImage } from '../components/responsive';

const MyImage = () => {
  return (
    <ResponsiveImage 
      source={{ uri: 'https://example.com/image.jpg' }}
      aspectRatio={16/9}
      maxWidth={800}
    />
  );
};
```

## 6. Making Navigation Responsive

### Using ResponsiveNavigation

Use the `ResponsiveNavigation` component to create responsive navigation menus.

```jsx
import { ResponsiveNavigation } from '../components/responsive';

const MyNavigation = () => {
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

## 7. Best Practices for Responsive Design

1. **Use Relative Units**: Use percentages, em, rem, and vw/vh units instead of fixed pixel values.
2. **Mobile-First Approach**: Design for mobile first, then add styles for larger screens.
3. **Flexible Layouts**: Use flexbox and grid layouts to create flexible, responsive layouts.
4. **Responsive Images**: Use responsive images that adapt to different screen sizes.
5. **Responsive Typography**: Use responsive typography that adapts to different screen sizes.
6. **Breakpoints**: Use breakpoints to define different layouts for different screen sizes.
7. **Test on Different Devices**: Test your app on different devices and screen sizes to ensure it looks good on all of them.

## 8. Common Responsive Patterns

### Responsive Sidebar

```jsx
const Sidebar = () => {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <View style={[
      styles.sidebar,
      isMobile && styles.mobileSidebar,
      isTablet && styles.tabletSidebar,
    ]}>
      {/* Sidebar content */}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  mobileSidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    transform: [{ translateX: -250 }],
  },
  tabletSidebar: {
    width: 200,
  },
});
```

### Responsive Header

```jsx
const Header = () => {
  const { isMobile } = useResponsive();
  
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>Logo</Text>
      </View>
      
      {isMobile ? (
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Icon name="menu" size={24} />
        </TouchableOpacity>
      ) : (
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navItem}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text>About</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isMobile && showMenu && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity style={styles.mobileMenuItem}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem}>
            <Text>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem}>
            <Text>About</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
```

### Responsive Cards

```jsx
const Card = () => {
  const { isMobile, isTablet, spacing } = useResponsive();
  
  return (
    <View style={[
      styles.card,
      {
        padding: spacing(16),
        marginBottom: spacing(16),
      },
    ]}>
      <Image 
        source={{ uri: 'https://example.com/image.jpg' }}
        style={[
          styles.image,
          {
            height: isMobile ? 150 : isTablet ? 200 : 250,
          },
        ]}
      />
      <Text style={[
        styles.title,
        {
          fontSize: isMobile ? 16 : isTablet ? 18 : 20,
        },
      ]}>
        Card Title
      </Text>
      <Text style={styles.description}>
        Card description goes here.
      </Text>
    </View>
  );
};
```

## 9. Testing Responsive Design

1. **Browser DevTools**: Use browser dev tools to test different screen sizes.
2. **Real Devices**: Test on real devices to ensure your app looks good on all of them.
3. **Responsive Testing Tools**: Use tools like BrowserStack or Responsively to test your app on different devices and screen sizes.

## 10. Conclusion

Implementing responsive design in your React Native Web app is essential for providing a consistent user experience across devices. By following the guidelines in this document, you can make your app adapt to different screen sizes and provide a great user experience on all devices. 