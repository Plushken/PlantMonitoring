export interface Article {
  id: string;
  name: string;
  description: string;
  imageUrl: any; // Changed to any to support both require() and string
  content: string;
  readTime: string;
  category: string;
  publishedDate: string;
}

export const articlesData: Article[] = [
  {
    id: '1',
    name: 'Importance of Ventilation',
    description: 'Learn how proper air circulation can save your plants from common diseases and promote healthy growth.',
    imageUrl: require('../assets/plant-ventilation.jpg'),
    content: `Proper ventilation is crucial for plant health and growth. Good air circulation helps prevent fungal diseases, reduces humidity levels, and strengthens plant stems.

Air movement helps plants by:
• Preventing stagnant air that can lead to mold and mildew
• Strengthening stems through gentle movement
• Improving gas exchange for photosynthesis
• Reducing pest infestations

For indoor plants, consider using fans or opening windows regularly. Outdoor plants benefit from proper spacing and pruning to allow air flow.

Remember, gentle air movement is best - strong winds can damage delicate plants and dry out soil too quickly.`,
    readTime: '5 min read',
    category: 'Plant Health',
    publishedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Watering Wisdom',
    description: 'Master the art of watering with these essential tips for keeping your plants perfectly hydrated.',
    imageUrl: require('../assets/plant-watering-close.jpg'),
    content: `Watering is both an art and a science. Understanding your plants' water needs is crucial for their survival and growth.

Key watering principles:
• Check soil moisture before watering
• Water deeply but less frequently
• Use room temperature water
• Water in the morning for best absorption

Signs of overwatering:
• Yellow leaves
• Musty smell from soil
• Fungal growth
• Root rot

Signs of underwatering:
• Wilting leaves
• Dry, cracked soil
• Brown leaf edges
• Stunted growth

Different plants have different water requirements. Succulents need less water than tropical plants, and seasonal changes affect watering frequency.`,
    readTime: '7 min read',
    category: 'Watering',
    publishedDate: '2024-01-20',
  },
  {
    id: '3',
    name: 'Light Requirements Guide',
    description: 'Discover how to provide the perfect lighting conditions for different types of plants.',
    imageUrl: require('../assets/plant-light-window.jpg'),
    content: `Light is the energy source for photosynthesis, making it essential for plant health. Understanding light requirements helps you place plants in optimal locations.

Types of light conditions:
• Full sun: 6+ hours of direct sunlight
• Partial sun: 4-6 hours of direct sunlight
• Partial shade: 2-4 hours of direct sunlight
• Full shade: Less than 2 hours of direct sunlight

For indoor plants:
• South-facing windows provide the most light
• East and west windows offer moderate light
• North windows provide low light
• Supplement with grow lights if needed

Signs of insufficient light:
• Leggy, stretched growth
• Pale or yellow leaves
• Reduced flowering
• Slow growth

Signs of too much light:
• Scorched or brown leaves
• Wilting in bright conditions
• Faded leaf colors`,
    readTime: '6 min read',
    category: 'Lighting',
    publishedDate: '2024-01-25',
  },
  {
    id: '4',
    name: 'Soil Science Basics',
    description: 'Understanding soil composition and how to create the perfect growing medium for your plants.',
    imageUrl: require('../assets/hands-soil.jpg'),
    content: `Soil is more than just dirt - it's a complex ecosystem that supports plant life. Understanding soil basics helps you provide the best foundation for your plants.

Soil components:
• Sand: Good drainage, poor water retention
• Clay: Poor drainage, good water retention
• Silt: Moderate drainage and water retention
• Organic matter: Nutrients and soil structure

Key soil properties:
• pH level (affects nutrient availability)
• Drainage (prevents root rot)
• Nutrient content (feeds plants)
• Soil structure (allows root growth)

Improving soil:
• Add compost for organic matter
• Use perlite for drainage
• Test and adjust pH levels
• Mulch to retain moisture

Different plants prefer different soil types. Cacti need well-draining sandy soil, while vegetables prefer rich, loamy soil with good organic content.`,
    readTime: '8 min read',
    category: 'Soil & Nutrients',
    publishedDate: '2024-02-01',
  },
  {
    id: '5',
    name: 'Fertilizing Fundamentals',
    description: 'Learn when, how, and what to feed your plants for optimal growth and flowering.',
    imageUrl: require('../assets/plant-nutrients.jpg'),
    content: `Fertilizing provides plants with essential nutrients for growth, flowering, and fruit production. Understanding fertilizer basics ensures healthy, thriving plants.

Primary nutrients:
• Nitrogen (N): Leaf and stem growth
• Phosphorus (P): Root development and flowering
• Potassium (K): Overall plant health and disease resistance

Secondary nutrients:
• Calcium: Cell wall strength
• Magnesium: Chlorophyll production
• Sulfur: Protein synthesis

Fertilizer types:
• Liquid fertilizers: Quick absorption
• Granular fertilizers: Slow release
• Organic fertilizers: Gentle, long-lasting
• Synthetic fertilizers: Fast-acting, precise

Fertilizing schedule:
• Spring: Begin regular feeding
• Summer: Continue feeding growing plants
• Fall: Reduce feeding frequency
• Winter: Stop fertilizing dormant plants

Always follow package instructions and avoid over-fertilizing, which can burn plants and harm the environment.`,
    readTime: '9 min read',
    category: 'Soil & Nutrients',
    publishedDate: '2024-02-10',
  },
  {
    id: '6',
    name: 'Pest Prevention & Control',
    description: 'Identify common plant pests and learn natural methods to keep your garden pest-free.',
    imageUrl: require('../assets/pest-prevention.jpg'),
    content: `Pest management is crucial for maintaining healthy plants. Early identification and prevention are more effective than treatment after infestation.

Common plant pests:
• Aphids: Tiny insects that suck plant juices
• Spider mites: Microscopic pests causing stippling
• Whiteflies: Small flying insects under leaves
• Scale insects: Hard or soft bumps on stems
• Thrips: Tiny insects causing silvery damage

Prevention methods:
• Inspect plants regularly
• Maintain good air circulation
• Avoid overwatering
• Remove infected plant material
• Encourage beneficial insects

Natural control methods:
• Neem oil spray
• Insecticidal soap
• Beneficial insects (ladybugs, lacewings)
• Companion planting
• Physical barriers

Treatment approaches:
• Identify the pest correctly
• Choose appropriate control method
• Apply treatments consistently
• Monitor effectiveness
• Adjust strategy if needed

Remember, healthy plants are more resistant to pests, so good cultural practices are your first line of defense.`,
    readTime: '10 min read',
    category: 'Plant Health',
    publishedDate: '2024-02-20',
  },
  {
    id: '7',
    name: 'Pruning Like a Pro',
    description: 'Master the art of pruning to promote healthy growth and beautiful plant shapes.',
    imageUrl: require('../assets/plant-pruning-shears.jpg'),
    content: `Pruning is essential for plant health, shape, and productivity. Proper pruning techniques encourage growth and prevent disease.

Benefits of pruning:
• Removes dead or diseased branches
• Improves air circulation
• Shapes plant appearance
• Encourages flowering and fruiting
• Controls plant size

When to prune:
• Late winter/early spring for most plants
• After flowering for spring bloomers
• Summer for rapid growers
• Remove dead material anytime

Pruning tools:
• Hand pruners: Small branches up to 1 inch
• Loppers: Branches 1-2 inches thick
• Pruning saw: Large branches
• Hedge shears: Formal hedges

Pruning techniques:
• Make clean cuts at 45-degree angles
• Cut just above growth nodes
• Remove suckers and water sprouts
• Thin overcrowded branches
• Never remove more than 1/3 of the plant

Always use clean, sharp tools to prevent disease transmission. Different plants have specific pruning requirements, so research your particular species.`,
    readTime: '7 min read',
    category: 'Plant Care',
    publishedDate: '2024-03-01',
  },
  {
    id: '8',
    name: 'Indoor Plant Paradise',
    description: 'Create a thriving indoor garden with the right plants and care techniques.',
    imageUrl: require('../assets/indoor-plants-unique.jpg'),
    content: `Indoor gardening brings nature inside and improves air quality while adding beauty to your home. Success requires understanding indoor conditions.

Best indoor plants for beginners:
• Pothos: Tolerates low light and neglect
• Snake plant: Requires minimal water
• Spider plant: Easy to propagate
• ZZ plant: Extremely drought tolerant
• Peace lily: Indicates water needs

Indoor challenges:
• Lower light levels
• Dry air from heating/cooling
• Limited space for root growth
• Less air circulation
• Temperature fluctuations

Solutions:
• Choose appropriate plants for light levels
• Use humidity trays or humidifiers
• Rotate plants regularly
• Group plants together
• Monitor temperature changes

Care adjustments:
• Water less frequently in winter
• Fertilize less than outdoor plants
• Watch for pest issues
• Repot when roots outgrow containers
• Clean leaves regularly for better photosynthesis

With proper plant selection and care, indoor gardens can thrive year-round and provide continuous enjoyment.`,
    readTime: '6 min read',
    category: 'Indoor Gardening',
    publishedDate: '2024-03-10',
  },
  {
    id: '9',
    name: 'Seasonal Plant Care',
    description: 'Adapt your plant care routine to the changing seasons for year-round success.',
    imageUrl: require('../assets/seasonal-garden.jpg'),
    content: `Plants have different needs throughout the year. Adjusting care routines seasonally ensures optimal health and growth.

Spring care:
• Resume regular watering and fertilizing
• Repot rootbound plants
• Start new plants from seeds or cuttings
• Gradually move indoor plants outside
• Begin pest monitoring

Summer care:
• Increase watering frequency
• Provide shade during extreme heat
• Deadhead flowers for continued blooming
• Harvest herbs and vegetables regularly
• Monitor for heat stress

Fall care:
• Reduce watering as growth slows
• Stop fertilizing most plants
• Bring tender plants indoors
• Plant spring-blooming bulbs
• Clean up fallen leaves

Winter care:
• Water sparingly but don't let plants dry out
• Protect plants from frost
• Reduce fertilizing or stop completely
• Provide extra humidity for indoor plants
• Plan next year's garden

Seasonal considerations:
• Day length affects plant growth
• Temperature changes influence water needs
• Humidity levels vary with weather
• Plant dormancy is natural
• Some plants need cold periods to flower

Understanding seasonal cycles helps you provide appropriate care throughout the year.`,
    readTime: '8 min read',
    category: 'Plant Care',
    publishedDate: '2024-03-20',
  },
  {
    id: '10',
    name: 'Plant Propagation Secrets',
    description: 'Multiply your plant collection with these proven propagation techniques.',
    imageUrl: require('../assets/propagation-cuttings.jpg'),
    content: `Plant propagation allows you to create new plants from existing ones. It's rewarding and expands your garden economically.

Propagation methods:
• Stem cuttings: Most common method
• Leaf cuttings: Great for succulents
• Division: For clumping plants
• Seeds: Genetic diversity
• Air layering: For difficult plants

Stem cutting process:
• Choose healthy, non-flowering stems
• Cut 4-6 inches below a node
• Remove lower leaves
• Dip in rooting hormone (optional)
• Plant in well-draining soil

Rooting conditions:
• Bright, indirect light
• Consistent moisture (not wet)
• Warm temperatures (65-75°F)
• High humidity
• Good air circulation

Success tips:
• Take cuttings in spring or early summer
• Use clean, sharp tools
• Change water regularly for water propagation
• Be patient - rooting takes time
• Not all cuttings will succeed

Different plants have different requirements:
• Herbs root quickly in water
• Succulents need to callus before rooting
• Woody plants may need rooting hormone
• Some plants prefer soil propagation

Propagation is a great way to share plants with friends and expand your collection affordably.`,
    readTime: '9 min read',
    category: 'Advanced Techniques',
    publishedDate: '2024-04-01',
  },
];

export const getArticleById = (id: string): Article | undefined => {
  return articlesData.find(article => article.id === id);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return articlesData.filter(article => article.category === category);
};

export const getFeaturedArticles = (count: number = 3): Article[] => {
  return articlesData.slice(0, count);
};

export const getRandomArticles = (count: number = 3): Article[] => {
  const shuffled = [...articlesData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 