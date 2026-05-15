class RemoveCartFromCartItems < ActiveRecord::Migration[8.0]
  def change
    remove_reference :cart_items, :cart, null: false, foreign_key: true
  end
end
