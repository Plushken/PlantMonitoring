import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { articlesData, Article } from '../data/articles';
import { BackIcon } from '../components/shared/Icons';
import { navigateToArticle } from '../utils/navigation-utils';
import { Colors } from '../config/theme';

const ArticleCard = ({ article, onPress }: { article: Article; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.articleCard} onPress={onPress}>
      <Image source={article.imageUrl} style={styles.articleCardImage} />
      <View style={styles.articleCardContent}>
        <Text style={styles.articleCardTitle}>{article.name}</Text>
        <Text style={styles.articleCardDescription} numberOfLines={2}>
          {article.description}
        </Text>
        <View style={styles.articleCardMeta}>
          <Text style={styles.articleCardCategory}>{article.category}</Text>
          <Text style={styles.articleCardReadTime}>{article.readTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ArticlesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Plant Health', 'Watering', 'Lighting', 'Soil & Nutrients', 'Plant Care', 'Indoor Gardening', 'Advanced Techniques'];
  
  const filteredArticles = selectedCategory === 'All' 
    ? articlesData 
    : articlesData.filter(article => article.category === selectedCategory);

  const handleArticlePress = (articleId: string) => {
    navigateToArticle(router, articleId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Green Blog</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryContent}
        >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.selectedCategoryButtonText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      {/* Articles List */}
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={() => handleArticlePress(item.id)}
          />
        )}
        style={styles.articlesList}
        contentContainerStyle={styles.articlesListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  categoryContainer: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  categoryContent: {
    paddingHorizontal: 14,
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.border,
    marginRight: 8,
    alignSelf: 'flex-start',
    minWidth: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  selectedCategoryButtonText: {
    color: Colors.textOnPrimary,
  },
  articlesList: {
    flex: 1,
  },
  articlesListContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  articleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
    overflow: 'hidden',
  },
  articleCardImage: {
    width: 120,
    height: 120,
    backgroundColor: Colors.backgroundSecondary,
  },
  articleCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  articleCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  articleCardDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  articleCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  articleCardCategory: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.primary,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  articleCardReadTime: {
    fontSize: 10,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
}); 