Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # This allows all Vercel preview links and your local development
    origins 'https://ecommerce-fullstack-design-woad.vercel.app', 
            /https:\/\/.*\.vercel\.app/,
            'http://localhost:5173'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization']
  end
end