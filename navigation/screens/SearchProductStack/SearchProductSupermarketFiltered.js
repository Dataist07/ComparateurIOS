
import React, { useEffect,useState } from "react";

import {
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ActionSheetIOS,
  
} from "react-native";
import { MemoizedItem } from "./MemoizedItem";


const SearchProductSupermarketFiltered = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmSelection, setConfirmSelection] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [sortOption, setSortOption] = useState({ sortBy: "prix_produit", sortOrder: "asc" });

  const allItems = data.flatMap((items) => items);

  const handleSearchQuery = () => {
    setConfirmSelection(true);
    setLoading(true);

    // Simulate a loading indicator for 2 seconds
    setTimeout(() => {
      const filteredData = searchQuery
        ? allItems.filter((item) => {
            const itemDataWithoutAccent = item.nom_produit
              ? item.nom_produit.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ")
              : "";
            const textParts = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ");

            return textParts.every((part) => itemDataWithoutAccent.some((itemPart) => itemPart.startsWith(part)));
          })
        : [];

      setFilteredData(filteredData);
      setLoading(false);
    }, 1); // 1/1000 seconds
  };

  const handleSortOption = (index) => {
    setSortOption(sortOptions[index].value);
  };

  // Sort the data based on sortOption
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption.sortBy === "prix_produit") {
      return sortOption.sortOrder === "asc" ? a.prix_produit - b.prix_produit : b.prix_produit - a.prix_produit;
    } else if (sortOption.sortBy === "prix_ratio") {
      // Use "prix_ratio" for sorting by "Prix à l'unité décroissant"
      return sortOption.sortOrder === "asc" ? a.prix_ratio - b.prix_ratio : b.prix_ratio - a.prix_ratio;
    }
  });



  // Options for sorting
  const sortOptions = [
    { label: "Prix croissant", value: { sortBy: "prix_produit", sortOrder: "asc" } },
    { label: "Prix décroissant", value: { sortBy: "prix_produit", sortOrder: "desc" } },
    { label: "Prix à l'unité croissant", value: { sortBy: "prix_ratio", sortOrder: "asc" } },
    { label: "Prix à l'unité décroissant", value: { sortBy: "prix_ratio", sortOrder: "desc" } },
  ];

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: sortOptions.map((option) => option.label),
        cancelButtonIndex: sortOptions.length,
      },
      (buttonIndex) => {
        if (buttonIndex !== sortOptions.length ) {
          handleSortOption(buttonIndex);
        }
      }
    );
  };


  return (
    <SafeAreaView>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
            placeholder="Nom produit"
          />
          <Button title={"Entrer"} onPress={handleSearchQuery} style={styles.searchButton} />
        </View>
        {confirmSelection === false ? (
          <View style={styles.indicator}>
            <Text>Cherchez vos produit</Text>
          </View>
        ) : loading ? (
          // Render ActivityIndicator while loading is true
          <View style={styles.indicator}>
            <ActivityIndicator />
            <Text>Chargement</Text>
          </View>
        ) : sortedData.length > 0 ? (
          <>
            <View style={styles.sortContainer}>
              <TouchableOpacity onPress={showActionSheet} style={styles.sortButton}>
                <Text>Trier</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={sortedData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MemoizedItem item={item} />} // Use the MemoizedItem component
              estimatedItemSize={300}
            />
          </>
        ) : (
          <View style={styles.indicator}>
            <Text>Produit pas trouvé </Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  searchContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex:1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton:{
    backgroundColor:'#007AFF',
    borderRadius:5,
    marginLeft:10,
    paddingHorizontal:10,
    paddingVertical:5
  },
  indicator: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  sortContainer: {
    flexDirection: "row",
    marginHorizontal : 10,
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default SearchProductSupermarketFiltered;
