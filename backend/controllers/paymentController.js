const Razorpay = require('razorpay');
const {RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET} = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

const renderProductPage = async(req, res)=>{

    try {
        res.render('product');
    } catch (error) {
        console.log(error.message);
        
    }
}

const createOrder = async(req, res)=>{
    
}