const express = require('express');
const router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    try {
        const session = await Stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: Object.values(req.body.cartDetails).map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.title,
                        images: [item.image]
                    },
                    unit_amount: Math.round(item.price * 100), // Convertir en cents
                },
                quantity: item.quantity,
            })),
            success_url: `${process.env.CLIENT_URL}?success=true`,
            cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
        });
        res.json({ sessionId: session.id });
    } catch (e) {
        console.error("Stripe error:", e);
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;