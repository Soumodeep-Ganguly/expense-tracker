const Category = require('../models/category');
const colors = require('colors')

module.exports.checkCategories = async () => {
    try {
        let categories = [
            "Food", 
            "Restaurants", 
            "Groceries", 
            "Transportation", 
            "Public Transportation", 
            "Rent/Mortgage", 
            "Electricity", 
            "Water", 
            "Gas", 
            "Home Maintenance", 
            "Car Maintenance", 
            "Entertainment", 
            "Movies", 
            "Books", 
            "Gym Memberships", 
            "Medical Expenses", 
            "Health Insurance Premiums", 
            "Clothing and Accessories", 
            "Electronics", 
            "Gifts and Presents", 
            "Online Shopping", 
            "Flights and Airfare", 
            "Accommodation", 
            "Sightseeing and Tours", 
            "Travel Insurance", 
            "Tuition Fees", 
            "Online Courses", 
            "Credit Card Payments", 
            "Loan Repayments", 
            "Haircuts and Styling", 
            "Skincare and Cosmetics", 
            "Spa Treatments", 
            "Charitable Contributions", 
            "Donations to Nonprofits"
        ]

        let existCategory = await Category.findOne({ name: categories[0], user: null })
        if(existCategory) return console.log(colors.blue("Categories Exists."))

        await Category.insertMany(categories.map(categoryName => ({ name: categoryName, user: null })));
        console.log(colors.green(`Successfully added ${categories.length} pre-defined Categories.`));
    } catch (err) {
        console.log(colors.red("Unable to set pre-defined Categories."))
    }
}