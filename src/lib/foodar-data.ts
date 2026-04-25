export type Food = {
  id: number;
  name: string;
  emoji: string;
  price: number;
  time: string;
  cat: string;
  rating: number;
  calories: number;
  protein: string;
  carbs: string;
  desc: string;
  available?: boolean;
  tags?: string[];
  allergens?: string[];
  isCustom?: boolean;
  customNote?: string;
  socialProof?: {
    orders: number;
    viewers: number;
    trending?: boolean;
    remaining?: number;
  };
  pairings?: number[];
  image: string;
  bgColor?: "mint" | "sky" | "beige";
};

export const foods: Food[] = [
  { 
    id: 1, name: "Chicken Burger", emoji: "🍔", price: 120, time: "5 min", cat: "Burger", rating: 4.8, calories: 540, protein: "32g", carbs: "44g", 
    desc: "Juicy grilled chicken with lettuce, tomato & our secret sauce.", 
    tags: ["Non-Veg", "High Protein"], allergens: ["Gluten", "Dairy"],
    socialProof: { orders: 23, viewers: 5, trending: true },
    pairings: [6, 4],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    bgColor: "mint"
  },
  { 
    id: 2, name: "Margherita Pizza", emoji: "🍕", price: 250, time: "10 min", cat: "Pizza", rating: 4.6, calories: 720, protein: "28g", carbs: "80g", 
    desc: "Classic wood-fired pizza with fresh mozzarella & basil.", 
    tags: ["Veg"], allergens: ["Gluten", "Dairy"],
    socialProof: { orders: 11, viewers: 8 },
    pairings: [6, 5],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
    bgColor: "sky"
  },
  { 
    id: 3, name: "Veg Wrap", emoji: "🌯", price: 90, time: "7 min", cat: "Wrap", rating: 4.5, calories: 380, protein: "12g", carbs: "42g", 
    desc: "Fresh veggies, hummus & crunchy lettuce in a soft tortilla.", 
    tags: ["Veg", "Healthy", "Low Cal"], allergens: [],
    socialProof: { orders: 7, viewers: 3 },
    pairings: [6],
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
    bgColor: "beige"
  },
  { 
    id: 4, name: "Spicy Wings", emoji: "🍗", price: 180, time: "8 min", cat: "Snacks", rating: 4.7, calories: 620, protein: "38g", carbs: "18g", 
    desc: "6 crispy wings tossed in our signature hot sauce.", 
    available: true,
    tags: ["Non-Veg", "Spicy"], allergens: [],
    socialProof: { orders: 18, viewers: 6, remaining: 3 },
    pairings: [6, 1],
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800",
    bgColor: "mint"
  },
  { 
    id: 5, name: "Pasta Arrabbiata", emoji: "🍝", price: 200, time: "12 min", cat: "Pasta", rating: 4.4, calories: 580, protein: "18g", carbs: "72g", 
    desc: "Penne in spicy tomato sauce with fresh herbs & parmesan.", 
    tags: ["Veg"], allergens: ["Gluten"],
    socialProof: { orders: 9, viewers: 4 },
    pairings: [2],
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800",
    bgColor: "sky"
  },
  { 
    id: 6, name: "Cold Coffee", emoji: "☕", price: 80, time: "3 min", cat: "Drinks", rating: 4.9, calories: 180, protein: "6g", carbs: "22g", 
    desc: "Rich cold brew blended with milk and a hint of caramel.", 
    tags: ["Veg"], allergens: ["Dairy"],
    socialProof: { orders: 31, viewers: 12, trending: true },
    pairings: [1],
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=800",
    bgColor: "beige"
  },
];

export const categories = ["All", "Burger", "Pizza", "Wrap", "Snacks", "Pasta", "Drinks"];

