import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Canteen.css";
import {
  Add,
  Remove,
  DeleteOutline,
  ShoppingCart,
  GetApp,
  Search,
  Restaurant,
  LocalDining,
  Favorite,
  FavoriteBorder,
  Star,
} from "@mui/icons-material";
import {
  Button,
  Badge,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Drawer,
  Divider,
  AppBar,
  Toolbar,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Paper,
  Tabs,
  Tab,
  Zoom,
} from "@mui/material";

// Import the same images from your original code
import vadaPavImg from "./assets/vadaPav.jpg";
import misalPavImg from "./assets/misalPav.jpeg";
import sabudanaVadaImg from "./assets/sabudanaVada.jpeg";
import dabeliImg from "./assets/dabeli.jpeg";
import vegSandwichImg from "./assets/vegSandwich.jpg";
import masalaChaiImg from "./assets/chai.jpeg";
import cuttingChaiImg from "./assets/chai.jpeg";

import vegBiryaniImg from "./assets/vegBiryani.jpg";
import thaliImg from "./assets/thali.jpeg";
import vegPulaoImg from "./assets/VegPulao.jpeg";

import logocanteen from "./assets/logocanteen.png";
import axios from "axios";

const Canteen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const foodCategories = [
    { id: 0, name: "All" },
    { id: 1, name: "Main Course" },
    { id: 2, name: "Snacks" },
    { id: 3, name: "Beverages" },
  ];

  const foodItems = [
    {
      id: 1,
      name: "Vada Pav",
      price: 25,
      image: vadaPavImg,
      category: "Snacks",
      rating: 4.5,
      description: "Spicy potato fritter inside a pav with chutney.",
    },
    {
      id: 2,
      name: "Misal Pav",
      price: 75,
      image: misalPavImg,
      category: "Main Course",
      rating: 4.7,
      description: "A spicy sprouted bean curry served with pav.",
    },
    {
      id: 3,
      name: "Sabudana Vada",
      price: 40,
      image: sabudanaVadaImg,
      category: "Snacks",
      rating: 4.2,
      description: "Crispy sabudana fritters perfect for teatime.",
    },
    {
      id: 4,
      name: "Dabeli",
      price: 30,
      image: dabeliImg,
      category: "Snacks",
      rating: 4.3,
      description:
        "Tangy mashed potato filling in a bun with chutney and pomegranate.",
    },
    {
      id: 5,
      name: "Veg Sandwich",
      price: 50,
      image: vegSandwichImg,
      category: "Snacks",
      rating: 4.3,
      description: "Fresh veg sandwich with tangy chutney.",
    },
    {
      id: 6,
      name: "Masala Chai",
      price: 15,
      image: masalaChaiImg,
      category: "Beverages",
      rating: 4.5,
      description: "Hot spiced tea brewed with milk and spices.",
    },
    {
      id: 7,
      name: "Cutting Chai",
      price: 10,
      image: cuttingChaiImg,
      category: "Beverages",
      rating: 4.0,
      description: "A small, strong, and flavorful cup of chai.",
    },
    {
      id: 8,
      name: "Veg Biryani",
      price: 110,
      image: vegBiryaniImg,
      category: "Main Course",
      rating: 4.6,
      description: "Aromatic rice cooked with vegetables and spices.",
    },
    {
      id: 9,
      name: "Thali",
      price: 120,
      image: thaliImg,
      category: "Main Course",
      rating: 4.3,
      description:
        "A balanced meal with a variety of curries, rice, chapati, and salad.",
    },
    {
      id: 10,
      name: "Veg Pulao",
      price: 90,
      image: vegPulaoImg,
      category: "Main Course",
      rating: 4.4,
      description: "Flavored rice with mixed vegetables served with raita.",
    },
  ];

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleAddToCart = (item) => {
    setLoading(true);
    setTimeout(() => {
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        setCart(
          cart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        );
      } else {
        setCart([...cart, { ...item, quantity: 1 }]);
      }
      setLoading(false);
      setSnackbar({
        open: true,
        message: `${item.name} added to cart!`,
        severity: "success",
      });
    }, 300);
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setSnackbar({
      open: true,
      message: "Item removed from cart",
      severity: "info",
    });
  };

  const handleIncreaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((itemId) => itemId !== id));
    } else {
      setFavorites([...favorites, id]);
      setSnackbar({
        open: true,
        message: "Added to favorites!",
        severity: "success",
      });
    }
  };

  const generateMenuPDF = () => {
    setLoading(true);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFont("Helvetica", "normal");
      try {
        doc.addImage(logocanteen, "PNG", 70, 10, 70, 30);
      } catch (error) {
        console.error("Error adding logo:", error);
      }
      doc.setFontSize(18);
      doc.text("Weekly Menu", 105, 50, { align: "center" });
      let startY = 60;
      doc.setFontSize(12);
      doc.text("Day", 20, startY);
      doc.text("Breakfast", 60, startY);
      doc.text("Lunch", 110, startY);
      doc.text("Dinner", 160, startY);
      doc.line(20, startY + 2, 190, startY + 2);
      startY += 10;
      const tableData = [
        ["Monday", "Poha", "Misal Pav", "Veg Sandwich"],
        ["Tuesday", "Upma", "Vada Pav", "Cutting Chai"],
        ["Wednesday", "Idli", "Dabeli", "Masala Chai"],
        ["Thursday", "Sheera", "Sabudana Vada", "Masala Chai"],
        ["Friday", "Dosa", "Misal Pav", "Veg Sandwich"],
        ["Saturday", "Utapam", "Vada Pav", "Cutting Chai"],
        ["Sunday", "Mendu Vada", "Dabeli", "Masala Chai"],
      ];
      tableData.forEach((row) => {
        doc.text(row[0], 20, startY);
        doc.text(row[1], 60, startY);
        doc.text(row[2], 110, startY);
        doc.text(row[3], 160, startY);
        startY += 10;
      });
      doc.save("Menu.pdf");
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Menu downloaded successfully!",
        severity: "success",
      });
    }, 800);
  };

  const placeOrder = async (orderItems) => {
    setLoading(true);
    try {
      // Directly pass the orderItems (your cart array) as the POST data.
      const response = await axios.post(
        "http://localhost:8080/api/order/place-order",
        { items: orderItems },
        {
          withCredentials: true,
        }
      );

      setSnackbar({
        open: true,
        message: "Order placed successfully! Check WhatsApp for updates.",
        severity: "success",
      });

      generateBillPDF();
      setCart([]);
    } catch (err) {
      console.error("Error placing order:", err);
      setSnackbar({
        open: true,
        message: "Failed to place order. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    await placeOrder(
      cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))
    );
    //console.log("order placed successfully");
  };

  const generateBillPDF = () => {
    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: "Cart is empty. Cannot generate bill.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFont("Helvetica", "normal");
      try {
        doc.addImage(logocanteen, "PNG", 70, 10, 70, 30);
      } catch (error) {
        console.error("Error adding logo:", error);
      }
      doc.setFontSize(18);
      doc.text("Billing Receipt", 105, 50, { align: "center" });

      let startY = 60;
      doc.setFontSize(12);
      doc.text("Item", 20, startY);
      doc.text("Price", 80, startY);
      doc.text("Quantity", 120, startY);
      doc.text("Total", 160, startY);
      doc.line(20, startY + 2, 190, startY + 2);
      startY += 10;
      cart.forEach((item) => {
        doc.text(item.name, 20, startY);
        doc.text(`Rs ${item.price}`, 80, startY);
        doc.text(`${item.quantity}`, 120, startY);
        doc.text(`Rs ${item.price * item.quantity}`, 160, startY);
        startY += 10;
      });
      doc.setFontSize(14);
      doc.text(`Total: Rs ${calculateTotal()}`, 105, startY + 10, {
        align: "center",
      });
      doc.save("Bill.pdf");
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Bill generated successfully!",
        severity: "success",
      });
      setCart([]);
    }, 1000);
  };

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);
    const matchesCategory =
      activeTab === 0 || item.category === foodCategories[activeTab].name;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <AppBar
        position="sticky"
        className="bg-white text-gray-800 shadow-md"
        id="AppBarHidden"
      >
        <Toolbar className="flex justify-between items-center">
          <div className="flex items-center"></div>

          <div className="hidden md:flex items-center space-x-4">
            <Badge badgeContent={cart.length} color="primary">
              <ShoppingCart className="text-gray-700" />
            </Badge>
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={generateMenuPDF}
              className="bg-orange-400 hover:bg-orange-600"
              style={{ backgroundColor: "#FB923C" }}
            >
              Menu
            </Button>
          </div>

          <IconButton
            className="lg:hidden"
            onClick={() => setMobileCartOpen(true)}
          >
            <Badge badgeContent={cart.length} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Food Items Section */}
        <div className="lg:w-3/4">
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for food..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <Search className="text-gray-400 mr-2" />,
                  className: "bg-white rounded-full",
                }}
                className="md:max-w-md"
              />
              <Button
                variant="contained"
                startIcon={<GetApp />}
                onClick={generateMenuPDF}
                className="bg-orange-400 hover:bg-orange-600 md:hidden"
                style={{ backgroundColor: "#FB923C" }}
              >
                Download Menu
              </Button>
            </div>

            <Paper elevation={0} className="bg-transparent">
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                className="mb-4"
              >
                {foodCategories.map((category) => (
                  <Tab key={category.id} label={category.name} />
                ))}
              </Tabs>
            </Paper>
          </div>

          {/* Food Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <Zoom
                  in={true}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  key={item.id}
                >
                  <Card
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    style={{ borderRadius: "15px" }}
                  >
                    <div className="relative">
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt={item.name}
                        className="h-48 object-cover"
                      />
                      <IconButton
                        className="absolute top-6 right-0 bg-white/80 hover:bg-white"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        {favorites.includes(item.id) ? (
                          <Favorite className="text-red-500" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                      <Chip
                        label={item.category}
                        size="small"
                        className="absolute bottom-2 left-2 bg-white/80"
                      />
                    </div>
                    <CardContent>
                      <div className="flex justify-between items-start mb-2">
                        <Typography
                          variant="h6"
                          component="h3"
                          className="font-bold"
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          className="font-bold text-neutral-800"
                        >
                          ₹{item.price}
                        </Typography>
                      </div>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="mb-3 line-clamp-2"
                      >
                        {item.description}
                      </Typography>

                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(item.rating)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <Typography variant="body2" className="ml-1">
                          {item.rating}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-full overflow-hidden">
                          <IconButton
                            size="small"
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="text-indigo-600"
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography className="px-2">
                            {cart.find((cartItem) => cartItem.id === item.id)
                              ?.quantity || 0}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleIncreaseQuantity(item.id)}
                            className="text-indigo-600"
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => handleAddToCart(item)}
                          className="bg-orange-400 hover:bg-orange-600 rounded-full"
                          style={{ backgroundColor: "#FB923C" }}
                          size="small"
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Zoom>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <Typography variant="h6" color="textSecondary">
                  No items found. Try a different search term.
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section - Desktop */}
        <div className="hidden lg:block lg:w-1/4">
          <Card
            className="sticky top-24 overflow-hidden shadow-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white"
            style={{ borderRadius: "15px" }}
          >
            <CardContent>
              <Typography
                variant="h5"
                className="font-bold mb-4 flex items-center"
              >
                <ShoppingCart className="mr-2" /> Your Order
              </Typography>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <LocalDining className="text-6xl mb-2 opacity-50" />
                  <Typography>Your cart is empty</Typography>
                  <Typography variant="body2" className="mt-2 opacity-75">
                    Add some delicious items to get started
                  </Typography>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 rounded-md object-cover mr-3"
                          />
                          <div>
                            <Typography variant="body1" className="font-medium">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" className="opacity-75">
                              ₹{item.price} × {item.quantity}
                            </Typography>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Typography
                            variant="body1"
                            className="font-medium mr-2"
                          >
                            ₹{item.price * item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-white/70 hover:text-white"
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Divider className="my-4 bg-white/20" />

                  <div className="flex justify-between items-center mb-2">
                    <Typography>Subtotal</Typography>
                    <Typography className="font-medium">
                      ₹{calculateTotal()}
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <Typography>Delivery Fee</Typography>
                    <Typography className="font-medium">₹0</Typography>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <Typography variant="h6" className="font-bold">
                      Total
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      ₹{calculateTotal()}
                    </Typography>
                  </div>
                </>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                disabled={cart.length === 0 || loading}
                className=" text-indigo-700 hover:bg-gray-100 font-medium py-3 rounded-full"
                startIcon={
                  loading ? <CircularProgress size={20} /> : <ShoppingCart />
                }
              >
                {loading ? "Processing..." : "Checkout"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Mobile Cart Drawer */}
      <Drawer
        anchor="right"
        open={mobileCartOpen}
        onClose={() => setMobileCartOpen(false)}
      >
        <Box className="w-80 p-4 h-full bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h6" className="font-bold">
              Your Order
            </Typography>
            <IconButton
              onClick={() => setMobileCartOpen(false)}
              className="text-white"
            >
              <DeleteOutline />
            </IconButton>
          </div>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <LocalDining className="text-6xl mb-2 opacity-50" />
              <Typography>Your cart is empty</Typography>
              <Typography variant="body2" className="mt-2 opacity-75">
                Add some delicious items to get started
              </Typography>
            </div>
          ) : (
            <>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
                  >
                    <div>
                      <Typography variant="body1" className="font-medium">
                        {item.name} × {item.quantity}
                      </Typography>
                      <Typography variant="body2" className="opacity-75">
                        ₹{item.price * item.quantity}
                      </Typography>
                    </div>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-white/70 hover:text-white"
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
              <Divider className="my-4 bg-white/20" />
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h6" className="font-bold">
                  Total
                </Typography>
                <Typography variant="h6" className="font-bold">
                  ₹{calculateTotal()}
                </Typography>
              </div>
            </>
          )}
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              handleCheckout();
              setMobileCartOpen(false);
            }}
            disabled={cart.length === 0 || loading}
            className="bg-white text-indigo-700 hover:bg-gray-100 font-medium py-3 rounded-full"
            startIcon={
              loading ? <CircularProgress size={20} /> : <ShoppingCart />
            }
          >
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </Box>
      </Drawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Paper className="p-6 rounded-xl flex items-center gap-4">
            <CircularProgress />
            <Typography>Processing your request...</Typography>
          </Paper>
        </div>
      )}
    </div>
  );
};
export default Canteen;
