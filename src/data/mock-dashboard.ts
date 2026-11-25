export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type ContactStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome?: boolean;
  productCount: number;
  createdAt: string;
}

export interface MockPackOption {
  label: string;
  price: number;
  originalPrice?: number;
}

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  shortTag: string;
  badge: string | null;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number | null;
  unit: string;
  stock: number;
  deliveryDays: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  packOptions: MockPackOption[];
  createdAt: string;
}

export interface MockOrderItem {
  id: string;
  productName: string;
  selectedPack: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  receiverName: string;
  receiverPhone: string;
  district: string;
  fullAddress: string;
  whatsappNumber: string;
  orderNote: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: "COD";
  status: OrderStatus;
  items: MockOrderItem[];
  createdAt: string;
}

export interface MockReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface MockContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminReply: string;
  repliedAt: string | null;
  createdAt: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
}

export const MOCK_DASHBOARD_STATS = {
  users: { total: 486, users: 482, admins: 4, blocked: 6 },
  catalog: { categories: 6, products: 24, activeProducts: 22, lowStockProducts: 3 },
  orders: {
    total: 184,
    pending: 14,
    processing: 22,
    inTransit: 19,
    delivered: 121,
    cancelled: 8,
    totalRevenue: 248650,
    activeOrderValue: 74200,
  },
  reviews: { total: 316, pendingApproval: 4 },
  contacts: { total: 42, unread: 5 },
};

export const MOCK_MONTHLY_CHART = [
  { month: "Jun", revenue: 28400, orders: 21 },
  { month: "Jul", revenue: 34200, orders: 26 },
  { month: "Aug", revenue: 39800, orders: 31 },
  { month: "Sep", revenue: 44500, orders: 34 },
  { month: "Oct", revenue: 48900, orders: 35 },
  { month: "Nov", revenue: 52850, orders: 37 },
];

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: "cat-1",
    name: "Packaged Bhorta & Shutki",
    slug: "shutki-bhorta",
    subtitle: "Ready-to-eat Churi, Loitta & Chepa Shutki bhorta",
    sortOrder: 1,
    isActive: true,
    productCount: 6,
    createdAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "cat-2",
    name: "Homemade Achar & Chutney",
    slug: "achar-chutney",
    subtitle: "Sun-dried mango, olive & tamarind pickles",
    sortOrder: 2,
    isActive: true,
    productCount: 5,
    createdAt: "2026-10-13T10:00:00Z",
  },
  {
    id: "cat-3",
    name: "Pure Ghee & Mustard Oil",
    slug: "ghee-oil",
    subtitle: "First-press ghani oil & granular gawa ghee",
    sortOrder: 3,
    isActive: true,
    productCount: 4,
    createdAt: "2026-10-14T10:00:00Z",
  },
  {
    id: "cat-4",
    name: "Date Jaggery & Honey",
    slug: "gur-honey",
    subtitle: "Winter patali gur & Sundarbans raw honey",
    sortOrder: 4,
    isActive: true,
    productCount: 4,
    createdAt: "2026-10-15T10:00:00Z",
  },
  {
    id: "cat-5",
    name: "Whole & Ground Spices",
    slug: "village-spices",
    subtitle: "Village-milled turmeric, chili & coriander",
    sortOrder: 5,
    isActive: true,
    productCount: 3,
    createdAt: "2026-10-16T10:00:00Z",
  },
  {
    id: "cat-6",
    name: "Probashi Family Combo",
    slug: "probashi-combo",
    subtitle: "Curated gift packs for your family back home",
    sortOrder: 6,
    isActive: true,
    productCount: 2,
    createdAt: "2026-10-17T10:00:00Z",
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "prod-1",
    name: "Special Churi Shutki Bhorta (Ready Pack)",
    slug: "churi-shutki-bhorta",
    shortTag: "Best Seller",
    badge: "Best Seller",
    categoryId: "cat-1",
    categoryName: "Packaged Bhorta & Shutki",
    price: 320,
    originalPrice: 380,
    unit: "250g",
    stock: 40,
    deliveryDays: "4-7 Days",
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isActive: true,
    packOptions: [
      { label: "250g", price: 320, originalPrice: 380 },
      { label: "500g", price: 610, originalPrice: 720 },
      { label: "1kg", price: 1180, originalPrice: 1400 },
    ],
    createdAt: "2026-10-20T09:00:00Z",
  },
  {
    id: "prod-2",
    name: "Pure Granular Gawa Ghee",
    slug: "pure-gawa-ghee",
    shortTag: "100% Pure",
    badge: "100% Pure",
    categoryId: "cat-3",
    categoryName: "Pure Ghee & Mustard Oil",
    price: 780,
    originalPrice: 850,
    unit: "500g",
    stock: 4,
    deliveryDays: "4-7 Days",
    rating: 4.9,
    reviewCount: 98,
    isFeatured: true,
    isActive: true,
    packOptions: [
      { label: "250g", price: 420, originalPrice: 460 },
      { label: "500g", price: 780, originalPrice: 850 },
      { label: "1kg", price: 1500, originalPrice: 1650 },
    ],
    createdAt: "2026-10-21T09:00:00Z",
  },
  {
    id: "prod-3",
    name: "Jashore Patali Date Jaggery",
    slug: "jashore-patali-gur",
    shortTag: "Seasonal Special",
    badge: "Fresh Batch",
    categoryId: "cat-4",
    categoryName: "Date Jaggery & Honey",
    price: 450,
    originalPrice: 520,
    unit: "1kg",
    stock: 30,
    deliveryDays: "4-7 Days",
    rating: 4.8,
    reviewCount: 76,
    isFeatured: true,
    isActive: true,
    packOptions: [
      { label: "500g", price: 240, originalPrice: 280 },
      { label: "1kg", price: 450, originalPrice: 520 },
      { label: "2kg", price: 860, originalPrice: 980 },
    ],
    createdAt: "2026-10-22T09:00:00Z",
  },
  {
    id: "prod-4",
    name: "Sun-Dried Tok Jhal Mango Achar",
    slug: "tok-jhal-mango-achar",
    shortTag: "Homemade",
    badge: null,
    categoryId: "cat-2",
    categoryName: "Homemade Achar & Chutney",
    price: 290,
    originalPrice: 340,
    unit: "400g",
    stock: 3,
    deliveryDays: "4-7 Days",
    rating: 4.7,
    reviewCount: 54,
    isFeatured: false,
    isActive: true,
    packOptions: [
      { label: "400g", price: 290, originalPrice: 340 },
      { label: "800g", price: 550, originalPrice: 640 },
    ],
    createdAt: "2026-10-23T09:00:00Z",
  },
  {
    id: "prod-5",
    name: "Sundarbans Raw Forest Honey",
    slug: "sundarbans-raw-honey",
    shortTag: "Wild Harvest",
    badge: "New",
    categoryId: "cat-4",
    categoryName: "Date Jaggery & Honey",
    price: 650,
    originalPrice: 750,
    unit: "500g",
    stock: 22,
    deliveryDays: "4-7 Days",
    rating: 4.9,
    reviewCount: 64,
    isFeatured: true,
    isActive: true,
    packOptions: [
      { label: "250g", price: 350, originalPrice: 400 },
      { label: "500g", price: 650, originalPrice: 750 },
    ],
    createdAt: "2026-10-24T09:00:00Z",
  },
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ord-1",
    orderNumber: "BB-2026-104218",
    receiverName: "Md. Rashedul Islam",
    receiverPhone: "01712345678",
    district: "Dhaka",
    fullAddress: "House 14, Road 6, Mirpur-10, Dhaka",
    whatsappNumber: "+8801712345678",
    orderNote: "Call 15 mins before delivery",
    subtotal: 1420,
    deliveryCharge: 120,
    total: 1540,
    paymentMethod: "COD",
    status: "IN_TRANSIT",
    items: [
      {
        id: "oi-1",
        productName: "Special Churi Shutki Bhorta (Ready Pack)",
        selectedPack: "250g",
        quantity: 2,
        unitPrice: 320,
        lineTotal: 640,
      },
      {
        id: "oi-2",
        productName: "Pure Granular Gawa Ghee",
        selectedPack: "500g",
        quantity: 1,
        unitPrice: 780,
        lineTotal: 780,
      },
    ],
    createdAt: "2026-11-24T11:30:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "BB-2026-104195",
    receiverName: "Rokeya Begum",
    receiverPhone: "01819223344",
    district: "Cumilla",
    fullAddress: "Station Road, Sadar, Cumilla",
    whatsappNumber: "+971504455667",
    orderNote: "Gift pack for parents",
    subtotal: 900,
    deliveryCharge: 120,
    total: 1020,
    paymentMethod: "COD",
    status: "PENDING",
    items: [
      {
        id: "oi-3",
        productName: "Jashore Patali Date Jaggery",
        selectedPack: "1kg",
        quantity: 2,
        unitPrice: 450,
        lineTotal: 900,
      },
    ],
    createdAt: "2026-11-24T09:15:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "BB-2026-104160",
    receiverName: "Tanvir Ahmed",
    receiverPhone: "01911887766",
    district: "Sylhet",
    fullAddress: "Zindabazar, Block B, Sylhet",
    whatsappNumber: "",
    orderNote: "",
    subtotal: 650,
    deliveryCharge: 120,
    total: 770,
    paymentMethod: "COD",
    status: "PROCESSING",
    items: [
      {
        id: "oi-4",
        productName: "Sundarbans Raw Forest Honey",
        selectedPack: "500g",
        quantity: 1,
        unitPrice: 650,
        lineTotal: 650,
      },
    ],
    createdAt: "2026-11-23T16:40:00Z",
  },
  {
    id: "ord-4",
    orderNumber: "BB-2026-104088",
    receiverName: "Nusrat Jahan",
    receiverPhone: "01677334455",
    district: "Chattogram",
    fullAddress: "Nasirabad Housing Society, Road 3",
    whatsappNumber: "",
    orderNote: "",
    subtotal: 580,
    deliveryCharge: 120,
    total: 700,
    paymentMethod: "COD",
    status: "DELIVERED",
    items: [
      {
        id: "oi-5",
        productName: "Sun-Dried Tok Jhal Mango Achar",
        selectedPack: "400g",
        quantity: 2,
        unitPrice: 290,
        lineTotal: 580,
      },
    ],
    createdAt: "2026-11-20T14:20:00Z",
  },
];

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    productName: "Special Churi Shutki Bhorta (Ready Pack)",
    customerName: "Farhana Akter",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    comment: "Authentic village taste and super clean vacuum packaging. Zero smell leak!",
    isApproved: true,
    createdAt: "2026-11-24T08:10:00Z",
  },
  {
    id: "rev-2",
    productId: "prod-2",
    productName: "Pure Granular Gawa Ghee",
    customerName: "Kamrul Hasan",
    location: "Dubai, UAE (Ordered for Bogura)",
    rating: 5,
    comment: "Sent this to my parents in Bogura. Very rich aroma and genuine granular texture.",
    isApproved: true,
    createdAt: "2026-11-22T18:45:00Z",
  },
  {
    id: "rev-3",
    productId: "prod-3",
    productName: "Jashore Patali Date Jaggery",
    customerName: "Sadia Afrin",
    location: "Uttara, Dhaka",
    rating: 4,
    comment: "Fresh winter gur, melts nicely in pitha. Packaging box was sturdy.",
    isApproved: false,
    createdAt: "2026-11-21T12:00:00Z",
  },
];

export const MOCK_CONTACTS: MockContactMessage[] = [
  {
    id: "msg-1",
    name: "Karim Uddin",
    phone: "01712345678",
    email: "karim@example.com",
    subject: "Bulk order inquiry",
    message: "I want to order 5kg of Jashore Patali Gur for a family event next week.",
    status: "NEW",
    adminReply: "",
    repliedAt: null,
    createdAt: "2026-11-24T10:30:00Z",
  },
  {
    id: "msg-2",
    name: "Mahmudul Haque",
    phone: "01815998877",
    email: "mahmud@example.com",
    subject: "Delivery time to Khulna",
    message: "How many days does COD delivery take to Khulna Sadar?",
    status: "REPLIED",
    adminReply: "Hello! Delivery to Khulna Sadar usually takes 4-5 business days via COD.",
    repliedAt: "2026-11-23T15:10:00Z",
    createdAt: "2026-11-23T13:20:00Z",
  },
  {
    id: "msg-3",
    name: "Tanjila Rahman",
    phone: "01922113344",
    email: "",
    subject: "Shutki spice level",
    message: "Is the Churi Shutki Bhorta very spicy or medium?",
    status: "READ",
    adminReply: "",
    repliedAt: null,
    createdAt: "2026-11-22T09:05:00Z",
  },
];

export const MOCK_USERS: MockUser[] = [
  {
    id: "usr-1",
    name: "Super Admin",
    email: "admin@bongaonbajar.com",
    phone: "01700000001",
    role: "ADMIN",
    status: "ACTIVE",
    emailVerified: true,
    createdAt: "2026-10-01T08:00:00Z",
  },
  {
    id: "usr-2",
    name: "Md. Rashedul Islam",
    email: "rashed@example.com",
    phone: "01712345678",
    role: "USER",
    status: "ACTIVE",
    emailVerified: true,
    createdAt: "2026-10-18T11:20:00Z",
  },
  {
    id: "usr-3",
    name: "Farhana Akter",
    email: "farhana@example.com",
    phone: "01811223344",
    role: "USER",
    status: "ACTIVE",
    emailVerified: true,
    createdAt: "2026-11-02T14:40:00Z",
  },
  {
    id: "usr-4",
    name: "Spam Account",
    email: "blocked@example.com",
    phone: "01900000000",
    role: "USER",
    status: "BLOCKED",
    emailVerified: false,
    createdAt: "2026-11-10T09:15:00Z",
  },
];
