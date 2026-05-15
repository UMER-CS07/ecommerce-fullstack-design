Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Add your Vercel URL here!
    origins 'https://ecommerce-fullstack-design-woad.vercel.app', 'http://localhost:5173'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization']
  end
end