class Api::V1::CartItemsController < ApplicationController
  before_action :authenticate_user!

  def index
    @cart_items = current_user.cart_items.includes(:product)
    render json: {
      data: @cart_items.map { |item| serialize_cart_item(item) }
    }
  end

  def create
    @cart_item = current_user.cart_items.find_or_initialize_by(product_id: cart_item_params[:product_id])
    
    if @cart_item.new_record?
      @cart_item.quantity = cart_item_params[:quantity] || 1
    else
      @cart_item.quantity += (cart_item_params[:quantity] || 1).to_i
    end

    if @cart_item.save
      render json: { data: serialize_cart_item(@cart_item) }, status: :created
    else
      render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @cart_item = current_user.cart_items.find(params[:id])
    
    if @cart_item.update(cart_item_params)
      render json: { data: serialize_cart_item(@cart_item) }
    else
      render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @cart_item = current_user.cart_items.find(params[:id])
    @cart_item.destroy
    head :no_content
  end

  private

  def cart_item_params
    params.require(:cart_item).permit(:product_id, :quantity)
  end

  def serialize_cart_item(item)
    {
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category
      }
    }
  end
end
