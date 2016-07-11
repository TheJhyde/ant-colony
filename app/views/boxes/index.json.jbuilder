json.array!(@boxes) do |box|
  json.extract! box, :x, :y, :color
end
