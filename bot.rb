@r = Random.new

def knightMove(blockNumber)

	size = 20

	botX = @r.rand(size)
	botY = @r.rand(size)
	botColor = @r.rand(2) + 1
	botState = @r.rand(4)

	50.times do
		puts "Placing box"
		if botState < 3
			botX = (botX + 1) % size
			botState += 1
		else
			botY = (botY + 1) % size
			botState = 0
		end

		if Box.where(x: botX, y: botY).count > 0
			Box.where(x: botX, y: botY).first.update(color: botColor)
		else
			Box.create(x: botX, y: botY, color: botColor)
		end
		sleep 0.6
	end
end


knightMove(@r(40)+10)