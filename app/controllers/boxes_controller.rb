class BoxesController < ApplicationController
  before_action :set_box, only: [:show, :edit, :update, :destroy]

  def index
    @boxes = Box.all
    respond_to do |format|
      format.html {}
      format.json {}
    end
  end

  #So I jam create, update, and destroy all into one function, since react doesn't
  #Necessarily know which one it's going to be using. A little akward - should maybe make it it's
  #Own function, seperate from create
  def create
    @box = Box.new(box_params)
    #If there any boxes at that location already, update them instaed of making a new one
    if Box.where(x: @box.x, y: @box.y).count > 0
      if @box.color == 0
        #To make a white box, just delete the box that's there
        Box.where(x: @box.x, y: @box.y).delete_all
      else
        #Otherwise, switch existing box to new box's color
        Box.where(x: @box.x, y: @box.y).first.update(color: @box.color)
      end
      respond_to do |format|
        format.html { redirect_to @box, notice: 'Box was successfully updated.' }
        format.json { render json: @box.color }
      end
    else
      #If there's no box, save the new box
      respond_to do |format|
        if @box.save
          format.html { redirect_to @box, notice: 'Box was successfully created.' }
          format.json { render json: @box.color }
        else
          format.html { render :new }
          format.json { render json: @box.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_box
      @box = Box.find(params[:id])
    end

    def box_params
      params.require(:box).permit(:x, :y, :color)
    end
end
