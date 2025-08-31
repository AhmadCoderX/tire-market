export const styles = {
    // Modal container
    modalOverlay: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-fade-in",
    modalContent: "bg-pricing-background rounded-xl max-w-4xl w-full p-6 relative animate-fade-in",
  
    // Close button
    closeButton: "absolute right-4 top-4 p-2 hover:bg-pricing-card rounded-lg transition-colors",
    closeIcon: "h-5 w-5 text-pricing-text",
  
    // Header section
    header: "text-center mb-8",
    title: "text-3xl font-bold mb-6 text-pricing-text",
  
    // Toggle section
    toggleContainer: "inline-flex items-center bg-pricing-card rounded-lg p-1",
    toggleButton: (isActive: boolean) => `
      px-6 py-2 rounded-md text-sm font-medium transition-colors
      ${isActive ? "bg-pricing-primary text-pricing-background" : "text-pricing-text/60 hover:text-pricing-text/80"}
    `,
  
    // Pricing cards container
    cardsContainer: "grid md:grid-cols-2 gap-6",
  
    // Card common styles
    card: (isPremium: boolean) => `
      border rounded-xl overflow-hidden
      ${isPremium ? "bg-pricing-card" : "bg-pricing-background"}
    `,
    cardHeader: "p-6",
    cardTitle: "text-2xl font-bold mb-1 text-pricing-text",
    cardPrice: "text-4xl font-bold text-pricing-text",
  
    // Features list
    featuresList: "space-y-4 text-lg p-6",
    featureItem: "text-pricing-text",
  
    // Action buttons
    buttonContainer: "p-6",
    currentPlanButton: `
      w-full text-pricing-primary bg-pricing-muted hover:bg-pricing-muted/90 
      text-lg py-6 rounded-lg font-medium transition-colors
    `,
    upgradeButton: `
      w-full bg-pricing-primary hover:bg-pricing-primary-hover text-white 
      text-lg py-6 rounded-lg font-medium transition-colors
    `,
  }
  
  