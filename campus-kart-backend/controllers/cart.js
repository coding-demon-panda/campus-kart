const Listing = require('../models/listing'); 
const User = require('../models/user'); 

module.exports.showCart = async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const user = await User.findById(req.user._id).populate('cart');
    res.render('cart/cart.ejs', { cartItems: user.cart });
};

module.exports.addToCart = async (req, res) => {
    const listingId = req.body.listingId;
    const listing = await Listing.findById(listingId);
    const user = await User.findById(req.user._id);

    const isInCart = user.cart.some(item => item.equals(listing._id));

    if (isInCart) {
        req.flash('error', 'This item is already in your cart.');
    } else {
        user.cart.push(listing);
        await user.save();
        req.flash('success', 'Item added to your cart.');
    }

    res.redirect(`/listings/${listingId}`);
};

module.exports.removeFromCart = async (req, res) => {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);
    
    user.cart = user.cart.filter(item => item._id.toString() !== listingId);
    await user.save();

    res.redirect('/cart');
};
