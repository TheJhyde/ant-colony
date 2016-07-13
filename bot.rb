def antMove(duration, name)
	r = Random.new

	size = 20
	botX = r.rand(size)
	botY = r.rand(size)

	orientation = 0

	duration.times do
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
	puts "The bot has finished"
end


r = Random.new
# A production version, which runs forever
# while true
# 	puts "Starting up bot"
# 	antMove(r.rand(1150)+10, [-1, 1, 1])
# 	sleep r.rand(600) + 300
# end

# A development version, which just runs a few times
antName = Array.new(3)
3.times do |i|
	antName[i] = r.rand(3) - 1
end
puts "Starting ant #{antName.join(",")}"
antMove(500, antName)