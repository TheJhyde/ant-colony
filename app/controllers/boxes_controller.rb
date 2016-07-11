class BoxesController < ApplicationController
  before_action :set_box, only: [:show, :edit, :update, :destroy]

  # GET /boxes
  # GET /boxes.json
  def index
    @boxes = Box.all
    respond_to do |format|
      format.html {}
      format.json {}
    end
  end

  # GET /boxes/1
  # GET /boxes/1.json
  def show
  end

  # GET /boxes/new
  def new
    @box = Box.new
  end

  # GET /boxes/1/edit
  def edit
  end

  # POST /boxes
  # POST /boxes.json
  #So I jam create, update, and destroy all into one function. So be it
  def create
    @box = Box.new(box_params)
    #If there any boxes at that location already, update them
    if Box.where(x: @box.x, y: @box.y).count > 0
      if @box.color == 0
        Box.where(x: @box.x, y: @box.y).delete_all
      else
        Box.where(x: @box.x, y: @box.y).first.update(color: @box.color)
      end
      respond_to do |format|
        format.html { redirect_to @box, notice: 'Box was successfully updated.' }
        format.json { render json: @box.color }
      end
    else
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

  # PATCH/PUT /boxes/1
  # PATCH/PUT /boxes/1.json
  def update
    respond_to do |format|
      if @box.update(box_params)
        format.html { redirect_to @box, notice: 'Box was successfully updated.' }
        format.json { render :show, status: :ok, location: @box }
      else
        format.html { render :edit }
        format.json { render json: @box.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /boxes/1
  # DELETE /boxes/1.json
  def destroy
    @box.destroy
    respond_to do |format|
      format.html { redirect_to boxes_url, notice: 'Box was successfully destroyed.' }
      format.json { head :no_content }
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
