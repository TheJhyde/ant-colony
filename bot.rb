def knightMove(blockNumber)
	r = Random.new

	size = 20

	botX = r.rand(size)
	botY = r.rand(size)
	botColor = r.rand(3)
	botState = r.rand(4)

	50.times do
		puts "Placing box"
		if botState < 2
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

def antMove(duration, name)
	r = Random.new

	size = 20
	botX = r.rand(size)
	botY = r.rand(size)

	orientation = 0

	duration.times do
		puts "Moving ant"
		#Turn based on the current square and then increment the square up
		if Box.where(x: botX, y: botY).count == 0
			orientation = (orientation + name[0]) % 4
			Box.create(x: botX, y: botY, color: 1)
		elsif Box.where(x: botX, y: botY).first.color == 1
			orientation = (orientation + name[1]) % 4	
			Box.where(x: botX, y: botY).first.update(color: 2)
		else
			orientation = (orientation + name[2]) % 4
			Box.where(x: botX, y: botY).delete_all
		end
		#Move towards orientation
		case orientation
		when 0
			botX = (botX - 1) % size
		when 1
			botY = (botY - 1) % size
		when 2
			botX = (botX + 1) % size
		when 3
			botY = (botY + 1) % size
		else
			puts "Got an invalid orientation here"
		end
		sleep 0.5
	end
end

def iterateBox(x, y)
	if Box.where(x: x, y: y).count == 0
		Box.create(x: x, y: y, color: 1)
	elsif Box.where(x: x, y: y).first.color == 1
		Box.where(x: x, y: y).first.update(color: 2)
	else
		# 
		Box.where(x: x, y: y).delete_all
	end
end

def movesStraightBot
	botX = 12
	botY = 9
	100.times do
		botY = (botY + 1) % 20
		iterateBox(botX, botY)
		puts "This dumb bot is at #{botY}"
		sleep 0.5
	end
end

antMove(200, [-1, 1, 1])