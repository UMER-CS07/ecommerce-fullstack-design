# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

products = [
	{
		name: "Soft chairs",
		price: 19,
		image: "sofa.png",
		description: "Comfortable soft chair for living rooms and lounge spaces.",
		category: "Home and outdoor",
		stock: 24
	},
	{
		name: "Sofa & chair",
		price: 19,
		image: "sofa.png",
		description: "Compact sofa and chair set for modern home interiors.",
		category: "Home and outdoor",
		stock: 18
	},
	{
		name: "Kitchen dishes",
		price: 19,
		image: "kicthen-mixer.png",
		description: "Essential kitchen dishware for everyday cooking and serving.",
		category: "Home and outdoor",
		stock: 30
	},
	{
		name: "Smart watches",
		price: 19,
		image: "smart-watches.png",
		description: "Feature-packed smartwatch for fitness, alerts, and daily use.",
		category: "Consumer electronics",
		stock: 42
	},
	{
		name: "Kitchen mixer",
		price: 100,
		image: "kicthen-mixer.png",
		description: "Kitchen mixer for smoothies, batter, and meal prep.",
		category: "Home and outdoor",
		stock: 12
	},
	{
		name: "Blenders",
		price: 39,
		image: "blender.png",
		description: "Blender for quick food preparation and home use.",
		category: "Home and outdoor",
		stock: 20
	},
	{
		name: "Home appliance",
		price: 19,
		image: "home-appli.png",
		description: "Reliable home appliance for daily household tasks.",
		category: "Home and outdoor",
		stock: 15
	},
	{
		name: "Coffee maker",
		price: 10,
		image: "coffe.png",
		description: "Compact coffee maker for a quick morning brew.",
		category: "Home and outdoor",
		stock: 27
	},
	{
		name: "Cameras",
		price: 89,
		image: "camera.png",
		description: "Digital camera for everyday photography and content creation.",
		category: "Consumer electronics",
		stock: 16
	},
	{
		name: "Headphones",
		price: 10,
		image: "headphone.png",
		description: "Wireless headphones with clear audio and comfort fit.",
		category: "Consumer electronics",
		stock: 33
	},
	{
		name: "Smartphones",
		price: 90,
		image: "mobile.png",
		description: "Modern smartphone with a bright display and long battery life.",
		category: "Consumer electronics",
		stock: 22
	},
	{
		name: "Gaming set",
		price: 35,
		image: "headphone.png",
		description: "Gaming-ready accessories for immersive audio and play.",
		category: "Consumer electronics",
		stock: 14
	},
	{
		name: "Laptops & PC",
		price: 340,
		image: "laptop.png",
		description: "Laptop and PC products for productivity and entertainment.",
		category: "Consumer electronics",
		stock: 11
	},
	{
		name: "Electric kettle",
		price: 240,
		image: "coffe.png",
		description: "Fast-boil electric kettle for home and office use.",
		category: "Consumer electronics",
		stock: 9
	}
]

products.each do |attributes|
	product = Product.find_or_initialize_by(name: attributes[:name])
	product.update!(attributes)
end
