class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :image, null: false
      t.text :description, null: false
      t.string :category, null: false
      t.integer :stock, null: false, default: 0

      t.timestamps
    end

    add_index :products, :name, unique: true
    add_index :products, :category
  end
end