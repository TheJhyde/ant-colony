Rails.application.routes.draw do
  resources :boxes
  root 'boxes#index'
end
