import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getArticleById } from '../../data/articles';
import { BackIcon } from '../../components/shared/Icons';
import { Colors } from '../../config/theme';

export default function ArticleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const article = getArticleById(id as string);

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Article not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{article.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        <View style={styles.imageContainer}>
          <Image source={article.imageUrl} style={styles.articleImage} />
        </View>

        {/* Article Meta Info */}
        <View style={styles.metaContainer}>
          <Text style={styles.readTime}>{article.readTime}</Text>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.publishDate}>{new Date(article.publishedDate).toLocaleDateString()}</Text>
        </View>

        {/* Article Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.articleContent}>{article.content}</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  imageContainer: {
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  articleImage: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.backgroundSecondary,
  },
  metaContainer: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  readTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#899191',
  },
  category: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  publishDate: {
    fontSize: 12,
    fontWeight: '400',
    color: '#899191',
  },
  contentContainer: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  articleContent: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 1,
    color: '#2E3333',
    textAlign: 'left',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#899191',
  },
  bottomSpacer: {
    height: 40,
  },
}); 