// Stripe Webhook Handler
// Generates access codes after successful payment

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

// Code generation helpers
function generateCode(packageType) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    switch(packageType) {
        case 'START':
            return `START-${timestamp}`;
        case 'PRO':
            return `PRO-${random}`;
        case 'UNLIMITED':
            return `UNLIMITED-${random}`;
        default:
            return `CODE-${timestamp}`;
    }
}

async function sendEmailWithCode(email, code, packageType) {
    // TODO: Integrate with email service (SendGrid, Mailgun, Postmark)
    // For now, just log it
    console.log(`
    ================================
    SEND EMAIL TO: ${email}
    PACKAGE: ${packageType}
    CODE: ${code}
    ================================
    `);
    
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
        to: email,
        from: 'kontakt@ripost.pl',
        subject: `Twój kod dostępu do Ripost ${packageType}`,
        html: `
            <h1>Dziękujemy za zakup!</h1>
            <p>Twój kod dostępu: <strong>${code}</strong></p>
            <p>Przejdź do aplikacji: <a href="https://ripost.vercel.app/app.html">ripost.vercel.app/app.html</a></p>
        `
    };
    
    await sgMail.send(msg);
    */
}

module.exports = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            
            // Generate access code
            const packageType = session.metadata.packageType;
            const code = generateCode(packageType);
            
            // Get customer email
            const customerEmail = session.customer_details?.email;
            
            if (customerEmail) {
                // Send email with code
                await sendEmailWithCode(customerEmail, code, packageType);
                
                // Optional: Store code in database
                // await storeCodeInDatabase(code, packageType, customerEmail);
            }
            
            console.log('Payment successful:', {
                email: customerEmail,
                package: packageType,
                code: code
            });
            break;

        case 'payment_intent.payment_failed':
            console.error('Payment failed:', event.data.object);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};
