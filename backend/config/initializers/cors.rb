Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # The "Ultimate Hammer": Allow all origins for the final submission
    origins '*'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization']
  end
end