const { createApp, ref, computed, onMounted, onUnmounted } = Vue;
        
        createApp({
            setup() {
                // Data
                const menuItems = ref([
                    {
                        id: 1,
                        name: "Paket Premium Prasmanan",
                        description: "Paket lengkap untuk 500 orang dengan 5 jenis lauk, 3 sayuran, nasi, buah, dan minuman.",
                        price:20500000,
                        category: "Prasmanan",
                        image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        id: 2,
                        name: "Nasi Kotak Executive",
                        description: "Nasi kotak dengan ayam bakar, telur balado, sayur, kerupuk dan buah. Minimum order 20 box.",
                        price: 35000,
                        category: "Nasi Kotak",
                        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        id: 3,
                        name: "Tumpeng Besar",
                        description: "Nasi tumpeng besar dengan lauk pelengkap untuk 20-25 orang. Free konsultasi dekorasi.",
                        price: 1000000,
                        category: "Tumpeng",
                        image: "tumpeng.png"
                    },
                    {
                        id: 4,
                        name: "Paket Wedding Luxury",
                        description: "Khusus pernikahan dengan menu lengkap, dekorasi meja, dan pelayanan profesional.",
                        price: 30000000,
                        category: "Pernikahan",
                        image: "wedding.jpg"
                    },
                    {
                        id: 5,
                        name: "Snack Box Meeting",
                        description: "Berisi risoles, pastel, lemper, lapis legit, dan minuman. Cocok untuk rapat atau seminar.",
                        price: 25000,
                        category: "Snack",
                        image: "snackbox.jpg"
                    },
                    {
                        id: 6,
                        name: "Paket Syukuran",
                        description: "Paket ekonomis untuk acara syukuran dengan nasi box atau prasmanan sederhana.",
                        price: 25000,
                        category: "Syukuran",
                        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    }
                ]);
                
                const testimonials = ref([
                    {
                        id: 1,
                        name: "Budi Santoso",
                        event: "Pernikahan",
                        comment: "Cateringnya sangat lezat dan pelayanannya profesional. Tamu-tamu saya sangat puas!",
                        avatar: "user.png"
                    },
                    {
                        id: 2,
                        name: "Dewi Lestari",
                        event: "Seminar Perusahaan",
                        comment: "Sudah bekerjasama beberapa kali untuk acara perusahaan. Selalu tepat waktu dan rasanya enak.",
                        avatar: "user.png"
                    },
                    {
                        id: 3,
                        name: "Anton Wijaya",
                        event: "Ulang Tahun",
                        comment: "Anak-anak sangat suka makanannya. Presentationnya juga bagus dan menarik.",
                        avatar: "user.png"
                    }
                ]);
                
                const cart = ref([]);
                const showCart = ref(false);
                const mobileMenuOpen = ref(false);
                const activeSection = ref('home');
                
                const customer = ref({
                    name: '',
                    phone: '',
                    address: '',
                    notes: ''
                });
                
                const contact = ref({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                
                // Computed properties
                const cartTotalItems = computed(() => {
                    return cart.value.reduce((total, item) => total + item.quantity, 0);
                });
                
                const cartSubtotal = computed(() => {
                    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
                });
                
                const tax = computed(() => {
                    return cartSubtotal.value * 0.1; // 10% tax
                });
                
                const cartTotal = computed(() => {
                    return cartSubtotal.value + tax.value;
                });
                
                // Methods
                const formatPrice = (price) => {
                    return new Intl.NumberFormat('id-ID').format(price);
                };
                
                const addToCart = (item) => {
                    const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
                    
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.value.push({
                            ...item,
                            quantity: 1
                        });
                    }
                    
                    // Show notification
                    alert(`${item.name} telah ditambahkan ke keranjang!`);
                };
                
                const updateQuantity = (item, change) => {
                    const cartItem = cart.value.find(cartItem => cartItem.id === item.id);
                    
                    if (cartItem) {
                        cartItem.quantity += change;
                        
                        if (cartItem.quantity <= 0) {
                            removeFromCart(item);
                        }
                    }
                };
                
                const removeFromCart = (item) => {
                    const index = cart.value.findIndex(cartItem => cartItem.id === item.id);
                    
                    if (index !== -1) {
                        cart.value.splice(index, 1);
                    }
                };
                
                const submitOrder = () => {
                    if (!customer.value.name || !customer.value.phone || !customer.value.address) {
                        alert('Harap isi semua data pemesanan yang diperlukan!');
                        return;
                    }
                    
                    // Format pesan untuk WhatsApp
                    let message = `Halo, saya ingin memesan catering dengan detail berikut:%0A%0A`;
                    message += `*Nama:* ${customer.value.name}%0A`;
                    message += `*No. HP:* ${customer.value.phone}%0A`;
                    message += `*Alamat:* ${customer.value.address}%0A`;
                    
                    if (customer.value.notes) {
                        message += `*Catatan:* ${customer.value.notes}%0A`;
                    }
                    
                    message += `%0A*Detail Pesanan:*%0A`;
                    
                    cart.value.forEach(item => {
                        message += `- ${item.name} x${item.quantity} : Rp ${formatPrice(item.price * item.quantity)}%0A`;
                    });
                    
                    message += `%0A*Subtotal:* Rp ${formatPrice(cartSubtotal.value)}%0A`;
                    message += `*Pajak (10%):* Rp ${formatPrice(tax.value)}%0A`;
                    message += `*Total:* Rp ${formatPrice(cartTotal.value)}%0A%0A`;
                    message += `Terima kasih.`;
                    
                    // Redirect ke WhatsApp
                    window.open(`https://wa.me/6285691009132?text=${message}`, '_blank');
                    
                    // Reset cart and customer data
                    cart.value = [];
                    customer.value = {
                        name: '',
                        phone: '',
                        address: '',
                        notes: ''
                    };
                    
                    // Close cart
                    showCart.value = false;
                    
                    // Show success message
                    alert('Pesanan telah dikirim melalui WhatsApp! Kami akan segera menghubungi Anda.');
                };
                
                const sendMessage = () => {
                    if (!contact.value.name || !contact.value.email || !contact.value.phone || !contact.value.message) {
                        alert('Harap isi semua field yang diperlukan!');
                        return;
                    }
                    
                    // Format pesan untuk WhatsApp
                    let message = `Halo, saya ${contact.value.name} ingin bertanya tentang layanan catering.%0A%0A`;
                    message += `*Email:* ${contact.value.email}%0A`;
                    message += `*No. HP:* ${contact.value.phone}%0A%0A`;
                    message += `*Pesan:*%0A${contact.value.message}`;
                    
                    // Redirect ke WhatsApp
                    window.open(`https://wa.me/6285691009132?text=${message}`, '_blank');
                    
                    // Reset contact form
                    contact.value = {
                        name: '',
                        email: '',
                        phone: '',
                        message: ''
                    };
                    
                    // Show success message
                    alert('Pesan telah dikirim melalui WhatsApp! Kami akan segera menghubungi Anda.');
                };
                
                const handleScroll = () => {
                    const sections = ['home', 'about', 'menu', 'services', 'testimonials', 'contact'];
                    const scrollPosition = window.scrollY + 100;
                    
                    for (const section of sections) {
                        const element = document.getElementById(section);
                        if (element) {
                            const offsetTop = element.offsetTop;
                            const offsetBottom = offsetTop + element.offsetHeight;
                            
                            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                                activeSection.value = section;
                                break;
                            }
                        }
                    }
                };
                
                // Lifecycle hooks
                onMounted(() => {
                    window.addEventListener('scroll', handleScroll);
                    handleScroll(); // Initial check
                });
                
                onUnmounted(() => {
                    window.removeEventListener('scroll', handleScroll);
                });
                
                return {
                    menuItems,
                    testimonials,
                    cart,
                    showCart,
                    mobileMenuOpen,
                    activeSection,
                    customer,
                    contact,
                    cartTotalItems,
                    cartSubtotal,
                    tax,
                    cartTotal,
                    formatPrice,
                    addToCart,
                    updateQuantity,
                    removeFromCart,
                    submitOrder,
                    sendMessage
                };
            }
        }).mount('#app');