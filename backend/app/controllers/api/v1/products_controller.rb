module Api
  module V1
    class ProductsController < ApplicationController
      before_action :authenticate_user!, only: %i[create update destroy]
      before_action :authorize_admin!, only: %i[create update destroy]
      before_action :set_product, only: %i[show update destroy]

      def index
        products = Product.order(:id)

        render json: {
          data: products.map { |product| serialize_product(product) }
        }
      end

      def show
        render json: {
          data: serialize_product(@product)
        }
      end

      def create
        product = Product.new(product_params)

        if product.save
          render json: { data: serialize_product(product) }, status: :created
        else
          render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @product.update(product_params)
          render json: { data: serialize_product(@product) }
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @product.destroy
        render json: { message: 'Product deleted successfully' }, status: :ok
      end

      private

      def set_product
        @product = Product.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Product not found' }, status: :not_found
      end

      def product_params
        params.require(:product).permit(:name, :price, :image, :description, :category, :stock)
      end

      def authorize_admin!
        unless current_user&.admin?
          render json: { error: 'You are not authorized to perform this action.' }, status: :forbidden
        end
      end

      def serialize_product(product)
        {
          id: product.id,
          attributes: product.as_json(only: %i[name price image description category stock])
        }
      end
    end
  end
end