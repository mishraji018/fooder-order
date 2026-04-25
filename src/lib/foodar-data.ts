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
};

export const foods: Food[] = [
  { id: 1, name: "Chicken Burger", emoji: "🍔", price: 120, time: "5 min", cat: "Burger", rating: 4.8, calories: 540, protein: "32g", carbs: "44g", desc: "Juicy grilled chicken with lettuce, tomato & our secret sauce." },
  { id: 2, name: "Margherita Pizza", emoji: "🍕", price: 250, time: "10 min", cat: "Pizza", rating: 4.6, calories: 720, protein: "28g", carbs: "80g", desc: "Classic wood-fired pizza with fresh mozzarella & basil." },
  { id: 3, name: "Veg Wrap", emoji: "🌯", price: 90, time: "7 min", cat: "Wrap", rating: 4.5, calories: 380, protein: "12g", carbs: "42g", desc: "Fresh veggies, hummus & crunchy lettuce in a soft tortilla." },
  { id: 4, name: "Spicy Wings", emoji: "🍗", price: 180, time: "8 min", cat: "Snacks", rating: 4.7, calories: 620, protein: "38g", carbs: "18g", desc: "6 crispy wings tossed in our signature hot sauce." },
  { id: 5, name: "Pasta Arrabbiata", emoji: "🍝", price: 200, time: "12 min", cat: "Pasta", rating: 4.4, calories: 580, protein: "18g", carbs: "72g", desc: "Penne in spicy tomato sauce with fresh herbs & parmesan." },
  { id: 6, name: "Cold Coffee", emoji: "☕", price: 80, time: "3 min", cat: "Drinks", rating: 4.9, calories: 180, protein: "6g", carbs: "22g", desc: "Rich cold brew blended with milk and a hint of caramel." },
];

export const categories = ["All", "Burger", "Pizza", "Wrap", "Snacks", "Pasta", "Drinks"];

