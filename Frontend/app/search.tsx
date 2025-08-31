import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "./header/Header";
import { searchListings } from "./services/api";

// Define your search result interface
interface SearchResult {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  seller: {
    name: string;
    type: string;
  };
}

const SearchScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialQuery = params.query as string || "";
  const initialSellerType = params.sellerType as string || "Individual";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSellerType, setSelectedSellerType] = useState(initialSellerType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform search when component mounts or when parameters change
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery, initialSellerType);
    }
  }, [initialQuery, initialSellerType]);

  const handleSearch = async (query: string, sellerType: string) => {
    if (!query) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API to get search results
      const data = await searchListings(query, sellerType);
      
      // Update component state
      setSearchQuery(query);
      setSelectedSellerType(sellerType);
      setResults(data.results || []);
      
      // Update the URL to reflect the search
      router.replace({
        pathname: '/search',
        params: { query, sellerType }
      });
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to perform search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePress = () => {
    router.push("/profileDetails");
  };

  const renderSearchItem = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultTitle}>{item.title}</Text>
      <Text style={styles.resultPrice}>{item.price}</Text>
      <Text style={styles.resultSeller}>{item.seller.name} ({item.seller.type})</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        onSearch={handleSearch}
        onProfilePress={handleProfilePress}
      />

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2D4B3A" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : results.length === 0 ? (
          <Text style={styles.noResultsText}>
            {searchQuery ? "No results found. Try a different search term." : "Start searching to see results."}
          </Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderSearchItem}
            contentContainerStyle={styles.resultsList}
          />
        )}
          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2D4B3A",
    marginTop: 4,
  },
  resultSeller: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#FF0000",
  },
});

export default SearchScreen;